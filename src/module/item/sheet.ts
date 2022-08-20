import { basePath, systemName } from "../../constants.js"

// interface TransferData {
//   id: string
//   type: string
//   pack?: string
// }

// const attachmentKeys: Record<string, string> = {
//   rangedWeapon: 'rangedWeaponAttachment',
//   meleeWeapon: 'meleeWeaponAttachment',
// }

export default class StarclockItemSheet extends ItemSheet {
  constructor (props: any) {
    super(props)

    const item = this.getData().item

    if (!item) {
      return
    }
  }

  // protected activateListeners(html: JQuery<HTMLElement>): void {
  //   super.activateListeners(html)
  //   html.find('.delete-attachment').on('click', this._onDeleteAttachment.bind(this))
  // }

  // protected _onDeleteAttachment (event: any) {
  //   const id = event.currentTarget.dataset.id

  //   const attachments = this.getData().data.data.attachments.filter((attachment: any) => {
  //     return attachment.id !== id
  //   })

  //   this.item.update({
  //     'data.attachments': attachments
  //   })
  // }

  // Setup DragDrop
  // protected _dragDrop: DragDrop[] = [
  //   new (DragDrop as any)({
  //     dragSelector: '.item-list .item',
  //     dropSelector: null,
  //     callbacks: {
  //       dragstart: null,
  //       drop: this._onDropItem.bind(this)
  //     },
  //   })
  // ]

  // Template name
  get template () {
    return `${basePath}/templates/items/${this.item.data.type}.hbs`
  }

  // Get item data
  getData () {
    const data = super.getData()

    // const attachments = data.data.data?.attachments?.map((attachment: any) => {
    //   if (!data.item) {
    //     return attachment
    //   }

    //   const pkey = attachmentKeys[data.item.type]

    //   const pack = attachment.source === 'pack'
    //     ? `${systemName}.${pkey}s`
    //     : data.item.type

    //   return {
    //     ...attachment,
    //     pack,
    //   }
    // })

    return Object.assign(data, {
      config: CONFIG.starclock,
      // attachments,
    })
  }

  // Get item data during DataTransfer
  // async getItemFromDataTransfer (data: TransferData) {
  //   if (data.pack) {
  //     const pack = game.packs.get(data.pack)

  //     const item: Item | null = await pack.getDocument(data.id)
  //     return item ?? null
  //   } else {
  //     const item: Item | null = CONFIG[data.type]?.collection.instance.get(data.id)
  //     return item ?? null
  //   }
  // }

  // Listen to ItemDrop
  // protected async _onDropItem (event: DragEvent) {
  //   const baseItem = this.getData().item
  //   const baseData = this.getData().data.data

  //   if (!baseItem) {
  //     return
  //   }

  //   const weaponType = baseItem.type

  //   if (!(weaponType && Object.keys(attachmentKeys).includes(weaponType))) {
  //     return
  //   }

  //   const data = JSON.parse(event.dataTransfer?.getData('text/plain') ?? 'null')

  //   if (!data) {
  //     return
  //   }

  //   const item = await this.getItemFromDataTransfer(data)

  //   if (!item) {
  //     return
  //   }

  //   const itemAttachPoint = (item.data.data as any).attachmentPoint

  //   // Warn if attachment type is incompatible
  //   if (attachmentKeys[weaponType] !== item.type) {
  //     ui.notifications.warn(game.i18n.format(
  //       'GUI.Errors.IncompatibleAttachmentType',
  //       {}
  //     ))
  //     return
  //   }

  //   // Warn if the attachpoint does not exist
  //   if (!baseData.attachPoints.includes(itemAttachPoint)) {
  //     ui.notifications.warn(game.i18n.format(
  //       'GUI.Errors.NoAttachPoint',
  //       { point: itemAttachPoint }
  //     ))
  //     return
  //   }

  //   // Warn if the attach point is already occupied
  //   if (baseData.attachments.find((a: any) => a.point === itemAttachPoint)) {
  //     ui.notifications.warn(game.i18n.format(
  //       'GUI.Errors.AlreadyAttached',
  //       { point: itemAttachPoint }
  //     ))
  //     return
  //   }

  //   const attachments = baseData.attachments

  //   this.item.update({
  //     'data.attachments': attachments.concat([{
  //       source: data.pack ? 'pack' : 'world',
  //       name: item.name,
  //       point: itemAttachPoint,
  //       id: item.id,
  //     }])
  //   })
  // }
}
