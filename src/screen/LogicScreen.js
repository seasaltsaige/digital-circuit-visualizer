class LogicScreen {
  /** @type {InputNode[]} */
  in_pins = [];
  /** @type {OutputNode[]} */
  out_pins = [];
  /** @type {Circuit[]} */
  logic_gates = [];
  /** @type {{ connects: [any, any]; xi: number; yi: number; xf: number; yf: number; status: 0 | 1 }[]} */
  wires = [];
  /** @type {CanvasRenderingContext2D} */
  ctx;
  /** @param {CanvasRenderingContext2D} ctx */
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
   * @param {typeof Circuit} gate 
   * @param {{x: number; y: number}} location 
   */
  addLogicGate(Gate, location) {
    if (Gate !== undefined) {
      const gate = new Gate();
      gate.location = location;
      this.logic_gates.push(gate);
      this.render();
    }
  }

  /** @param {[InputNode | OutputNode | CircuitInputNode | CircuitOutputNode, InputNode | OutputNode | CircuitInputNode | CircuitOutputNode]} wire */
  addWire(wire) {
    const toConnect = wire;
    const first_node = toConnect[0];
    const second_node = toConnect[1];

    if (second_node.name === "input" || first_node.name === "output" || second_node.name === "circuit_output" || first_node.name === "circuit_input")
      toConnect.reverse();

    // render offset for inputs and outputs
    const xi = toConnect[0].name === "input" ? toConnect[0].location.x + 23 : toConnect[0].location.x;
    const xf = toConnect[1].name === "output" ? toConnect[1].location.x - 23 : toConnect[1].location.x;

    const a = toConnect[0];
    const b = toConnect[1];

    a.updateOutputs(b);
    b.updateInputs(a);

    this.wires.push({ connects: wire, status: 0, xi: xi, yi: toConnect[0].location.y, xf: xf, yf: toConnect[1].location.y });
  }

  evaluate() {
    // Back to front
    for (const outNode of this.out_pins)
      outNode.evaluate();

    for (const wire of this.wires) {
      if ((wire.connects[0].value === 1))
        wire.status = 1;
      else wire.status = 0;
    }
  }



  render() {
    const ctx = this.ctx;
    const canvas = ctx.canvas;

    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const wire of this.wires) {
      const xi = wire.connects[0].name === "input" ? wire.connects[0].location.x + 23 : wire.connects[0].location.x;
      const xf = wire.connects[1].name === "output" ? wire.connects[1].location.x - 23 : wire.connects[1].location.x;

      wire.xi = xi;
      wire.yi = wire.connects[0].location.y;
      wire.xf = xf;
      wire.yf = wire.connects[1].location.y;

      ctx.lineWidth = 4;
      this._line_(ctx, wire.xi, wire.yi, wire.xf, wire.yf, wire.status === 0 ? "#1c1c1c" : "red")
    }

    ctx.lineWidth = 1;
    let nodeOffset = 10;

    for (const ip of this.in_pins) {
      this._line_(ctx, ip.location.x + 13, ip.location.y, ip.location.x + 13 + nodeOffset, ip.location.y, "#bfbfbf")
      this._arc_(ctx, ip.location.x + 13 + nodeOffset, ip.location.y, 5, 0, Math.PI * 2, "black");
      this._arc_(ctx, ip.location.x, ip.location.y, 13, 0, Math.PI * 2, "black");

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
      this._line_(ctx, op.location.x - 13, op.location.y, op.location.x - 13 - nodeOffset, op.location.y, "#bfbfbf");
      this._arc_(ctx, op.location.x - 13 - nodeOffset, op.location.y, 5, 0, Math.PI * 2, "black");
      this._arc_(ctx, op.location.x, op.location.y, 13, 0, Math.PI * 2);

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
      this.logicGateRender(ctx, lg);
    }

  }

  // Temp function: TODO: Split into smaller functions for code readability
  /**
   * @param {CanvasRenderingContext2D} ctx  
   * @param {Circuit} logicGate  */
  logicGateRender(ctx, logicGate) {

    let n1 = logicGate.inputs.length;
    let n2 = logicGate.outputs.length;
    // arbitrary
    let r = 5;

    // TODO: Bar length should vary with amount of inputs as well ideally.
    const d1 = Math.max((r * 2) * n1 + (r * n1), 75);
    const d2 = Math.max((r * 2) * n2 + (r * n2), 75);

    // let d = 75;
    // middle of logic gate (40x80)
    let midY = logicGate.location.y + (80 / 2);
    let sep = (d1 - n1 * r) / (n1 + 1);
    let sep2 = (d2 - n2 * r) / (n2 + 1);
    let xPos = logicGate.location.x;
    let nodeOffset = 10;
    let rectHeight = 40;
    let rectWidth = 80;

    // input bar
    this._line_(ctx, xPos, midY - (d1 / 2), xPos, midY + (d1 / 2), "black");

    // input nodes
    for (let i = 1; i <= n1; i++) {
      const inpNode = logicGate.inputs[i - 1];

      const yPos = (i * sep) + ((i - 1) * r) + midY - (d1 / 2);

      // connecting line between bar and node
      this._line_(ctx, xPos - nodeOffset, yPos, xPos, yPos, "black");

      // input node
      this._arc_(ctx, xPos - nodeOffset, yPos, r, 0, Math.PI * 2, "black");
      inpNode.location = { x: xPos - nodeOffset, y: yPos };
      inpNode.r = r;

      ctx.fillStyle = "white";
      ctx.textAlign = "right";
      ctx.font = "small sans-serif";
      ctx.fillText(inpNode.label || "", inpNode.location.x - 7, inpNode.location.y + 3);
    }

    // output bar
    let xPos2 = xPos + nodeOffset * 2 + rectWidth;
    this._line_(ctx, xPos2, midY - (d2 / 2), xPos2, midY + (d2 / 2), "black");


    // output nodes
    for (let j = 1; j <= n2; j++) {
      const oupNode = logicGate.outputs[j - 1];
      const yPos = (j * sep2) + ((j - 1) * r) + midY - (d2 / 2);

      // connect output node to bar
      this._line_(ctx, xPos2 + nodeOffset, yPos, xPos2, yPos, "black");

      // output node

      this._arc_(ctx, xPos2 + nodeOffset, yPos, r, 0, Math.PI * 2, "black");

      oupNode.location = { x: xPos2 + nodeOffset, y: yPos };
      oupNode.r = r;

      ctx.fillStyle = "white";
      ctx.textAlign = "left";
      ctx.font = "small sans-serif";
      ctx.fillText(oupNode.label || "", oupNode.location.x + 7, oupNode.location.y + 3);

    }

    this._line_(ctx, xPos + nodeOffset, midY, xPos, midY, "black");

    this._line_(ctx, xPos2 - nodeOffset, midY, xPos2, midY, "black");

    // circuit body
    ctx.beginPath();
    ctx.rect(xPos + nodeOffset, midY - (rectHeight / 2), rectWidth, rectHeight);
    ctx.closePath();

    ctx.fillStyle = "#1c1c1c";
    ctx.strokeStyle = "#bfbfbf";

    ctx.fill();
    ctx.stroke();

    // circuit name
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "medium sans-serif";
    ctx.fillText(logicGate.name, logicGate.location.x + 50, logicGate.location.y + 46);

  }

  // Util for drawing circuit
  _line_(ctx, startx, starty, endx, endy, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
    ctx.closePath();
  }

  _arc_(ctx, x, y, r, sa, ea, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, sa, ea);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}