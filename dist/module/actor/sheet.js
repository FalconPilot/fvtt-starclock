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
