import { basePath } from "../../constants.js"
import { starclock } from "../config.js"

export default class StarclockActorSheet extends ActorSheet {
  // Template name
  get template () {
    return `${basePath}/templates/actors/${this.actor.data.type}.hbs`
  }

  // Default options
  static get defaultOptions () {
    return mergeObject(super.defaultOptions, {
      width: 800,
      height: 500,
      resizable: false,
      tabs: [{
        navSelector: '.tabs',
        contentSelector: '.tab-content',
        initial: 'identity',
      }],
    })
  }

  // Activate listeners
  protected activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html)

    html.find('.item-delete').on('click', this._onItemDelete.bind(this))
    html.find('.item-edit').on('click', this._onItemEdit.bind(this))
  }
  
  // On item delete
  _onItemDelete (event: any) {
    event.preventDefault()

    const item = this.actor.items.get(event.currentTarget.dataset.id)

    if (item) {
      return item.delete({})
    }
  }

  // On item edit
  _onItemEdit (event: any) {
    event.preventDefault()
    const item = this.actor.items.get(event.currentTarget.dataset.id)
    item.sheet.render(true)
  }

  // Get data for template
  getData () {
    const data = super.getData()

    const inventory = data.items.reduce<Record<string, Item[]>>((acc, item) => {
      const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1)}`
      const basis = acc[key] ? acc[key] : []

      return {
        ...acc,
        [key]: basis.concat([Object.assign(item, {
          hasDamage: item.type === 'rangedWeapon' || item.type === 'meleeWeapon'
        })])
      }
    }, {})

    const wounds = Object.keys(starclock.woundTypes).reduce<Record<string, string>>((acc, k) => {
      const val = parseInt((data.data as any).data.wounds[k], 10)

      return {
        ...acc,
        [k]: `${isNaN(val) ? 0 : val}`
      }
    }, {})

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
      wounds,
    })
  }
}
