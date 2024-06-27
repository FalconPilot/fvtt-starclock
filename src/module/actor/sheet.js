import { basePath } from "../../constants.js"
import { checkFumble, checkSuccess, getRollResults } from "../../utils/roll.js"

export default class StarclockActorSheet extends ActorSheet {
  // Template name
  get template () {
    return `${basePath}/templates/actors/${this.actor.type}.hbs`
  }

  // Default options
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 840,
      height: 495,
      resizable: false,
      classes: ['daicom-tablet'],
      tabs: [{
        navSelector: '.tabs',
        contentSelector: '.tab-content',
        initial: 'identity',
      }],
    })
  }

  // Override renderer
  async _renderOuter(...args) {
    return super._renderOuter(...args)
      .then(this.appendAnimation())
  }

  // Activate listeners
  activateListeners(html) {
    super.activateListeners(html)

    html.find('.item-delete').on('click', this._onItemDelete.bind(this))
    html.find('.item-edit').on('click', this._onItemEdit.bind(this))
    html.find('.item-stash').on('click', this._onItemStash.bind(this))
    html.find('.item-unstash').on('click', this._onItemUnstash.bind(this))
    html.find('.item-repair').on('click', this._onItemRepair.bind(this))
    html.find('.reload-wpn').on('click', this._onWeaponReload.bind(this))
    html.find('.gun-roll').on('click', this._onGunRoll.bind(this))
    html.find('.melee-roll').on('click', this._onMeleeRoll.bind(this))
  }

  // Append animation component
  appendAnimation() {
    const delay = 20
    let count = 0
    const intervalId = window.setInterval(() => {
      const wrapper = document.getElementById(this.id)
      // Display wrapper if found
      if (wrapper) {
        window.clearInterval(intervalId)
        const animWrapper = document.createElement('div')
        animWrapper.className = 'daicom-anim flexcol centerv centerh'
  
        const lockWrapper = document.createElement('div')
        lockWrapper.className = 'daicom-anim-lock flexrow centerv lefth'
  
        animWrapper.appendChild(lockWrapper)
        wrapper.appendChild(animWrapper)

      // Abort animation if delay is over 200ms
      } else if (delay * count > 200) {
        window.clearInterval(intervalId)
      // Increment count
      } else {
        count++
      }
    }, 20)
  }

  // On item repair
  _onItemRepair (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    return item.repairItem()
  }

  // Gun roll macro
  async _onGunRoll (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    if (item.type !== 'rangedWeapon') {
      return ui.notifications.error('Those rolls can only be done with ranged weapons')
    }

    if (item.system.fumbleAmount >= item.system.solidity) {
      return ui.notifications.warn('Item must be repaired!')
    }

    const loadedAmmoData = this.actor.items.get(item.system.loadedAmmo)

    if (!loadedAmmoData) {
      return ui.notifications.error('No loaded ammo found')
    }

    const isMastered = this.actor.system.weaponMasteries[item.system.weaponShape]

    const content = await renderTemplate('systems/starclock/templates/dialogs/gunroll.hbs', {
      item,
      mastered: isMastered,
      config: CONFIG.starclock,
    })

    const baseDifficulty = 5
    const baseComplexity = 2

    // Create Dialog
    const dialog = new Dialog({
      title: item.name,
      content,
      default: 'submit',
      buttons: {
        submit: {
          icon: '<i class="fas fa-dice-six"></i>',
          label: game.i18n.localize('SCLK.Confirm'),
          callback: async html => {
            const firingRate = html.find('select[name=firingRate]').val()
            const range = html.find('select[name=range]').val()
            const targetArmor = parseInt(html.find('input[name=targetArmor]').val(), 10)
            const targetDodge = parseInt(html.find('input[name=targetDodge]').val(), 10)
            const isMoving = html.find('input[name=isMoving').is(':checked')

            const weaponMaxRange = {
              short: 1,
              medium: 2,
              long: 3,
              extreme: 4,
            }[item.system.range] ?? 0

            const firingRateMalus = {
              single: 0,
              semi: 1,
              auto: 2,
            }[firingRate] ?? 0


            const ammoFired = item.system.firingRates[firingRate]
            const firingRateDmg = ammoFired - 1
            const rangeMalus = Math.max(0, range - weaponMaxRange)
            const armorMalus = Math.max(0, targetArmor - loadedAmmoData.system.pierce ?? 0)
            const masteryBonus = isMastered ? this.actor.system.combat.shooting : 0
            const movingTargetMalus = isMoving ? Math.max(1, targetDodge) : 0
            const accuracyMod = loadedAmmoData.accuracyMod ?? 0

            // Calculate complexity
            const complexity = baseComplexity
              + movingTargetMalus
              + firingRateMalus

            // Calculate difficulty
            const rawDifficulty = baseDifficulty
              + armorMalus
              + rangeMalus
              - accuracyMod

            const difficulty = Math.min(10, Math.max(1, rawDifficulty))

            // Calculate amount of dice
            const hitDice = complexity
              + masteryBonus

            // Calculate final damage amount
            const finalDamage = loadedAmmoData.system.damage
              + firingRateDmg

            // Generate roll
            const roll = await new Roll(`${Math.max(hitDice, 1)}D10`).evaluate()

            // Generate roll result data
            const results = getRollResults(roll, complexity, difficulty)
            const isFumble = checkFumble(roll, complexity, difficulty, item.system.reliability)
            const isSuccess = checkSuccess(roll, complexity, difficulty)

            // Compile header
            const flavorHeader = await renderTemplate('systems/starclock/templates/chat/gunroll.hbs', {
              item,
              loadedAmmo: {
                ...loadedAmmoData,
                system: {
                  ...loadedAmmoData.system,
                  damage: finalDamage,
                },
              },
              config: CONFIG.starclock,
              firingRate: `SCLK.FiringRates.${firingRate}`,
              ammoFired,
            })

            // Compile content
            const messageContent = await renderTemplate('systems/starclock/templates/chat/diceroll.hbs', {
              results,
              isFumble,
              isSuccess,
              complexity,
              difficulty,
              successKey: 'SCLK.Hit',
              failureKey: 'SCLK.Miss',
              fumbleKey: 'SCLK.Misfire',
            })

            const sound = isFumble
              ? 'systems/starclock/assets/sfx/trigger_click.ogg'
              : item.system.firingSound
              ? `${item.system.firingSound}_${firingRate}.ogg`
              : CONFIG.sounds.dice

            const rollMode = game.settings.get('core', 'rollMode')

            // Create chat message data
            const msgData = ChatMessage.applyRollMode({
              user: game.user.id,
              flavor: flavorHeader,
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              rollMode: game.settings.get('core', 'rollMode'),
              content: messageContent,
              sound,
            }, rollMode)

            // Send roll to chat
            return ChatMessage.create(msgData).then(() => {
              if (isFumble) {
                return item.update({ 'system.fumbleAmount': item.system.fumbleAmount + 1 })
              }

              return item.update({ 'system.ammoCurrent': item.system.ammoCurrent - ammoFired })
            })
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('SCLK.Cancel'),
          callback: () => {},
        },
      },
    })

    return dialog.render(true)
  }

  // On melee weapon roll
  async _onMeleeRoll (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    if (item.type !== 'meleeWeapon') {
      return ui.notifications.error('Those rolls can only be done with melee weapons')
    }

    const isMastered = this.actor.system.weaponMasteries[item.system.weaponShape]

    const content = await renderTemplate('systems/starclock/templates/dialogs/meleeroll.hbs', {
      item,
      mastered: isMastered,
    })

    const baseComplexity = 2
    const baseDifficulty = 6

    // Create Dialog
    const dialog = new Dialog({
      title: item.name,
      content,
      default: 'submit',
      buttons: {
        submit: {
          icon: '<i class="fas fa-dice-six"></i>',
          label: game.i18n.localize('SCLK.Confirm'),
          callback: async html => {
            const targetArmor = parseInt(html.find('input[name=targetArmor]').val(), 10)
            const targetDodge = parseInt(html.find('input[name=targetDodge]').val(), 10)

            const masteryBonus = isMastered ? 1 : 0
            const armorMalus = Math.max(0, targetArmor - item.system.pierce)

            // Calculate complexity
            const complexity = baseComplexity
              + targetDodge
              - masteryBonus

            // Calculate difficulty
            const rawDifficulty = baseDifficulty
              + armorMalus

            const difficulty = Math.max(1, Math.min(10, rawDifficulty))

            const hitDice = complexity
              + this.actor.system.combat.melee
              + masteryBonus

            // Generate roll
            const roll = await new Roll(`${Math.max(1, hitDice)}D10`).evaluate()

            // Generate roll result data
            const results = getRollResults(roll, complexity, difficulty)
            const isFumble = checkFumble(roll, complexity, difficulty, 2)
            const isSuccess = checkSuccess(roll, complexity, difficulty)

            // Calculate final damage
            const finalDamage = item.system.damage
              + masteryBonus

            // Compile header
            const flavorHeader = await renderTemplate('systems/starclock/templates/chat/meleeroll.hbs', {
              item: {
                ...item,
                system: {
                  ...item.system,
                  damage: finalDamage,
                },
              },
              config: CONFIG.starclock,
            })

            // Compile content
            const messageContent = await renderTemplate('systems/starclock/templates/chat/diceroll.hbs', {
              results,
              isFumble,
              isSuccess,
              complexity,
              difficulty,
              successKey: 'SCLK.Hit',
              failureKey: 'SCLK.Miss',
              fumbleKey: 'SCLK.Fumble',
            })

            const sound = isFumble
              ? 'systems/starclock/assets/sfx/melee_woosh.ogg'
              : (item.system.firingSound ?? CONFIG.sounds.dice)

            const rollMode = game.settings.get('core', 'rollMode')

            const msgData = ChatMessage.applyRollMode({
              user: game.user.id,
              flavor: flavorHeader,
              speaker: ChatMessage.getSpeaker({ actor: this.actor }),
              content: messageContent,
              sound,
            }, rollMode)

            // Send roll to chat
            return ChatMessage.create(msgData)
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('SCLK.Cancel'),
          callback: () => {},
        },
      },
    })

    return dialog.render(true)
  }

  // On weapon reload
  _onWeaponReload (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    return item.reloadGun()
  }
  
  // On item delete
  _onItemDelete (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    if (!event.shiftKey) {
      const dialog = new Dialog({
        title: `Delete ${item.name}?`,
        default: 'cancel',
        buttons: {
          submit: {
            icon: '<i class="fas fa-trash"></i>',
            label: game.i18n.localize('SCLK.Delete'),
            callback: () => {
              return item.delete({}).then(() => {
                ui.notifications.info(`${item.name} has been deleted`)
              })
            },
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('SCLK.Cancel'),
            callback: () => {},
          },
        },
      })

      return dialog.render(true)
    }

    return item.delete({}).then(() => {
      ui.notifications.info(`${item.name} has been deleted`)
    })
  }

  // On item edit
  _onItemEdit (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    return item.sheet.render(true)
  }

  // On item stash
  _onItemStash (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    return item.update({ 'system.stashed': true }).then(() => {
      ui.notifications.info(`${item.name} has been stashed`)
    })
  }

  // On item stash
  _onItemUnstash (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (!item) {
      return ui.notifications.error('Item not found')
    }

    return item.update({
      'system.stashed': false
    }).then(() => {
      const dest = item.type === 'rangedWeapon' || item.type === 'meleeWeapon'
        ? 'arsenal'
        : 'inventory'
      ui.notifications.info(`${item.name} has been moved to ${dest}`)
    })
  }

  // On item drop
  async _onDropItem (event, data) {
    event.preventDefault()

    return super._onDropItem(event, data)
      .then(res => {
        if (this._tabs.find(tab => tab.active === 'stash') && res[0]) {
          res[0].update({ 'system.stashed': true })
        }
      })
  }

  // Sort items lists
  sortItems (items) {
    return Object.entries(items)
      .sort(([k1], [k2]) => k1 < k2 ? -1 : 1)
      .reduce((acc, [k, v]) => ({
        ...acc,
        [k]: v,
      }), {})
  }

  // Get data for template
  getData (options = {}) {
    const data = super.getData(options)

    // Separate items into subcategories and
    // sort them alphabetically
    const [inventory, stash, weapons, weaponsStash, ammo] = data.items
      .reduce((acc, item) => {
        const isStashed = item.system.stashed
        const isWeapon = item.type === 'rangedWeapon' || item.type === 'meleeWeapon'
        const isAmmo = item.type === 'ammo'
        const key = `TYPES.Item.${item.type}`

        // Match index with condition
        const idx = [{
          index: 4,
          cond: isAmmo,
        }, {
          index: 3,
          cond: isWeapon && isStashed,
        }, {
          index: 2,
          cond: isWeapon,
        }, {
          index: 1,
          cond: isStashed,
        }].find(obj => obj.cond)?.index ?? 0

        const finalItem = item.type !== 'rangedWeapon'
          ? item
          : {
            ...item,
            loadedAmmoData: data.items.find(it => it._id === item.system.loadedAmmo) ?? null,
          }

        return acc.map((v, i) => {
          const basis = v[key] ? v[key] : []
          return i !== idx ? v : {
            ...v,
            [key]: basis.concat([finalItem])
          }
        })
      }, [{}, {}, {}, {}, {}])
      .map(obj => Object.entries(obj)
        .reduce((acc, [k, v]) => ({
          ...acc,
          [k]: v.sort((i1, i2) => i1.name < i2.name ? -1 : 1)
        }), {})
      )

    const maxStamina = this.actor.getMaxStamina()
    const availableSkillpoints = this.actor.getAvailableSkillpoints()

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
      stash,
      ammo,
      weapons: this.sortItems(weapons),
      weaponsStash: this.sortItems(weaponsStash),
      maxStamina,
      availableSkillpoints,
    })
  }
}
