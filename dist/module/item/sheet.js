import { basePath } from "../../constants.js";
export default class StarclockItemSheet extends ItemSheet {
    get template() {
        return `${basePath}/templates/items/${this.item.data.type}.hbs`;
    }
    getData() {
        const data = super.getData();
        return Object.assign(data, { config: CONFIG.starclock });
    }
}
