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

    // Item partials
    `${basePath}/templates/items/parts/damage.hbs`,
    `${basePath}/templates/items/parts/description.hbs`,
    `${basePath}/templates/items/parts/header.hbs`,
    `${basePath}/templates/items/parts/header-illustrated.hbs`,
  ])

export const registerHandlebarHelpers = () => {
  Handlebars.registerHelper('actortab', (tab: string) =>
    `systems/${systemName}/templates/actors/parts/${tab}.hbs`
  )

  Handlebars.registerHelper('woundTypeLoc', (key: keyof typeof starclock['woundTypes']) =>
    starclock.woundTypes[key]
  )

  Handlebars.registerHelper('hasElements', <T>(obj: Record<string, T[]>): boolean => (
    Object.keys(obj).length > 0
  ))

  Handlebars.registerHelper('getAttributeValue', (data: any, key: string, subKey): any => (
    data[key][subKey]
  ))

  Handlebars.registerHelper('getKey', (data: any, key: string) => (
    data[key]
  ))

  Handlebars.registerHelper('times', (n: number, block: any) => {
    return new Array(n).fill(null).reduce((acc: string, e: null, idx: number) => {
      return acc + block.fn(idx)
    }, '')
  })

  Handlebars.registerHelper('woundKey', (type: string): string => (
    `data.wounds.${type}`
  ))

  Handlebars.registerHelper('woundChoices', () => (
    new Array(4)
      .fill(null)
      .reduce((acc, _, idx) => ({
        ...acc,
        [idx]: idx
      }), {})
  ))
}
