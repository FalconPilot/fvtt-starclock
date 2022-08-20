var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basePath, systemName } from "../../constants.js";
const attachmentKeys = {
    rangedWeapon: 'rangedWeaponAttachment',
    meleeWeapon: 'meleeWeaponAttachment',
};
export default class StarclockItemSheet extends ItemSheet {
    constructor(props) {
        super(props);
        // Setup DragDrop
        this._dragDrop = [
            new DragDrop({
                dragSelector: '.item-list .item',
                dropSelector: null,
                callbacks: {
                    dragstart: null,
                    drop: this._onDropItem.bind(this)
                },
            })
        ];
        const item = this.getData().item;
        if (!item) {
            return;
        }
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.delete-attachment').on('click', this._onDeleteAttachment.bind(this));
    }
    _onDeleteAttachment(event) {
        const id = event.currentTarget.dataset.id;
        const attachments = this.getData().data.data.attachments.filter((attachment) => {
            return attachment.id !== id;
        });
        this.item.update({
            'data.attachments': attachments
        });
    }
    // Template name
    get template() {
        return `${basePath}/templates/items/${this.item.data.type}.hbs`;
    }
    // Get item data
    getData() {
        var _a, _b;
        const data = super.getData();
        const attachments = (_b = (_a = data.data.data) === null || _a === void 0 ? void 0 : _a.attachments) === null || _b === void 0 ? void 0 : _b.map((attachment) => {
            if (!data.item) {
                return attachment;
            }
            const pkey = attachmentKeys[data.item.type];
            const pack = attachment.source === 'pack'
                ? `${systemName}.${pkey}s`
                : data.item.type;
            return Object.assign(Object.assign({}, attachment), { pack });
        });
        return Object.assign(data, {
            config: CONFIG.starclock,
            attachments,
        });
    }
    // Get item data during DataTransfer
    getItemFromDataTransfer(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (data.pack) {
                const pack = game.packs.get(data.pack);
                const item = yield pack.getDocument(data.id);
                return item !== null && item !== void 0 ? item : null;
            }
            else {
                const item = (_a = CONFIG[data.type]) === null || _a === void 0 ? void 0 : _a.collection.instance.get(data.id);
                return item !== null && item !== void 0 ? item : null;
            }
        });
    }
    // Listen to ItemDrop
    _onDropItem(event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const baseItem = this.getData().item;
            const baseData = this.getData().data.data;
            if (!baseItem) {
                return;
            }
            const weaponType = baseItem.type;
            if (!(weaponType && Object.keys(attachmentKeys).includes(weaponType))) {
                return;
            }
            const data = JSON.parse((_b = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/plain')) !== null && _b !== void 0 ? _b : 'null');
            if (!data) {
                return;
            }
            const item = yield this.getItemFromDataTransfer(data);
            if (!item) {
                return;
            }
            const itemAttachPoint = item.data.data.attachmentPoint;
            // Warn if attachment type is incompatible
            if (attachmentKeys[weaponType] !== item.type) {
                ui.notifications.warn(game.i18n.format('GUI.Errors.IncompatibleAttachmentType', {}));
                return;
            }
            console.log(baseData);
            // Warn if the attachpoint does not exist
            if (!baseData.attachPoints.includes(itemAttachPoint)) {
                ui.notifications.warn(game.i18n.format('GUI.Errors.NoAttachPoint', { point: itemAttachPoint }));
                return;
            }
            // Warn if the attach point is already occupied
            if (baseData.attachments.find((a) => a.point === itemAttachPoint)) {
                ui.notifications.warn(game.i18n.format('GUI.Errors.AlreadyAttached', { point: itemAttachPoint }));
                return;
            }
            const attachments = baseData.attachments;
            this.item.update({
                'data.attachments': attachments.concat([{
                        source: data.pack ? 'pack' : 'world',
                        name: item.name,
                        point: itemAttachPoint,
                        id: item.id,
                    }])
            });
        });
    }
}
