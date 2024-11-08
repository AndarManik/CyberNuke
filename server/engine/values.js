function getValues() {
  return {
    game: {
      tick: 128,
    },
    abilities: {
      basic: {
        meleeAttack: {
          cooldown: 0,//4
          castRange: 50,
          damage: 100,
          timeToHit: 0.1,
        },
        rangeAttack: {
          cooldown: 0,//3
          castRange: 100,
          damage: 60,
          movespeed: 450,
        },
      },
    },
    colors: {
      blue: {
        health: "oklch(70% 0.15 96)",
        terrain: "oklch(70% 0.075 240)",
        weak: {
          light: "oklch(70% 0.15 264)",
          medium: "oklch(60% 0.125 264)",
          dark: "oklch(50% 0.1 264)",
        },
        medium: {
          light: "oklch(70% 0.15 240)",
          medium: "oklch(60% 0.125 240)",
          dark: "oklch(50% 0.1 240)",
        },
        strong: {
          light: "oklch(70% 0.15 216)",
          medium: "oklch(60% 0.125 216)",
          dark: "oklch(50% 0.1 216)",
        },
      },
      green: {
        health: "oklch(70% 0.15 24)",
        terrain: "oklch(70% 0.075 168)",
        weak: {
          light: "oklch(70% 0.15 192)",
          medium: "oklch(60% 0.125 192)",
          dark: "oklch(50% 0.1 192)",
        },
        medium: {
          light: "oklch(70% 0.15 168)",
          medium: "oklch(60% 0.125 168)",
          dark: "oklch(50% 0.1 168)",
        },
        strong: {
          light: "oklch(70% 0.15 144)",
          medium: "oklch(60% 0.125 144)",
          dark: "oklch(50% 0.1 144)",
        },
      },
      yellow: {
        health: "oklch(70% 0.15 312)",
        terrain: "oklch(70% 0.075 96)",
        weak: {
          light: "oklch(70% 0.15 120)",
          medium: "oklch(60% 0.125 120)",
          dark: "oklch(50% 0.1 120)",
        },
        medium: {
          light: "oklch(70% 0.15 96)",
          medium: "oklch(60% 0.125 96)",
          dark: "oklch(50% 0.1 96)",
        },
        strong: {
          light: "oklch(70% 0.15 72)",
          medium: "oklch(60% 0.125 72)",
          dark: "oklch(50% 0.1 72)",
        },
      },
      red: {
        health: "oklch(70% 0.15 240)",
        terrain: "oklch(70% 0.075 24)",
        weak: {
          light: "oklch(70% 0.15 48)",
          medium: "oklch(60% 0.125 48)",
          dark: "oklch(50% 0.1 48)",
        },
        medium: {
          light: "oklch(70% 0.15 24)",
          medium: "oklch(60% 0.125 24)",
          dark: "oklch(50% 0.1 24)",
        },
        strong: {
          light: "oklch(70% 0.15 0)",
          medium: "oklch(60% 0.125 0)",
          dark: "oklch(50% 0.1 0)",
        },
      },
      purple: {
        health: "oklch(70% 0.15 168)",
        terrain: "oklch(70% 0.075 312)",
        weak: {
          light: "oklch(70% 0.15 336)",
          medium: "oklch(60% 0.125 336)",
          dark: "oklch(50% 0.1 336)",
        },
        medium: {
          light: "oklch(70% 0.15 312)",
          medium: "oklch(60% 0.125 312)",
          dark: "oklch(50% 0.1 312)",
        },
        strong: {
          light: "oklch(70% 0.15 288)",
          medium: "oklch(60% 0.125 288)",
          dark: "oklch(50% 0.1 288)",
        },
      },
    },
    //CALM: add standard colors
  };
}

//CALM: make the other parts of the game use this
module.exports = getValues;
