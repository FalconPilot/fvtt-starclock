const meleeWeaponTypes = {
  oneHanded: 'SCLK.WeaponTypes.OneHanded',
  twoHanded: 'SCLK.WeaponTypes.TwoHanded',
  fists: 'SCLK.WeaponTypes.Fist',
  shields: 'SCLK.WeaponTypes.Shield',
}

const rangedWeaponTypes = {
  pistol: 'SCLK.WeaponTypes.Pistol',
  rifle: 'SCLK.WeaponTypes.Rifle',
  bow: 'SCLK.WeaponTypes.Bow',
  thrown: 'SCLK.WeaponTypes.Thrown',
}

export const starclock = {
  meleeWeaponTypes,
  rangedWeaponTypes,
  woundTypes: {
    stun: 'SCLK.Wounds.Stun',
    light: 'SCLK.Wounds.Light',
    medium: 'SCLK.Wounds.Medium',
    heavy: 'SCLK.Wounds.Heavy,'
  },
  ammoType: {
    lightPistol: 'SCLK.AmmoTypes.LightPistol',
    heavyPistol: 'SCLK.AmmoTypes.HeavyPistol',
    lightRifle: 'SCLK.AmmoTypes.LightRifle',
    heavyRifle: 'SCLK.AmmoTypes.HeavyRifle',
    antimaterial: 'SCLK.AmmoTypes.Antimaterial',
    shells: 'SCLK.AmmoTypes.Shells',
    arrows: 'SCLK.AmmoTypes.Arrows',
    grenades: 'SCLK.AmmoTypes.Grenades',
    rockets: 'SCLK.AmmoTypes.Rockets',
  },
  tabs: {
    attributes: 'SCLK.Tabs.Attributes'
  }
}
