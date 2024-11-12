class Values {
  game = { tick: 64 };

  abilities = {
    basic: {
      meleeAttack: { cooldown: 0, castRange: 50, damage: 100, timeToHit: 0.1 },
      rangeAttack: { cooldown: 0, castRange: 100, damage: 60, movespeed: 450 },
    },
  };

  colors = new Colors();
}

class Colors {
  blue: ColorSuite = new ColorSuite(240);
  green: ColorSuite = new ColorSuite(168);
  yellow: ColorSuite = new ColorSuite(96);
  red: ColorSuite = new ColorSuite(24);
  purple: ColorSuite = new ColorSuite(312);
}

class ColorSuite {
  health: string;
  terrain: string;
  weak: ColorStrengths;
  medium: ColorStrengths;
  strong: ColorStrengths;

  constructor(hue: number) {
    this.health = `oklch(70% 0.15 ${hue - 144})`;
    this.terrain = `oklch(70% 0.075 ${hue})`;
    this.weak = new ColorStrengths(hue - 24);
    this.medium = new ColorStrengths(hue);
    this.strong = new ColorStrengths(hue + 24);
  }
}

class ColorStrengths {
  light: string;
  medium: string;
  dark: string;
  constructor(hue: number) {
    this.light = `oklch(70% 0.15 ${hue})`;
    this.medium = `oklch(60% 0.125 ${hue})`;
    this.dark = `oklch(50% 0.1 ${hue})`;
  }
}

export { Values, Colors, ColorSuite, ColorStrengths };