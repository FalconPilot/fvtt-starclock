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
export const preloadHandlebarTemplates = () => __awaiter(void 0, void 0, void 0, function* () {
    return loadTemplates([
        // Actor partials
        `${basePath}/templates/actors/parts/attributes.hbs`,
        `${basePath}/templates/actors/parts/inventory.hbs`,
        // Item partials
        `${basePath}/templates/items/parts/damage.hbs`,
        `${basePath}/templates/items/parts/description.hbs`,
        `${basePath}/templates/items/parts/header.hbs`,
        `${basePath}/templates/items/parts/header-illustrated.hbs`,
    ]);
});
export const registerHandlebarHelpers = () => {
    Handlebars.registerHelper('actortab', (tab) => `systems/${systemName}/templates/actors/parts/${tab}.hbs`);
};
