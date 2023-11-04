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
   * @type {{ connects: [any, any]; xi: number; yi: number; xf: number; yf: number; status: 0 | 1 }[]}
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
    if (Gate !== undefined) {
      const gate = new Gate();
      gate.location = location;
      this.logic_gates.push(gate);
      this.render();
    }
  }


  /** @param {{ connects: [any, any]; xi: number; yi: number; xf: number; yf: number; status: 0 | 1 }} wire */
  addWire(wire) {
    const toConnect = wire.connects;
    const nodeA = toConnect[0];
    const nodeB = toConnect[1];

    nodeB.updateInputs(nodeA);
    nodeA.updateOutputs(nodeB);

    this.wires.push(wire);
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

    this.evaluate();
    const ctx = this.ctx;
    const canvas = ctx.canvas;

    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const wire of this.wires) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = wire.status === 0 ? "#1c1c1c" : "red";
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
      this.logicGateRender(ctx, lg);
    }

  }

  // Temp function
  /** @param {Circuit} logicGate  */
  logicGateRender(ctx, logicGate) {

    let n1 = logicGate.inputs.length;
    let n2 = logicGate.outputs.length;
    // arbitrary
    let r = 5;
    // arbitrary
    let d = 75;
    // middle of logic gate (40x80)
    let midY = logicGate.location.y + (80 / 2);
    let sep = (d - n1 * r) / (n1 + 1);
    let sep2 = (d - n2 * r) / (n2 + 1);
    let xPos = logicGate.location.x;
    let nodeOffset = 10;
    let rectHeight = 40;
    let rectWidth = 80;

    // input bar
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(xPos, midY - (d / 2));
    ctx.lineTo(xPos, midY + (d / 2));
    ctx.stroke();
    ctx.closePath();
    // input nodes
    for (let i = 1; i <= n1; i++) {
      const yPos = (i * sep) + ((i - 1) * r) + midY - (d / 2);
      // node
      ctx.beginPath();
      ctx.moveTo(xPos - nodeOffset, yPos);
      ctx.lineTo(xPos, yPos);
      ctx.stroke();
      ctx.closePath();
      // connecting wire to input bar
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(xPos - nodeOffset, yPos, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      logicGate.inputs[i - 1].location = { x: xPos - nodeOffset, y: yPos };

    }


    // output bar
    let xPos2 = xPos + nodeOffset * 2 + rectWidth;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(xPos2, midY - (d / 2));
    ctx.lineTo(xPos2, midY + (d / 2));
    ctx.stroke();
    ctx.closePath();

    // output nodes
    for (let j = 1; j <= n2; j++) {
      const yPos = (j * sep2) + ((j - 1) * r) + midY - (d / 2);
      // 
      ctx.beginPath();
      ctx.moveTo(xPos2 + nodeOffset, yPos);
      ctx.lineTo(xPos2, yPos);
      ctx.stroke();
      ctx.closePath();

      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(xPos2 + nodeOffset, yPos, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      logicGate.outputs[j - 1].location = { x: xPos2 + nodeOffset, y: yPos };
      logicGate.outputs[j - 1].r = r;
    }

    ctx.strokeStyle = "black";
    // connect input bar to LG
    ctx.beginPath();
    ctx.moveTo(xPos, midY);
    ctx.lineTo(xPos + nodeOffset, midY);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "black";
    // connect output bar to LG
    ctx.beginPath();
    ctx.moveTo(xPos2, midY);
    ctx.lineTo(xPos2 - nodeOffset, midY);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(xPos + nodeOffset, midY - (rectHeight / 2), rectWidth, rectHeight);
    ctx.closePath();
    ctx.fillStyle = "#1c1c1c";
    ctx.strokeStyle = "#bfbfbf";
    ctx.fill();
    ctx.stroke();


    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "medium sans-serif";
    ctx.fillText(logicGate.name, logicGate.location.x + 55, logicGate.location.y + 45);

  }


}