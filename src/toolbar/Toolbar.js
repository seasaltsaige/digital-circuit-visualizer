// This probably shouldnt even be called the toolbar class anymore lol

class Toolbar {
  // Either edit the pins values or the circuit itself
  /** @type {"circuit" | "pins" | "delete" | "connect"} */
  selectedTool = "circuit";

  /** @type {null | typeof Circuit | typeof InputNode | typeof OutputNode} */
  selectedLogicItem = InputNode;
  logicItems = [];

  /** @type {HTMLCanvasElement} */
  canvas;

  /**
   * @type {{
   * pos: { x: number; y: number };
   * itemToMove: Circuit | InputNode | OutputNode | undefined;
   * }}
   */
  cursor = {
    pos: { x: 0, y: 0 },
    itemToMove: undefined,
  };

  connect_nodes = { node_a: null, node_b: null };

  constructor() {
    this.logicItems.push(InputNode);
    this.logicItems.push(OutputNode);
    this.logicItems.push(AND);
    this.logicItems.push(NOT);
    // let user build for themselves
    // this.logicItems.push(OR);
    // this.logicItems.push(NAND);
    // this.logicItems.push(NOR);
    // this.logicItems.push(XOR);
    this.canvas = document.getElementById("screen");

    this._init_();
  }

  _init_() {
    const toolbarItems = Array.from(document.getElementsByClassName("item"));
    const controlItems = toolbarItems.filter(v => v.classList.contains("control"));
    const logicItems = toolbarItems.filter(v => !v.classList.contains("control"));
    const deselect = document.getElementsByClassName("deselect").item(0);
    const custom_builder = document.getElementsByClassName("create-circuit").item(0);
    /**
     * @param {MouseEvent} ev 
     */
    custom_builder.onclick = (ev) => {
      const in_pins = lScreen.in_pins;
      const out_pins = lScreen.out_pins;

      if (in_pins.length < 1) return alert("You must have at least one input pin.");
      if (out_pins.length < 1) return alert("You must have at least one output pin.");
      if (lScreen.wires.length < 1) return alert("You must make at least one connection.");
      let LOGIC_NAME = prompt("What do you want to call this circuit:");
      while (/\s/g.test(LOGIC_NAME))
        LOGIC_NAME = prompt("Logic Gate name may not contain whitespace:");

      // Create the custom circuit builder, and add it to the list of available logic items
      this.logicItems.push(new CustomCircuitBuilder(in_pins, out_pins, LOGIC_NAME));

      // Remove everything from the screen, and reset
      lScreen.in_pins = [];
      lScreen.out_pins = [];
      lScreen.logic_gates = [];
      lScreen.wires = [];
      lScreen.render();

      // Add the div to the dom for use
      const lb = document.getElementsByClassName("logic")[0]
      const custom_div = document.createElement("div");
      const custom_div_name = document.createElement("h3");
      custom_div_name.innerText = LOGIC_NAME;
      custom_div.appendChild(custom_div_name);
      custom_div.classList.add("item", LOGIC_NAME);
      lb.appendChild(custom_div);

      logicItems.push(custom_div);

      custom_div.onclick = (ev) => {
        ev.preventDefault();
        const target = ev.currentTarget;
        const currentSelected = logicItems.find(v => v.classList.contains("selected"));
        if (currentSelected !== undefined) {
          currentSelected.classList.remove("selected");
          target.classList.add("selected");
        } else {
          target.classList.add("selected");
        }
        const logicItemName = Array.from(target.classList).filter(n => n !== "item" && n !== "selected")[0];
        this.selectedLogicItem = this.logicItems.find(clss => clss.name === logicItemName);
      }

    }


    /**
     * @param {MouseEvent} ev 
     */
    deselect.onclick = (ev) => {
      for (const item of logicItems) {
        item.classList.remove("selected");
      }
      this.selectedLogicItem = null;
    }

    for (const ci of controlItems) {
      /** @param {MouseEvent} ev */
      ci.onclick = (ev) => {
        ev.preventDefault();
        const targ = ev.currentTarget;
        const currentSelected = controlItems.find(v => v.classList.contains("selected"))
        currentSelected.classList.remove("selected");
        targ.classList.add("selected");
        this.selectedTool = targ.classList.contains("update-circuit")
          ? "circuit"
          : targ.classList.contains("delete")
            ? "delete"
            : targ.classList.contains("connect")
              ? "connect"
              : "pins";

        if (this.selectedTool === "circuit") {
          this.canvas.classList.forEach(v => this.canvas.classList.remove(v));
          this.canvas.classList.add("hand");
        } else if (this.selectedTool === "delete") {
          this.canvas.classList.forEach(v => this.canvas.classList.remove(v));
          this.canvas.classList.add("delete")
          for (const item of logicItems)
            item.classList.remove("selected");
          this.selectedLogicItem = null;
        } else if (this.selectedTool === "connect") {
          this.canvas.classList.forEach(v => this.canvas.classList.remove(v));
          this.canvas.classList.add("connect");
          for (const item of logicItems)
            item.classList.remove("selected");
          this.selectedLogicItem = null;
        } else {
          this.canvas.classList.forEach(v => this.canvas.classList.remove(v));
          this.canvas.classList.add("pointer");
          for (const item of logicItems)
            item.classList.remove("selected");
          this.selectedLogicItem = null;
        }
      }

    }

    for (const li of logicItems) {
      li.onclick = (ev) => {
        ev.preventDefault();
        const target = ev.currentTarget;
        const currentSelected = logicItems.find(v => v.classList.contains("selected"));
        if (currentSelected !== undefined) {
          currentSelected.classList.remove("selected");
          target.classList.add("selected");
        } else {
          target.classList.add("selected");
        }
        const logicItemName = Array.from(target.classList).filter(n => n !== "item" && n !== "selected")[0];
        this.selectedLogicItem = this.logicItems.find(clss => clss.name === logicItemName);
      }
    }


    /** @param {MouseEvent} ev */
    this.canvas.onclick = (ev) => {
      const clickPosition = { x: ev.clientX, y: ev.clientY };

      if (this.selectedTool === "circuit") {
        if (this.selectedLogicItem === null) return
        if (this.selectedLogicItem.name === "input") {
          let pValue = null;
          let text = "Provide an Identifier for the pin:";
          while (pValue === null || (lScreen.in_pins.find(v => v.label === pValue) !== undefined || lScreen.out_pins.find(v => v.label === pValue) !== undefined)) {
            pValue = prompt(text);
            text = "That identifier has already been used, please use a new one:"
          }
          lScreen.addInputPin(clickPosition, pValue);
        } else if (this.selectedLogicItem.name === "output") {
          let pValue = null;
          let text = "Provide an Identifier for the pin:";
          while (pValue === null || lScreen.out_pins.find(v => v.label === pValue) !== undefined || lScreen.in_pins.find(v => v.label === pValue) !== undefined) {
            pValue = prompt(text);
            text = "That identifier has already been used, please use a new one:"
          }
          lScreen.addOutputPin(clickPosition, pValue);
        } else {
          clickPosition.x -= 55;
          clickPosition.y -= 38;
          // custom gate case
          if (this.selectedLogicItem.builder) {
            const gate = this.selectedLogicItem.build();
            gate.location = clickPosition;
            lScreen.logic_gates.push(gate);
            lScreen.render();
          } else
            lScreen.addLogicGate(this.selectedLogicItem, clickPosition);
        }
      } else if (this.selectedTool === "delete") {

        const in_pins = lScreen.in_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const out_pins = lScreen.out_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const lgs = lScreen.logic_gates.filter(lg => this._withinRect_(lg.location, clickPosition, 100, 75));

        let item = null;
        if (in_pins.length > 0) {
          item = in_pins[0];
          lScreen.in_pins.splice(lScreen.in_pins.findIndex(v => v.label === item.label), 1);
        } else if (out_pins.length > 0) {
          item = out_pins[0];
          lScreen.out_pins.splice(lScreen.out_pins.findIndex(v => v.label === item.label), 1);
        } else if (lgs.length > 0) {
          item = lgs[0];
          lScreen.logic_gates.splice(lScreen.logic_gates.findIndex(v => v.location.x === item.location.x && v.location.y === item.location.y), 1);

        }

        let pins = [];
        if (item.inputs) pins.push(...item.inputs);
        if (item.outputs) pins.push(...item.outputs);

        const wires_related = [];
        for (const pin of pins) {
          const wires = lScreen.wires.filter(wire => wire.connects[0]._id === pin._id || wire.connects[1]._id === pin._id);
          wires_related.push(...wires);
        }

        for (const w of wires_related) {
          const nodes = w.connects;
          const a = nodes[0];
          const b = nodes[1];
          // remove relation
          if (a.name === "input" || a.name === "circuit_output") a.outputs.splice(a.outputs.findIndex(v => v._id === b._id), 1);

          if (b.name === "output") b.inputs.splice(b.inputs.findIndex(v => v._id === a._id), 1);
          else if (b.name === "circuit_input") b.input = null;

          // remove wire
          lScreen.wires.splice(lScreen.wires.findIndex(wire => wire.status === w.status && wire.xi === w.xi && wire.xf === w.xf && wire.yi === w.yi && wire.yf === wire.yf), 1);
        }
        lScreen.render();

      } else if (this.selectedTool === "connect") {

        const in_pins = lScreen.in_pins.filter(pin => this._withinCircle_({ x: pin.location.x + 13 + 10, y: pin.location.y }, clickPosition, 5));
        const out_pins = lScreen.out_pins.filter(pin => this._withinCircle_({ x: pin.location.x - 13 - 10, y: pin.location.y }, clickPosition, 5));

        const logic_pins = [];
        lScreen.logic_gates.forEach((lg) => {
          logic_pins.push(...lg.inputs.filter(v => this._withinCircle_(v.location, clickPosition, 5)));
          logic_pins.push(...lg.outputs.filter(v => this._withinCircle_(v.location, clickPosition, 5)));
        });


        // TODO: Maybe reffactor these kinds of things
        let item = null;
        if (in_pins.length > 0)
          item = in_pins[0];
        else if (out_pins.length > 0)
          item = out_pins[0];
        else if (logic_pins.length > 0)
          item = logic_pins[0];
        if (item === null) return;

        if (this.connect_nodes.node_a === null) {
          this.connect_nodes.node_a = item;
        } else if (this.connect_nodes.node_b === null) {
          if (this.connect_nodes.node_a._id === item._id) return;
          this.connect_nodes.node_b = item;

          lScreen.addWire([this.connect_nodes.node_a, this.connect_nodes.node_b]);
          this.connect_nodes = { node_a: null, node_b: null };
        }

        lScreen.render();
      } else {
        const pins = lScreen.in_pins.filter(v => this._withinCircle_(v.location, clickPosition, 13))
        if (pins.length < 1) return;

        const pin = pins[0];
        pin.updateNode(pin.value === 0 ? 1 : 0);
        lScreen.evaluate();
        lScreen.render();
      }

    }

    /** @param {MouseEvent} ev */
    this.canvas.onmousedown = (ev) => {
      if (this.selectedTool !== "circuit") return;
      if (this.selectedLogicItem !== null) return;

      const clickPosition = { x: ev.clientX, y: ev.clientY };

      let items = [];
      const in_pins = lScreen.in_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
      const out_pins = lScreen.out_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
      const lgs = lScreen.logic_gates.filter(lg => this._withinRect_(lg.location, clickPosition, 100, 75));
      items.push(...in_pins);
      items.push(...out_pins);
      items.push(...lgs);

      if (items.length > 0) {
        const item = items[0];
        // I hate this
        if (item.label === undefined) {
          clickPosition.x -= 55;
          clickPosition.y -= 38;
        }
        this.cursor.itemToMove = item;
        this.cursor.pos = clickPosition;
      }

    }

    /** @param {MouseEvent} ev */
    this.canvas.onmousemove = (ev) => {
      if (this.selectedLogicItem !== null) return;
      if (this.cursor.itemToMove === undefined) return;

      this.cursor.pos = { x: ev.clientX, y: ev.clientY };

      if (this.cursor.itemToMove.label === undefined) {
        this.cursor.pos.x -= 55;
        this.cursor.pos.y -= 38;
      }

      this.cursor.itemToMove.location = this.cursor.pos;
      lScreen.render();
    }
    /** @param {MouseEvent} ev */
    this.canvas.onmouseup = (ev) => {
      if (this.selectedLogicItem !== null) return;
      if (this.cursor.itemToMove === undefined) return;
      this.cursor.pos = { x: ev.clientX, y: ev.clientY };

      if (this.cursor.itemToMove.label === undefined) {
        this.cursor.pos.x -= 55;
        this.cursor.pos.y -= 38;
      }

      this.cursor.itemToMove.location = this.cursor.pos;
      this.cursor.itemToMove = undefined;
      lScreen.render();
    }

  }
  /**
   * @param {{x: number; y: number;}} circleOrigin 
   * @param {{x: number, y: number}} position 
   * @param {number} radius 
   */
  _withinCircle_(circleOrigin, position, radius) {
    if (Math.sqrt(Math.pow((circleOrigin.x - position.x), 2) + Math.pow((circleOrigin.y - position.y), 2)) > radius) return false;
    else return true;
  }

  /**
   * @param {{x: number; y:number}} topLeftRect 
   * @param {{x: number; y:number}} position 
   * @param {number} width 
   * @param {number} height 
   */
  _withinRect_(topLeftRect, position, width, height) {
    if (position.x >= topLeftRect.x && position.x <= (topLeftRect.x + width) && position.y >= topLeftRect.y && position.y <= (topLeftRect.y + height)) return true;
    else return false;
  }
}
