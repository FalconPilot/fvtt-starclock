import { basePath } from '../../constants.js'

export default class StarclockItemSheet extends ItemSheet {
  // Template name
  get template () {
    return `${basePath}/templates/items/${this.item.type}.hbs`
  }

  // Default options
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      width: 500,
      height: 400,
      resizable: false,
    })
  }

  // Activate listeners
  activateListeners(html) {
    super.activateListeners(html)

    html.find('.reload-wpn').on('click', this._onWeaponReload.bind(this))
    html.find('.item-repair').on('click', this._onItemRepair.bind(this))

    // Firing sound input
    html.find('.reload-sound-input').on('click', this._onFilePick({
      type: 'audio',
      current: this.item.system.reloadSound,
      callback: value => {
        this.item.update({ 'system.reloadSound': value })
      }
    }).bind(this))
  }

  // On weapon reload
  _onWeaponReload (event) {
    event.preventDefault()
    return this.item.reloadGun()
  }

  // On item repair
  _onItemRepair (event) {
    event.preventDefault()
    return this.item.repairItem()
  }

  // On file pick
  _onFilePick (options) {
    return event => {
      event.preventDefault()
      const filePicker = new FilePicker(options)

      return filePicker.render(true)
    }
  }

  // Get item data
  getData () {
    const data = super.getData()

    let loadedAmmo = null
    let availableAmmo = []

    // Set available ammo types
    if (data.item.type === 'rangedWeapon' && this.item.actor) {
      availableAmmo = this.item.actor.items
        .filter(item => (
          item.type === 'ammo' &&
          item.system.ammoType === data.item.system.ammoType
        ))
    }

    if (data.item.type === 'rangedWeapon' && data.item.system.loadedAmmo) {
      loadedAmmo = availableAmmo.find(ammo => ammo.id === data.item.system.loadedAmmo)
    }

    return Object.assign(data, {
      config: CONFIG.starclock,
      loadedAmmo,
      availableAmmo,
    })
  }
}
