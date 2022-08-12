import StarclockItemSheet from './module/item/sheet'
import { systemName } from './constants'
import { preloadHandlebarTemplates } from './templates'

Hooks.once('init', () => {
  console.log(`${systemName} | Initializing system`)

  // Register sheet classes
  Items.unregisterSheet('core', ItemSheet)
  Items.registerSheet(systemName, StarclockItemSheet, { makeDefault: true })

  // Handlebar preloading
  preloadHandlebarTemplates()
})
