class LogicScreen {

  /**
   * @type {InputNode[]}
   */
  in_pins = [];
  /**
   * @type {OutputNode[]}
   */
  out_pins = [];
  /** @type {Circuit[]} */
  logic_gates = [];


  // For now a straight line connecting is fine, don't think ill change that

  /**
   * @type {{ connects: [any, any]; xi: number; yi: number; xf: number; yf: number;}[]}
   */
  wires = [];
  /** @type {CanvasRenderingContext2D} */
  ctx;

  /** 
   * @param {CanvasRenderingContext2D} ctx 
   */
  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * @param {{x: number; y: number}} location 
   * @param {string} pinLabel
   */
  addInputPin(location, pinLabel) {
    const p = new InputNode();
    p.location = location;
    p.label = pinLabel;
    this.in_pins.push(p);
    this.render();
  }

  /**
   * @param {{x: number; y: number}} location 
   * @param {string} pinLabel
   */
  addOutputPin(location, pinLabel) {
    const p = new OutputNode();
    p.location = location;
    p.label = pinLabel;
    this.out_pins.push(p);
    this.render();
  }

  /**
   * 
   * @param {typeof Circuit} gate 
   * @param {{x: number; y: number}} location 
   */
  addLogicGate(Gate, location) {
    // const Gate = this.logic_gates.find(g => g.name === gateName);
    // const gate = new Gate();
    if (Gate !== undefined) {
      const gate = new Gate();
      gate.location = location;
      this.logic_gates.push(gate);
      this.render();
    }

  }

  evaluate() {

  }

  render() {
    const ctx = this.ctx;
    const canvas = ctx.canvas;


    // ctx.lineWidth = 1;


    // ctx.lineWidth = 1;

    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const wire of this.wires) {
      console.log(wire);
      console.log(wire.xi, wire.xf, wire.yi, wire.yf)
      ctx.lineWidth = 3;
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(wire.xi, wire.yi);
      ctx.lineTo(wire.xf, wire.yf);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.lineWidth = 1;

    ctx.strokeStyle = "#bfbfbf";
    for (const ip of this.in_pins) {
      ctx.beginPath();
      ctx.arc(ip.location.x, ip.location.y, 13, 0, Math.PI * 2);
      ctx.closePath();

      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.font = "medium sans-serif";
      ctx.fillText(ip.label, ip.location.x - 15, ip.location.y + 5);
      const pin_value = ip.getValue();


      if (pin_value) ctx.fillStyle = "red";
      else ctx.fillStyle = "#1c1c1c";

      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(pin_value.toString(), ip.location.x, ip.location.y + 6);
    }

    for (const op of this.out_pins) {
      ctx.beginPath();
      ctx.arc(op.location.x, op.location.y, 13, 0, Math.PI * 2);
      ctx.closePath();

      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = "medium sans-serif";
      ctx.fillText(op.label, op.location.x + 20, op.location.y + 5);
      const pin_value = op.getValue();
      if (pin_value) ctx.fillStyle = "red";
      else ctx.fillStyle = "#1c1c1c";

      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(pin_value.toString(), op.location.x, op.location.y + 6);

    }

    for (const lg of this.logic_gates) {
      // lg.name
      ctx.fillStyle = "#1c1c1c";
      ctx.strokeStyle = "#bfbfbf";
      ctx.beginPath();
      ctx.rect(lg.location.x, lg.location.y, 80, 40);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "medium sans-serif";
      ctx.fillText(lg.name, lg.location.x + 40, lg.location.y + 25);

    }

  }



}