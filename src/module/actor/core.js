export default class StarclockActor extends Actor {
  async checkAmmoUpdate(item) {
    return this.items
      .filter(it => it.system.loadedAmmo === item._id)
      .map(it => it.update({}))
  }

  _onUpdateDescendantDocuments (name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onUpdateDescendantDocuments (name, ...args)
  }

  _onDeleteEmbeddedDocuments(name, ...args) {
    if (name === 'Item') {
      this.checkAmmoUpdate(args[1][0])
    }

    return super._onDeleteEmbeddedDocuments(name, ...args)
  }

  // Character available skillpoints equation
  getAvailableSkillpoints (data =  {}) {
    return Object.entries(CONFIG.starclock.skills)
      .reduce((acc, [key, skills]) => {
        const availablePoints = data[`system.${key}`] ?? this.system[key]
        const spentPoints = Object.keys(skills)
          .reduce((total, skey) => {
            const skill = data[`system.skills.${key}.${skey}`] ?? this.system.skills[key][skey]
            return total + skill
          }, 0)

        return {
          ...acc,
          [key]: availablePoints - spentPoints
        }
      }, {})
  }

  // Character available weapon masteries
  getAvailableWeaponMasteries (data = {}) {
    return 0 // TODO - Check for traits
  }

  // Character max stamina equation
  getMaxStamina (data = {}) {
    const maxBonus = data['system.maxStaminaBonus'] ?? this.system.maxStaminaBonus
    const grit = data['system.skills.phy.grit'] ?? this.system.skills.phy.grit ?? 0
    const willpower = data['system.skills.wit.willpower'] ?? this.system.skills.wit.willpower ?? 0

    return 8
      + maxBonus
      + (grit * 2)
      + willpower
  }

  async update (data, ...args) {
    if (this.type === 'character') {
      const staminaMax = this.getMaxStamina(data)
      const oldStaminaMax = this.getMaxStamina()
      const staminaCurrent = data['system.currentStamina'] ?? this.system.currentStamina
      const cappedStamina = Math.min(Math.max(0, staminaCurrent), staminaMax)

      // Cap stamina if it's out of bounds
      if (cappedStamina < staminaCurrent) {
        data['system.currentStamina'] = cappedStamina
      }

      // Patch current stamina if max stamina was increased
      if (staminaMax > oldStaminaMax) {
        data['system.currentStamina'] = data['system.currentStamina'] + staminaMax - oldStaminaMax
      }

      // Revert skillpoints if skillpoints are depleted
      if (Object.values(this.getAvailableSkillpoints(data)).some(x => x < 0)) {
        ui.notifications.warn('Cannot allocate more skillpoints!')
        Object.entries(CONFIG.starclock.skills).forEach(([key, skills]) => {
          Object.keys(skills).forEach(skey => {
            data[`system.skills.${key}.${skey}`] = this.system.skills[key][skey]
          })
        })
      }
    }

    return super.update(data, ...args)
  }
}
