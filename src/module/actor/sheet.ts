import { basePath } from "../../constants.js"

export default class StarclockActorSheet extends ActorSheet {
  get template () {
    return `${basePath}/templates/actors/${this.actor.data.type}.hbs`
  }

  static getDefaultOptions () {
    return mergeObject(super.defaultOptions, {
      tabs: [{
        navSelector: '.tabs',
        contentSelector: '.tab-content',
        initial: 'attributes'
      }]
    })
  }

  getData () {
    const data = super.getData()

    const inventory = data.items.reduce<Record<string, Item[]>>((acc, item) => {
      const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1)}`
      const basis = acc[key] ? acc[key] : []

      return {
        ...acc,
        [key]: basis.concat(item)
      }
    }, {})

    return Object.assign(data, {
      config: CONFIG.starclock,
      inventory,
    })
  }
}
