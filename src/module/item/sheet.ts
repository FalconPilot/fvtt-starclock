import { basePath } from "../../constants"

export default class StarclockItemSheet extends ItemSheet {
  get template () {
    return `${basePath}/templates/items/${this.item.data.type}.html`
  }
}
