class BasicMeleeAttack {
  constructor() {
    this.cooldown = 1;
    this.castRange = 50;
    this.element = document.createElement("div");
    this.element.style.width = this.castRange;
    this.element.style.height = this.castRange;
    this.element.style.borderRadius = this.castRange + "px";
    this.element.style.backgroundColor = "hsla(60, 29%, 53%, 0.2)";
    this.element.style.border = "1px solid hsla(60, 29%, 53%, 0.867)";

    this.element.style.left = 350 - this.castRange;
    this.element.style.top = 350 - this.castRange;

    this.element.style.display = "none";
    this.element.style.position = "absolute";

    document.getElementById("gameWindow").append(this.element);
  }

  setState(state) {
    this.cooldown = state.cooldown;
    this.castRange = state.castRange * 2;
  }

  render() {
    this.element.style.width = this.castRange;
    this.element.style.height = this.castRange;
    this.element.style.borderRadius = this.castRange;
  }

  activate() {
    this.element.style.display = "block";
  }

  deactivate() {
    this.element.style.display = "none";
  }
}
//This class needs to change so that it doesn't have to read the otherplayers position, rather the
//server should provide the positions.
class BasicMeleeAttackEntity {
  constructor(player, state, otherPlayers, userID) {
    this.player = player;

    this.caster = state.caster == userID ? player : otherPlayers[state.caster];
    this.receiver =
      state.receiver == userID ? player : otherPlayers[state.receiver];

    this.entityX = this.caster.playerX;
    this.entityY = this.caster.playerY;
    this.direction = state.direction;

    this.element = document.createElement("div");
    const style = this.element.style;
    style.width = 15;
    style.height = 50;
    style.backgroundColor = "hsl(60, 29%, 53%)";
    style.left = 350 - 7.5;
    style.top = 350 - 25;
    style.position = "absolute";

    document.getElementById("gameWindow").append(this.element);
  }

  setState(state) {
    this.entityX = this.caster.playerX;
    this.entityY = this.caster.playerY;
    this.direction = state.direction;
  }

  render() {
    this.element.style.transform = `translate(${
      this.entityX - this.player.playerX + Math.sin(this.direction) * 25
    }px, ${this.entityY - this.player.playerY + Math.cos(this.direction) * -25}px) rotate(${57.3 * this.direction}deg)`;
  }

  remove() {
    this.element.remove();
  }
}

export { BasicMeleeAttackEntity, BasicMeleeAttack };
