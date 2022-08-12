import StarclockItemSheet from './module/item/sheet.js'
import StarclockActorSheet from './module/actor/sheet.js'

import { systemName } from './constants.js'
import { preloadHandlebarTemplates } from './module/templates.js'
import { starclock } from './module/config.js'

const ASCIIART = `
__            _             
(_ _|_  _. ._ /  |  _   _ |  
__) |_ (_| |  \\_ | (_) (_ |< 

`

Hooks.once('init', () => {
  console.log(`StarClock | Initializing system\n${ASCIIART}`)

  // Config
  CONFIG.starclock = starclock

  // Register sheet classes
  Actors.unregisterSheet('core', ActorSheet)
  Actors.registerSheet(systemName, StarclockActorSheet, { makeDefault: true })
  
  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet(systemName, StarclockItemSheet, { makeDefault: true })

  // Handlebar preloading
  preloadHandlebarTemplates()
})
