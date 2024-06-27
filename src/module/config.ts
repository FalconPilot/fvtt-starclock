const meleeWeaponTypes = {
  light: 'SCLK.WeaponTypes.LightMelee',
  heavy: 'SCLK.WeaponTypes.HeavyMelee',
  fists: 'SCLK.WeaponTypes.Fist',
}

const rangedWeaponTypes = {
  pistol: 'SCLK.WeaponTypes.Pistol',
  rifle: 'SCLK.WeaponTypes.Rifle',
  bow: 'SCLK.WeaponTypes.Bow',
  thrown: 'SCLK.WeaponTypes.Thrown',
  heavyWeapon: 'SCLK.WeaponTypes.Heavy',
}

export const starclock = {
  meleeWeaponTypes,
  rangedWeaponTypes,
  attributes: {
    phy: 'SCLK.Attributes.Body',
    ref: 'SCLK.Attributes.Reflexes',
    wit: 'SCLK.Attributes.Wits',
    min: 'SCLK.Attributes.Mind',
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
    smallVial: 'SCLK.AmmoTypes.SmallVial',
    largeVial: 'SCLK.AmmoTypes.LargeVial',
    lightCell: 'SCLK.AmmoTypes.LightCell',
    heavyCell: 'SCLK.AmmoTypes.HeavyCell',
    shells: 'SCLK.AmmoTypes.Shells',
    arrows: 'SCLK.AmmoTypes.Arrows',
    bolts: 'SCLK.AmmoTypes.Bolts',
    grenades: 'SCLK.AmmoTypes.Grenades',
    rockets: 'SCLK.AmmoTypes.Rockets',
  },
  damageType: {
    physical: 'SCLK.DamageType.Physical',
    energy: 'SCLK.DamageType.Energy',
  },
  shortDamageType: {
    physical: 'SCLK.ShortDamageType.Physical',
    energy: 'SCLK.ShortDamageType.Energy',
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
    dodge: "SCLK.Combat.Dodge",
  },
  firingRates: {
    single: 'SCLK.FiringRates.single',
    semi: 'SCLK.FiringRates.semi',
    auto: 'SCLK.FiringRates.auto',
  },
  ranges: {
    short: 'SCLK.Ranges.Short',
    medium: 'SCLK.Ranges.Medium',
    long: 'SCLK.Ranges.Long',
    extreme: 'SCLK.Ranges.Extreme',
  },
  skills: {
    phy: {
      athletics: 'SCLK.Skills.Athletics',
      coercion: 'SCLK.Skills.Coercion',
      grit: 'SCLK.Skills.Grit',
      strongarm: "SCLK.Skills.Strongarm",
    },
    ref: {
      acrobatics: 'SCLK.Skills.Acrobatics',
      piloting: 'SCLK.Skills.Piloting',
      perception: 'SCLK.Skills.Perception',
      roguery: 'SCLK.Skills.Roguery',
    },
    wit: {
      arts: 'SCLK.Skills.Arts',
      dialog: 'SCLK.Skills.Dialog',
      intuition: 'SCLK.Skills.Intuition',
      willpower: "SCLK.Skills.Willpower",
    },
    min: {
      academics: 'SCLK.Skills.Academics',
      craftsmanship: 'SCLK.Skills.Craftsmanship',
      culture: 'SCLK.Skills.Culture',
      investigation: 'SCLK.Skills.Investigation',
    }
  },
  credits: [
    {
      authorName: 'Nariilya',
      authorLink: 'https://nariilya.com',
      contributions: [
        'All species silhouettes',
      ],
    },
    {
      authorName: 'Robbe',
      authorLink: 'https://www.flickr.com/photos/145236510@N06/',
      contributions: [
        'All guns base images',
      ],
    },
    {
      authorName: 'Pixabay',
      authorLink: 'https://pixabay.com/sound-effects',
      contributions: [
        'Gun firing sounds',
        'Gun reload sounds',
      ],
    },
    {
      authorName: 'Mike Koenig',
      authorLink: 'https://soundcloud.com/pro-sound-library-mike-koenig',
      contributions: [
        'Pistol firing sound',
      ]
    },
    {
      authorName: "Tyler Finck",
      authorLink: "https://www.tyfromtheinternet.com",
      contributions: [
        "Taurus Mono font",
        "Ostrich Sans font",
      ]
    }
  ]
}
