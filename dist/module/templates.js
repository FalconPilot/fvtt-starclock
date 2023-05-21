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
const hasElt = obj => (!!obj
    ? Array.isArray(obj)
        ? obj.length > 0
        : Object.keys(obj).length > 0
    : false);
const extractArgs = args => [args.slice(0, -1), args[args.length - 1]];
export const preloadHandlebarTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    return loadTemplates([
        // Actor tabs
        ...Object.keys(starclock.tabs).map(tab => (`${basePath}/templates/actors/parts/${tab}.hbs`)),
        // Common partials
        `${basePath}/templates/common/resourcebar.hbs`,
        // Actor partials
        `${basePath}/templates/actors/parts/infos.hbs`,
        `${basePath}/templates/actors/parts/inventory/ammo.hbs`,
        `${basePath}/templates/actors/parts/inventory/controls.hbs`,
        `${basePath}/templates/actors/parts/inventory/items.hbs`,
        `${basePath}/templates/actors/parts/inventory/weapons.hbs`,
        // Item partials
        `${basePath}/templates/items/parts/ammo.hbs`,
        `${basePath}/templates/items/parts/damage.hbs`,
        `${basePath}/templates/items/parts/description.hbs`,
        `${basePath}/templates/items/parts/header.hbs`,
        `${basePath}/templates/items/parts/header-illustrated.hbs`,
        `${basePath}/templates/items/parts/quantity.hbs`,
    ]);
});
export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper('log', console.log);
    Handlebars.registerHelper('exists', elt => (elt !== null && elt !== undefined));
    Handlebars.registerHelper('and', function (...conds) {
        const [args, options] = extractArgs(conds);
        if (args.every(arg => !!arg)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('or', function (...conds) {
        const [args, options] = extractArgs(conds);
        if (args.some(arg => !!arg)) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('equals', (x, y) => (x === y));
    Handlebars.registerHelper('notEquals', (x, y) => (x !== y));
    Handlebars.registerHelper('inferior', (x, y) => (x < y));
    Handlebars.registerHelper('superior', (x, y) => (x > y));
    Handlebars.registerHelper('concat', (...arrs) => {
        const [args] = extractArgs(arrs);
        return args.every(Array.isArray)
            ? args.flat()
            : args.reduce((acc, x) => (Object.assign(Object.assign({}, acc), x)), {});
    });
    Handlebars.registerHelper('sum', (...args) => {
        const [nums] = extractArgs(args);
        return nums.reduce((t, n) => t + n, 0);
    });
    Handlebars.registerHelper('actortab', tab => `systems/${systemName}/templates/actors/parts/${tab}.hbs`);
    Handlebars.registerHelper('hasElements', (...args) => (extractArgs(args)[0].every(hasElt)));
    Handlebars.registerHelper('anyHasElements', (...args) => (extractArgs(args)[0].some(hasElt)));
    Handlebars.registerHelper('getAttributeValue', (data, key, subKey) => (data[key][subKey]));
    Handlebars.registerHelper('getKey', (data, key) => (data[key]));
    Handlebars.registerHelper('times', (n, block) => new Array(n).fill(null).reduce((acc, _e, idx) => {
        return acc + block.fn(idx);
    }, ''));
    Handlebars.registerHelper('percentageOf', (x, y) => {
        const percentage = Math.round((x / y) * 100);
        return isNaN(percentage) ? 0 : percentage;
    });
    Handlebars.registerHelper('damageNeon', type => ({
        physical: 'neon-red',
        energy: 'neon-blue',
    }[type]));
};
