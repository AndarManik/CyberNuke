interface NetworkInput {
  q: boolean;
  w: boolean;
  e: boolean;
  s: boolean;

  mouseDown: boolean;
  mouseX: number;
  mouseY: number;
}

class PlayerInput {
  q: boolean = false;
  w: boolean = false;
  e: boolean = false;
  s: boolean = false;

  prevQ: boolean = false;
  prevW: boolean = false;
  prevE: boolean = false;
  prevS: boolean = false;

  mouseDown: boolean = false;
  prevMouseDown: boolean = false;

  mouseX: number = 0;
  mouseY: number = 0;

  updateState(networkInput: NetworkInput) {
    this.prevQ = this.q;
    this.prevW = this.w;
    this.prevE = this.e;
    this.prevS = this.s;

    this.q = networkInput.q;
    this.w = networkInput.w;
    this.e = networkInput.e;
    this.s = networkInput.s;

    this.prevMouseDown = this.mouseDown;
    this.mouseDown = networkInput.mouseDown;

    this.mouseX = networkInput.mouseX;
    this.mouseY = networkInput.mouseY;
  }

  isQUsed() {
    return this.prevQ && !this.q && !this.s;
  }

  isWUsed() {
    return this.prevW && !this.w && !this.s;
  }

  isEUsed() {
    return this.prevE && !this.e && !this.s;
  }
}

export { NetworkInput, PlayerInput };
