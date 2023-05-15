const appendWeaponClasses = (items = [], parent = document) => {
  items
    .filter(item => item.type === 'meleeWeapon' || item.type === 'rangedWeapon')
    .forEach(weapon => {
      const nodes = parent.querySelectorAll(`[data-document-id="${weapon._id}"]`)
      nodes.forEach(node => node.classList.add('weapon'))
    })
}

export const registerHooks = () => {
  Hooks.on('renderSidebarTab', tab => {
    if (tab.tabName === 'items') {
      appendWeaponClasses(tab.documents, tab.element[0])
    }
  })

  Hooks.on('changeSidebarTab', tab => {
    if (tab.tabName === 'items') {
      appendWeaponClasses(tab.documents, tab.element[0])
    }
  })

  Hooks.on('renderCompendium', (app, _, collection) => {
    appendWeaponClasses(collection.index, app.element[0])
  })
}
