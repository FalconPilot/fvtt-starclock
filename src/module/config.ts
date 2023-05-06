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
  artillery: 'SCLK.WeaponTypes.Artillery',
  heavyWeapon: 'SCLK.WeaponTypes.Heavy',
}

export const starclock = {
  meleeWeaponTypes,
  rangedWeaponTypes,
  attributes: {
    phy: 'SCLK.Attributes.Body',
    agi: 'SCLK.Attributes.Agility',
    acu: 'SCLK.Attributes.Acuity',
    hab: 'SCLK.Attributes.Hability',
    cha: 'SCLK.Attributes.Charisma',
    emp: 'SCLK.Attributes.Empathy',
    int: 'SCLK.Attributes.Intellect',
    wil: 'SCLK.Attributes.Willpower',
  },
  bodyTypes: {
    m: 'SCLK.BodyTypes.M',
    f: 'SCLK.BodyTypes.F',
  },
  ammoTypes: {
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
  damageType: {
    physical: 'SCLK.DamageType.Physical',
    energy: 'SCLK.DamageType.Energy',
  },
  races: {
    human: "SCLK.Races.Human",
    doppleganger: "SCLK.Races.Doppleganger",
    endaari: "SCLK.Races.Endaari",
    alkor: "SCLK.Races.Alkor",
    anitrope: "SCLK.Races.Anitrope",
  },
  tabs: {
    identity: 'SCLK.Tabs.Identity',
    perks: 'SCLK.Tabs.Perks',
    arsenal: 'SCLK.Tabs.Arsenal',
    inventory: 'SCLK.Tabs.Inventory',
    stash: 'SCLK.Tabs.Stash',
  },
  combat: {
    melee: "SCLK.Combat.Melee",
    shooting: "SCLK.Combat.Shooting",
    defense: "SCLK.Combat.Defense",
  },
  skills: {
    acrobatics: 'SCLK.Skills.Acrobatics',
    arts: 'SCLK.Skills.Arts',
    craftsmanship: 'SCLK.Skills.Craftsmanship',
    dialog: 'SCLK.Skills.Dialog',
    knowledge: 'SCLK.Skills.Knowledge',
    perception: 'SCLK.Skills.Perception',
    piloting: 'SCLK.Skills.Piloting',
    roguery: 'SCLK.Skills.Roguery',
    sports: 'SCLK.Skills.Sports',
    understanding: 'SCLK.Skills.Understanding',
  },
}
