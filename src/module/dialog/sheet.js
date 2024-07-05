export default class StarclockDialog extends Dialog {
  constructor (props) {
    super(props)

    this._dragDrop = [
      ...this._dragDrop,
      new DragDrop({
        dragSelector: null,
        dropSelector: '.actor-importer',
        callbacks: { drop: this._onDropActor.bind(this) }
      }),
    ]
  }

  async _onDropActor (event) {
    const data = TextEditor.getDragEventData(event)

    if (data.type !== 'Actor') {
      return ui.notifications.warn('Can only drag actors')
    }

    const actor = await Actor.implementation.fromDropData(data)
    this.loadedActor = actor
  }

  getData (options = {}) {
    const data = super.getData(options)
    return Object.assign(data, {
      loadedActor: this.loadedActor,
    })
  }
}
