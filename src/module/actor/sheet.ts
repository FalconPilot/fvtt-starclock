import { basePath } from "../../constants.js"

export default class StarclockActorSheet extends ActorSheet {
  get template () {
    return `${basePath}/templates/actors/${this.actor.data.type}.hbs`
  }

  getData () {
    const data = super.getData()

    return Object.assign(data, { config: CONFIG.starclock })
  }
}
