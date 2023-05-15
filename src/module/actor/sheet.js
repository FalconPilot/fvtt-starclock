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
  
  // On item delete
  _onItemDelete (event) {
    event.preventDefault()

    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (item) {
      return item.delete({})
    }
  }

  // On item edit
  _onItemEdit (event) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)
    item.sheet.render(true)
  }

  // Get data for template
  getData (options = {}) {
    const data = super.getData(options)

    const [inventory, stash, weapons] = data.items.reduce((acc, item) => {
      const isStashed = item.system.stashed
      const isWeapon = item.type === 'rangedWeapon' || item.type === 'meleeWeapon'
      const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1).toLowerCase()}`
      const idx = isStashed ? 1 : isWeapon ? 2 : 0

      return acc.map((v, i) => {
        const basis = v[key] ? v[key] : []
        return i !== idx
          ? v
          : {
            ...v,
            [key]: basis.concat([item])
          }
      })
    }, [{}, {}, {}])

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
      stash,
      weapons,
    })
  }
}
