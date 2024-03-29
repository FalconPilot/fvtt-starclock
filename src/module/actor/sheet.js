import { basePath } from "../../constants.js"
import { checkFumble, getRollResults, getScore } from "../../utils/roll.js"

export default class StarclockActorSheet extends ActorSheet {
  // Template name
  get template () {
    return `${basePath}/templates/actors/${this.actor.type}.hbs`
  }

  // Default options
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
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

    if (item.system.fumbleAmount >= item.system.reliability) {
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
            const hitMod = parseInt(html.find('input[name=hitMod]').val(), 10)

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
            const masteryBonus = isMastered ? 1 : 0
            const rangeMalus = Math.max(0, range - weaponMaxRange)

            // Calculate final amount of dice
            const hitDice = this.actor.system.acu
              + this.actor.system.shooting
              + hitMod
              + masteryBonus
              + (loadedAmmoData.system.accuracyMod ?? 0)
              - rangeMalus
              - firingRateMalus

            // Calculate final amount of damage
            const finalDamage = loadedAmmoData.system.damage
              + firingRateDmg

            // Generate roll
            const roll = await new Roll(`${Math.max(hitDice, 1)}D6`).roll({ async: true })

            // Generate roll result data
            const results = getRollResults(roll)
            const score = getScore(roll)
            const isFumble = checkFumble(roll)

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
              firingRate: game.i18n.localize(`SCLK.FiringRates.${firingRate}`),
              ammoFired,
            })

            // Compile content
            const messageContent = await renderTemplate('systems/starclock/templates/chat/diceroll.hbs', {
              results,
              score,
              isFumble,
              fumbleText: game.i18n.localize('SCLK.Misfire'),
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
            const hitMod = parseInt(html.find('input[name=hitMod]').val(), 10)

            const masteryBonus = isMastered ? 1 : 0

            // Calculate final amount of dice
            const hitDice = this.actor.system.hab
              + this.actor.system.melee
              + hitMod
              + masteryBonus

            // Generate roll
            const roll = await new Roll(`${Math.max(hitDice, 1)}D6`).roll({ async: true })

            // Generate roll result data
            const results = getRollResults(roll)
            const score = getScore(roll)
            const isFumble = checkFumble(roll)

            // Calculate final damage
            const finalDamage = item.system.damage
              + score

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
              score,
              isFumble,
              fumbleText: game.i18n.localize('SCLK.Fumble'),
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
        const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1).toLowerCase()}`

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

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
      stash,
      ammo,
      weapons: this.sortItems(weapons),
      weaponsStash: this.sortItems(weaponsStash),
      maxStamina,
    })
  }
}
