import { basePath } from '../constants.js'

export const preloadHandlebarTemplates = async () =>
  loadTemplates([
    // Actor partials
    `${basePath}/templates/actors/parts/attributes.hbs`,
    `${basePath}/templates/actors/parts/inventory.hbs`,

    // Item partials
    `${basePath}/templates/items/parts/damage.hbs`,
    `${basePath}/templates/items/parts/description.hbs`,
    `${basePath}/templates/items/parts/header.hbs`,
    `${basePath}/templates/items/parts/header-illustrated.hbs`,
  ])

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('log', console.log)

  // Handlebars.registerHelper('arsenal', (actor: Actors['']))
}
