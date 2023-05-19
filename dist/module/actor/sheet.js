var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basePath } from "../../constants.js";
export default class StarclockActorSheet extends ActorSheet {
    // Template name
    get template() {
        return `${basePath}/templates/actors/${this.actor.type}.hbs`;
    }
    // Default options
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            width: 840,
            height: 495,
            resizable: false,
            classes: ['daicom-tablet'],
            tabs: [{
                    navSelector: '.tabs',
                    contentSelector: '.tab-content',
                    initial: 'identity',
                }],
        });
    }
    // Override renderer
    _renderOuter(...args) {
        const _super = Object.create(null, {
            _renderOuter: { get: () => super._renderOuter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super._renderOuter.call(this, ...args)
                .then(this.appendAnimation());
        });
    }
    // Activate listeners
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-delete').on('click', this._onItemDelete.bind(this));
        html.find('.item-edit').on('click', this._onItemEdit.bind(this));
        html.find('.item-stash').on('click', this._onItemStash.bind(this));
        html.find('.item-unstash').on('click', this._onItemUnstash.bind(this));
        html.find('.reload-wpn').on('click', this._onWeaponReload.bind(this));
        html.find('.gun-roll').on('click', this._onGunRoll.bind(this));
    }
    // Append animation component
    appendAnimation() {
        const delay = 20;
        let count = 0;
        const intervalId = window.setInterval(() => {
            const wrapper = document.getElementById(this.id);
            // Display wrapper if found
            if (wrapper) {
                window.clearInterval(intervalId);
                const animWrapper = document.createElement('div');
                animWrapper.className = 'daicom-anim flexcol centerv centerh';
                const lockWrapper = document.createElement('div');
                lockWrapper.className = 'daicom-anim-lock flexrow centerv lefth';
                animWrapper.appendChild(lockWrapper);
                wrapper.appendChild(animWrapper);
                // Abort animation if delay is over 200ms
            }
            else if (delay * count > 200) {
                window.clearInterval(intervalId);
                // Increment count
            }
            else {
                count++;
            }
        }, 20);
    }
    // Gun roll macro
    _onGunRoll(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const item = this.actor.items.get(event.currentTarget.dataset.id);
            if (!item) {
                return ui.notifications.error('Item not found');
            }
            if (item.type !== 'rangedWeapon') {
                return ui.notifications.error('Those rolls can only be done with ranged weapons');
            }
            const loadedAmmoData = this.actor.items.get(item.system.loadedAmmo);
            if (!loadedAmmoData) {
                return ui.notifications.error('No loaded ammo found');
            }
            const content = yield renderTemplate('systems/starclock/templates/dialogs/gunroll.hbs', {
                item
            });
            const dialog = new Dialog({
                title: item.name,
                content,
                buttons: {
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: game.i18n.localize('SCLK.Cancel'),
                        callback: () => { },
                    },
                    submit: {
                        icon: '<i class="fas fa-dice-d6"></i>',
                        label: game.i18n.localize('SCLK.Roll'),
                        callback: html => {
                            console.log(html);
                        }
                    }
                },
            });
            return dialog.render(true);
        });
    }
    // On weapon reload
    _onWeaponReload(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (!item) {
            return ui.notifications.error('Item not found');
        }
        return item.reloadGun();
    }
    // On item delete
    _onItemDelete(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (!item) {
            return ui.notifications.error('Item not found');
        }
        return item.delete({}).then(() => {
            ui.notifications.info(`${item.name} has been deleted`);
        });
    }
    // On item edit
    _onItemEdit(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (!item) {
            return ui.notifications.error('Item not found');
        }
        return item.sheet.render(true);
    }
    // On item stash
    _onItemStash(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (!item) {
            return ui.notifications.error('Item not found');
        }
        return item.update({
            'system.stashed': true
        }).then(() => {
            ui.notifications.info(`${item.name} has been stashed`);
        });
    }
    // On item stash
    _onItemUnstash(event) {
        event.preventDefault();
        const item = this.actor.items.get(event.currentTarget.dataset.id);
        if (!item) {
            return ui.notifications.error('Item not found');
        }
        return item.update({
            'system.stashed': false
        }).then(() => {
            const dest = item.type === 'rangedWeapon' || item.type === 'meleeWeapon'
                ? 'arsenal'
                : 'inventory';
            ui.notifications.info(`${item.name} has been moved to ${dest}`);
        });
    }
    // On item drop
    _onDropItem(event, data) {
        const _super = Object.create(null, {
            _onDropItem: { get: () => super._onDropItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            return _super._onDropItem.call(this, event, data)
                .then(res => {
                if (this._tabs.find(tab => tab.active === 'stash') && res[0]) {
                    res[0].update({ 'system.stashed': true });
                }
            });
        });
    }
    // Sort items lists
    sortItems(items) {
        return Object.entries(items)
            .sort(([k1], [k2]) => k1 < k2 ? -1 : 1)
            .reduce((acc, [k, v]) => (Object.assign(Object.assign({}, acc), { [k]: v })), {});
    }
    // Get data for template
    getData(options = {}) {
        const data = super.getData(options);
        // Separate items into subcategories and
        // sort them alphabetically
        const [inventory, stash, weapons, weaponsStash, ammo] = data.items
            .reduce((acc, item) => {
            var _a, _b, _c;
            const isStashed = item.system.stashed;
            const isWeapon = item.type === 'rangedWeapon' || item.type === 'meleeWeapon';
            const isAmmo = item.type === 'ammo';
            const key = `ITEM.Type${item.type[0].toUpperCase()}${item.type.slice(1).toLowerCase()}`;
            // Match index with condition
            const idx = (_b = (_a = [{
                    index: 4,
                    cond: isAmmo,
                }, {
                    index: 3,
                    cond: isWeapon && isStashed,
                }, {
                    index: 2,
                    cond: isWeapon,
                }, {
                    index: 1,
                    cond: isStashed,
                }].find(obj => obj.cond)) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : 0;
            const finalItem = item.type !== 'rangedWeapon'
                ? item
                : Object.assign(Object.assign({}, item), { loadedAmmoData: (_c = data.items.find(it => it._id === item.system.loadedAmmo)) !== null && _c !== void 0 ? _c : null });
            return acc.map((v, i) => {
                const basis = v[key] ? v[key] : [];
                return i !== idx ? v : Object.assign(Object.assign({}, v), { [key]: basis.concat([finalItem]) });
            });
        }, [{}, {}, {}, {}, {}])
            .map(obj => Object.entries(obj)
            .reduce((acc, [k, v]) => (Object.assign(Object.assign({}, acc), { [k]: v.sort((i1, i2) => i1.name < i2.name ? -1 : 1) })), {}));
        return Object.assign(data, {
            config: CONFIG.starclock,
            inventory,
            stash,
            ammo,
            weapons: this.sortItems(weapons),
            weaponsStash: this.sortItems(weaponsStash),
        });
    }
}
