import { basePath } from "../../constants.js"

export default class StarclockItemSheet extends ItemSheet {
  constructor (props: any) {
    super(props)

    const item = this.getData().item

    if (!item) {
      return
    }
  }

  // Template name
  get template () {
    return `${basePath}/templates/items/${this.item.data.type}.hbs`
  }

  // Get item data
  getData () {
    const data = super.getData()

    return Object.assign(data, {
      config: CONFIG.starclock,
    })
  }
}
