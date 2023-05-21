export default class StarclockActor extends Actor {
  async checkAmmoUpdate(item) {
    return this.items
      .filter(it => it.system.loadedAmmo === item._id)
      .map(it => it.update({}))
  }

  _onUpdateEmbeddedDocuments(name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onUpdateEmbeddedDocuments(name, ...args)
  }

  _onDeleteEmbeddedDocuments(name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onDeleteEmbeddedDocuments(name, ...args)
  }

  getMaxStamina (data = {}) {
    const maxBonus = data['system.maxStaminaBonus'] ?? this.system.maxStaminaBonus
    const phy = data['system.phy'] ?? this.system.phy

    return 8
      + maxBonus
      + (phy * 2)
  }

  async _onUpdate (data, ...args) {
    const staminaMax = this.getMaxStamina(data)
    const staminaCurrent = data['system.currentStamina'] ?? this.system.currentStamina
    const cappedStamina = Math.min(Math.max(0, staminaCurrent), staminaMax)

    // Cap stamina if it's out of bounds
    if (cappedStamina !== staminaCurrent) {
      data['system.currentStamina'] = cappedStamina
    }

    return super._onUpdate(data, ...args)
  }
}
