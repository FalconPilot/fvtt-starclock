import { basePath } from '../../constants.js'

export default class StarclockItemSheet extends ItemSheet {
  // Template name
  get template () {
    return `${basePath}/templates/items/${this.item.type}.hbs`
  }

  // Default options
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      width: 500,
      height: 400,
      resizable: false,
      dragDrop: [
        { dragSelector: '.active-effect' },
      ],
    })
  }

  // Activate listeners
  activateListeners(html) {
    super.activateListeners(html)

    html.find('.reload-wpn').on('click', this._onWeaponReload.bind(this))
    html.find('.item-repair').on('click', this._onItemRepair.bind(this))
    html.find('.effect-add').on('click', this._addEffect.bind(this))
    html.find('.effect-edit').on('click', this._editEffect.bind(this))
    html.find('.effect-delete').on('click', this._deleteEffect.bind(this))

    // Firing sound input
    html.find('.reload-sound-input').on('click', this._onFilePick({
      type: 'audio',
      current: this.item.system.reloadSound,
      callback: value => {
        this.item.update({ 'system.reloadSound': value })
      }
    }).bind(this))
  }

  // Create effect
  _addEffect () {
    return this.document.createEmbeddedDocuments('ActiveEffect', [{
      name: game.i18n.localize('SCLK.EffectNew'),
      img: this.document.img,
      origin: this.document.uuid,
    }])
  }

  // Delete effect
  _deleteEffect (event) {
    const effect = this.document.effects.get(event.currentTarget.dataset.id)

    if (!effect) {
      return ui.notifications.warn('Could not find effect ID')
    }

    effect.deleteDialog()
  }

  // Edit effect
  _editEffect (event) {
    const effect = this.document.effects.get(event.currentTarget.dataset.id)

    if (!effect) {
      return ui.notifications.warn('Could not find effect ID')
    }

    effect.sheet.render(true)
  }

  // On drag start
  _onDragStart (event) {
    const elt = event.currentTarget

    if (elt.dataset.effectId) {
      const effect = this.item.effects.get(elt.dataset.effectId)
      const dragData = effect?.toDragData()
      return event.dataTransfer.setData('text/plain', JSON.stringify(dragData))
    }
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

    const selectableAmmo = availableAmmo.reduce((acc, ammo) => ({
      ...acc,
      [ammo.id]: ammo.name,
    }), {})

    return Object.assign(data, {
      config: CONFIG.starclock,
      loadedAmmo,
      availableAmmo,
      selectableAmmo,
      effects: Array.from(this.item.effects),
    })
  }
}
