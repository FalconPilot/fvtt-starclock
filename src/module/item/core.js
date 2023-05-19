export default class StarclockItem extends Item {
  async update(rawData) {
    const data = Object.assign({}, rawData)

    if (this.type === 'rangedWeapon') {

      const loadedAmmoID = data['system.loadedAmmo'] ?? this.system.loadedAmmo

      // Reset loadedAmmo if ammoType changed
      if (loadedAmmoID !== this.system.loadedAmmo) {
        data['system.loadedAmmo'] = loadedAmmoID
      }

      // Reset loaded ammo if ammoType changed
      if (data['system.ammoType'] && data['system.ammoType'] !== this.system.ammoType) {
        data['system.loadedAmmo'] = null
      }

      // Prevent wrong ammunition count
      const ammoMax = data['system.ammoMax'] ?? this.system.ammoMax
      const ammoCurrent = data['system.ammoCurrent'] ?? this.system.ammoCurrent
      data['system.ammoMax'] = Math.max(ammoMax, 0)
      data['system.ammoCurrent'] = Math.min(Math.max(ammoCurrent, 0), ammoMax)
    }

    return super.update(data)
  }

  async reloadGun() {
    if (this.type !== 'rangedWeapon') {
      return ui.notifications.error('You can only reload ranged weapons')
    }

    if (!this.system.loadedAmmo) {
      return ui.notifications.warn('No ammunition loaded')
    }

    const requiredAmmo = this.system.ammoMax - this.system.ammoCurrent

    if (requiredAmmo <= 0) {
      return ui.notifications.warn('Weapon is already at full capacity')
    }

    const loadedAmmoData = this.actor.items
      .find(item => (
        item.id === this.system.loadedAmmo
      ))

    if (!loadedAmmoData) {
      return ui.notifications.error('Problem loading ammunition data')
    }

    const qtyKey = this.system.stashed ? 'quantityStash' : 'quantity'
    const availableAmmo = loadedAmmoData.system[qtyKey]

    if (availableAmmo <= 0) {
      return ui.notifications.warn('No more ammo in stock!')
    }

    const reloadedAmount = Math.min(requiredAmmo, availableAmmo)

    return this.update({ 'system.ammoCurrent': this.system.ammoCurrent + reloadedAmount })
      .then(() => {
        return loadedAmmoData.update({
          [`system.${qtyKey}`]: loadedAmmoData.system[qtyKey] - reloadedAmount
        })
      })
      .then(() => {
        if (this.system.reloadSound) {
          AudioHelper.play({ src: this.system.reloadSound, volume: 1, autoplay: true, loop: false }, false);
        }
      })
  }
}
