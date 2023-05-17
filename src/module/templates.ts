import { basePath, systemName } from '../constants.js'
import { starclock } from './config.js'

export const preloadHandlebarTemplates = async () =>
  loadTemplates([
    // Actor tabs
    ...Object.keys(starclock.tabs).map(tab => (
      `${basePath}/templates/actors/parts/${tab}.hbs`
    )),

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
  ])

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('log', console.log)

  Handlebars.registerHelper('exists', (elt: any) => (
    elt !== null && elt !== undefined
  ))

  Handlebars.registerHelper('actortab', (tab: string) =>
    `systems/${systemName}/templates/actors/parts/${tab}.hbs`
  )

  Handlebars.registerHelper('hasElements', <T>(obj: Record<string, T[]>): boolean => (
    Object.keys(obj).length > 0
  ))

  Handlebars.registerHelper('hasElements2', <T>(obj1: Record<string, T[]>, obj2: Record<string, T[]>): boolean => (
    Object.keys(obj1).length > 0 || Object.keys(obj2).length > 0
  ))

  Handlebars.registerHelper('getAttributeValue', (data: any, key: string, subKey): any => (
    data[key][subKey]
  ))

  Handlebars.registerHelper('getKey', (data: any, key: string) => (
    data[key]
  ))

  Handlebars.registerHelper('times', (n: number, block: any) =>
    new Array(n).fill(null).reduce((acc: string, e: null, idx: number) => {
      return acc + block.fn(idx)
    }, '')
  )

  Handlebars.registerHelper('damageNeon', (type: string) => ({
    physical: 'neon-red',
    energy: 'neon-blue',
  }[type]))
}
