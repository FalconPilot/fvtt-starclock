import { basePath } from "../../constants.js"

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
    html.find('.reload-wpn').on('click', this._onWeaponReload.bind(this))
    html.find('.gun-roll').on('click', this._onGunRoll.bind(this))
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

    const loadedAmmoData = this.actor.items.get(item.system.loadedAmmo)

    if (!loadedAmmoData) {
      return ui.notifications.error('No loaded ammo found')
    }

    const content = await renderTemplate('systems/starclock/templates/dialogs/gunroll.hbs', {
      item
    })

    const dialog = new Dialog({
      title: item.name,
      content,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('SCLK.Cancel'),
          callback: () => {},
        },
        submit: {
          icon: '<i class="fas fa-dice-d6"></i>',
          label: game.i18n.localize('SCLK.Roll'),
          callback: html => {
            console.log(html)
          }
        }
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

    return item.update({
      'system.stashed': true
    }).then(() => {
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

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
      stash,
      ammo,
      weapons: this.sortItems(weapons),
      weaponsStash: this.sortItems(weaponsStash),
    })
  }
}
