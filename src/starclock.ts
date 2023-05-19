import { registerHooks } from './hooks.js'

declare global {
  var foundry: any
}

registerHooks()
