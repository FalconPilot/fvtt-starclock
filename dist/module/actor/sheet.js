import { basePath } from "../../constants.js";
export default class StarclockActorSheet extends ActorSheet {
    // Template name
    get template() {
        return `${basePath}/templates/actors/${this.actor.type}.hbs`;
    }
    // Default options
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 800,
            height: 500,
            resizable: false,
            tabs: [{
                    navSelector: '.tabs',
                    contentSelector: '.tab-content',
                    initial: 'identity',
                }],
        });
    }
    // Activate listeners
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-delete').on('click', this._onItemDelete.bind(this));
        html.find('.item-edit').on('click', this._onItemEdit.bind(this));
    }
    // On item delete
    _onItemDelete(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (item) {
            return item.delete({});
        }
    }
    // On item edit
    _onItemEdit(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        item.sheet.render(true);
    }
    // Get data for template
    getData(options = {}) {
        const data = super.getData(options);
        const [inventory, stash, weapons] = data.items.reduce((acc, item) => {
            const isStashed = item.system.stashed;
            const isWeapon = item.type === 'rangedWeapon' || item.type === 'meleeWeapon';
            const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1)}`;
            const idx = isStashed ? 1 : isWeapon ? 2 : 0;
            return acc.map((v, i) => {
                const basis = v[key] ? v[key] : [];
                return i !== idx
                    ? v
                    : Object.assign(Object.assign({}, v), { [key]: basis.concat([item]) });
            });
        }, [{}, {}, {}]);
        return Object.assign(data, {
            config: CONFIG.starclock,
            inventory,
            stash,
            weapons,
        });
    }
}
