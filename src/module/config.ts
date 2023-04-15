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
  woundTypes: {
    stun: 'SCLK.Wounds.Stun',
    light: 'SCLK.Wounds.Light',
    medium: 'SCLK.Wounds.Medium',
    heavy: 'SCLK.Wounds.Heavy',
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
  races: {
    human: "SCLK.Races.Human",
    doppleganger: "SCLK.Races.Doppleganger",
    endaari: "SCLK.Races.Endaari",
    alkor: "SCLK.Races.Alkor",
  },
  tabs: {
    identity: 'SCLK.Tabs.Identity',
    attributes: 'SCLK.Tabs.Attributes',
    skills: 'SCLK.Tabs.Skills',
    inventory: 'SCLK.Tabs.Inventory',
  },
  skills: {
    acrobatics: {
      nameKey: 'SCLK.Skills.Acrobatics',
      primary: 'agi',
      secondary: 'acu',
      list: {
        stealth: 'SCLK.Skills.Stealth',
        dodge: 'SCLK.Skills.Dodge',
        throwing: 'SCLK.Skills.Throwing',
        stunts: 'SCLK.Skills.Stunts'
      }
    },
    craftsmanship: {
      nameKey: 'SCLK.Skills.Craftsmanship',
      primary: 'hab',
      secondary: 'int',
      list: {
        herbology: 'SCLK.Skills.Herbology',
        cooking: 'SCLK.Skills.Cooking',
        carpentry: 'SCLK.Skills.Carpentry',
        metalworking: 'SCLK.Skills.Metalworking',
        textile: 'SCLK.Skills.Textile',
      }
    },
    arts: {
      nameKey: 'SCLK.Skills.Arts',
      special: true,
      secondary: 'emp',
      list: {
        singing: {
          primary: 'cha',
          nameKey: 'SCLK.Skills.Singing',
        },
        theatrics: {
          primary: 'cha',
          nameKey: 'SCLK.Skills.Theatrics',
        },
        dancing: {
          primary: 'agi',
          nameKey: 'SCLK.Skills.Dancing',
        },
        litterature: {
          primary: 'int',
          nameKey: 'SCLK.Skills.Litterature',
        },
        drawning: {
          primary: 'hab',
          nameKey: 'SCLK.Skills.Drawning',
        },
        music: {
          primary: 'hab',
          nameKey: 'SCLK.Skills.Music',
        },
        sculpting: {
          primary: 'hab',
          nameKey: 'SCLK.Skills.Sculpting',
        },
      },
    },
    athletics: {
      nameKey: 'SCLK.Skills.Athletics',
      primary: 'phy',
      secondary: 'agi',
      list: {
        running: 'SCLK.Skills.Running',
        climbing: 'SCLK.Skills.Climbing',
        swimming: 'SCLK.Skills.Swimming',
        jumping: 'SCLK.Skills.Jumping',
      },
    },
    understanding: {
      nameKey: 'SCLK.Skills.Understanding',
      primary: 'emp',
      secondary: 'wil',
      list: {
        teaching: 'SCLK.Skills.Teaching',
        wits: 'SCLK.Skills.Wits',
        psychology: 'SCLK.Skills.Psychology',
      },
    },
    melee: {
      nameKey: 'SCLK.Skills.Melee',
      primary: 'phy',
      secondary: 'hab',
      list: meleeWeaponTypes,
    },
    dialog: {
      nameKey: 'SCLK.Skills.Dialog',
      primary: 'cha',
      secondary: 'emp',
      list: {
        charm: 'SCLK.Skills.Charm',
        intimidate: 'SCLK.Skills.Intimidate',
        negociate: 'SCLK.Skills.Negociate',
      },
    },
    mechanics: {
      nameKey: 'SCLK.Skills.Mechanics',
      primary: 'hab',
      secondary: 'int',
      list: {
        airplanes: 'SCLK.Skills.Airplanes',
        personalWeapons: 'SCLK.Skills.PersonalWeapons',
        largeWeapons: 'SCLK.Skills.LargeWeapons',
        explosives: 'SCLK.Skills.Explosives',
        informatics: 'SCLK.Skills.Informatics',
        machinery: 'SCLK.Skills.Machinery',
        boats: 'SCLK.Skills.Boats',
        prosthetics: 'SCLK.Skills.Prosthetics',
        robotics: 'SCLK.Skills.Robotics',
        spaceships: 'SCLK.Skills.Spaceships',
        landVehicles: 'SCLK.Skills.LandVehicles',
      },
    },
    perception: {
      nameKey: 'SCLK.Skills.Perception',
      primary: 'acu',
      secondary: 'wil',
      list: {
        searching: 'SCLK.Skills.Searching',
        observation: 'SCLK.Skills.Observation',
        awareness: 'SCLK.Skills.Awareness',
      },
    },
    piloting: {
      nameKey: 'SCLK.Skills.Piloting',
      primary: 'acu',
      secondary: 'int',
      list: {
        airplanes: 'SCLK.Skills.Airplanes',
        boats: 'SCLK.Skills.Boats',
        spaceships: 'SCLK.Skills.Spaceships',
        wheeledVehicles: 'SCLK.Skills.WheeledVehicles',
        antigravVehicles: 'SCLK.Skills.AntigravVehicles',
      },
    },
    roguery: {
      nameKey: 'SCLK.Skills.Roguery',
      primary: 'hab',
      secondary: 'acu',
      list: {
        skulduggery: 'SCLK.Skills.Skulduggery',
        pickpocket: 'SCLK.Skills.Pickpocket',
        security: 'SCLK.Skills.Security',
      },
    },
    sciences: {
      nameKey: 'SCLK.Skills.Sciences',
      special: true,
      secondary: 'int',
      list: {
        chemistry: {
          nameKey: 'SCLK.Skills.Chemistry',
          primary: 'hab',
        },
        medicine: {
          nameKey: 'SCLK.Skills.Medicine',
          primary: 'hab',
        },
        research: {
          nameKey: 'SCLK.Skills.Research',
          primary: 'wil',
        },
      },
    },
    sixthSense: {
      nameKey: 'SCLK.Skills.SixthSense',
      special: true,
      secondary: 'wil',
      list: {
        chronomancy: {
          nameKey: 'SCLK.Skills.Chronomancy',
          primary: 'int',
        },
        mentalism: {
          nameKey: 'SCLK.Skills.Mentalism',
          primary: 'emp',
        },
        telekinesy: {
          nameKey: 'SCLK.Skills.Telekinesy',
          primary: 'hab',
        },
        thermokinesy: {
          nameKey: 'SCLK.Skills.Thermokinesy',
          primary: 'acu',
        },
      },
    },
    shooting: {
      nameKey: 'SCLK.Skills.Shooting',
      primary: 'acu',
      secondary: 'hab',
      list: rangedWeaponTypes,
    },
  },
}
