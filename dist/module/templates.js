var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { basePath, systemName } from '../constants.js';
import { starclock } from './config.js';
export const preloadHandlebarTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    return loadTemplates([
        // Actor tabs
        ...Object.keys(starclock.tabs).map(tab => (`${basePath}/templates/actors/parts/${tab}.hbs`)),
        // Actor partials
        `${basePath}/templates/actors/parts/infos.hbs`,
        `${basePath}/templates/actors/parts/inventory/controls.hbs`,
        `${basePath}/templates/actors/parts/inventory/items.hbs`,
        `${basePath}/templates/actors/parts/inventory/weapons.hbs`,
        // Item partials
        `${basePath}/templates/items/parts/ammo.hbs`,
        `${basePath}/templates/items/parts/damage.hbs`,
        `${basePath}/templates/items/parts/description.hbs`,
        `${basePath}/templates/items/parts/header.hbs`,
        `${basePath}/templates/items/parts/header-illustrated.hbs`,
    ]);
});
export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper('log', console.log);
    Handlebars.registerHelper('exists', (elt) => (elt !== null && elt !== undefined));
    Handlebars.registerHelper('actortab', (tab) => `systems/${systemName}/templates/actors/parts/${tab}.hbs`);
    Handlebars.registerHelper('hasElements', (obj) => (Object.keys(obj).length > 0));
    Handlebars.registerHelper('hasElements2', (obj1, obj2) => (Object.keys(obj1).length > 0 || Object.keys(obj2).length > 0));
    Handlebars.registerHelper('getAttributeValue', (data, key, subKey) => (data[key][subKey]));
    Handlebars.registerHelper('getKey', (data, key) => (data[key]));
    Handlebars.registerHelper('times', (n, block) => new Array(n).fill(null).reduce((acc, e, idx) => {
        return acc + block.fn(idx);
    }, ''));
    Handlebars.registerHelper('damageNeon', (type) => ({
        physical: 'neon-red',
        energy: 'neon-blue',
    }[type]));
};
