export default class StarclockActor extends Actor {
  async checkAmmoUpdate(item) {
    return this.items
      .filter(it => it.system.loadedAmmo === item._id)
      .map(it => it.update({}))
  }

  _onUpdateEmbeddedDocuments(name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onUpdateEmbeddedDocuments(name, ...args)
  }

  _onDeleteEmbeddedDocuments(name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onDeleteEmbeddedDocuments(name, ...args)
  }
}
