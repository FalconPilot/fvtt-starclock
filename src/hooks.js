import StarclockItemSheet from './module/item/sheet.js'
import StarclockItem from './module/item/core.js'
import StarclockActorSheet from './module/actor/sheet.js'
import StarclockActor from './module/actor/core.js'
import EffectsElement from './module/elements/effects.js'

import { systemName } from './constants.js'
import { preloadHandlebarTemplates, registerHandlebarHelpers } from './module/templates.js'
import { starclock } from './module/config.js'

const appendWeaponClasses = (items = [], parent = document) => {
  items
    .forEach(item => {
      const isWeapon = item.type === 'meleeWeapon' || item.type === 'rangedWeapon'
      const isAmmo = item.type === 'ammo'

      const extraClass = [{
        cond: isWeapon,
        className: 'weapon',
      }, {
        cond: isAmmo,
        className: 'ammo',
      }].find(c => c.cond)?.className

      if (!extraClass) {
        return
      }

      const nodes = parent.querySelectorAll(`[data-document-id="${item._id}"]`)
      nodes.forEach(node => node.classList.add(...extraClass.split(' ')))
    })
}

const ASCIIART = `
__            _             
(_ _|_  _. ._ /  |  _   _ |  
__) |_ (_| |  \\_ | (_) (_ |< 

`

// Hooks registration
export const registerHooks = () => {

  // Initialization operations
  Hooks.once('init', () => {
    console.log(`StarClock | Initializing system\n${ASCIIART}`)
  
    // Config
    CONFIG.starclock = starclock
    CONFIG.Actor.documentClass = StarclockActor
    CONFIG.Item.documentClass = StarclockItem
  
    // Register sheet classes
    Actors.unregisterSheet('core', ActorSheet)
    Actors.registerSheet(systemName, StarclockActorSheet, { makeDefault: true })
    
    Items.unregisterSheet('core', ItemSheet)
    Items.registerSheet(systemName, StarclockItemSheet, { makeDefault: true })
  
    // Handlebar preconfiguring
    preloadHandlebarTemplates()
    registerHandlebarHelpers()
  })

  // On render sidebar tab
  Hooks.on('renderSidebarTab', tab => {
    if (tab.tabName === 'items') {
      appendWeaponClasses(tab.documents, tab.element[0])
    }
  })

  // On change sidebar tab
  Hooks.on('changeSidebarTab', tab => {
    if (tab.tabName === 'items') {
      appendWeaponClasses(tab.documents, tab.element[0])
    }
  })

  // On compendium render
  Hooks.on('renderCompendium', (app, _, collection) => {
    appendWeaponClasses(collection.index, app.element[0])
  })
}
