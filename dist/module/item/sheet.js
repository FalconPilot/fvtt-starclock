import { basePath } from '../../constants.js';
export default class StarclockItemSheet extends ItemSheet {
    // Template name
    get template() {
        return `${basePath}/templates/items/${this.item.type}.hbs`;
    }
    // Default options
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 500,
            height: 400,
            resizable: false,
        });
    }
    // Get item data
    getData() {
        const data = super.getData();
        return Object.assign(data, {
            config: CONFIG.starclock,
        });
    }
}
