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
   * wiresToUpdate: { connects: [any, any]; xi: number; yi: number; xf: number; yf: number; status: 0 | 1 }[];
   * }}
   */
  cursor = {
    pos: {
      x: 0,
      y: 0,
    },
    itemToMove: undefined,
    wiresToUpdate: undefined,
  }

  connect_nodes = {
    node_a: null,
    node_b: null,
  }

  constructor() {
    this.logicItems.push(InputNode);
    this.logicItems.push(OutputNode);
    this.logicItems.push(AND);
    this.logicItems.push(NOT);
    this.logicItems.push(OR);
    this.logicItems.push(NAND);
    this.logicItems.push(NOR);
    this.logicItems.push(XOR);
    this.canvas = document.getElementById("screen");

    this._init_();
  }

  _init_() {
    const toolbarItems = Array.from(document.getElementsByClassName("item"));
    const controlItems = toolbarItems.filter(v => v.classList.contains("control"));
    const logicItems = toolbarItems.filter(v => !v.classList.contains("control"));
    const deselect = document.getElementsByClassName("deselect").item(0);

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
      /**
       * 
       * @param {MouseEvent} ev 
       */
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

        } else {
          this.canvas.classList.forEach(v => this.canvas.classList.remove(v));
          this.canvas.classList.add("pointer");
        }
      }

    }

    for (const li of logicItems) {

      /**
       * @param {MouseEvent} ev
       */
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
        // Place holder, will want to be able to drag
        if (this.selectedLogicItem !== null) {
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
            console.log(clickPosition);
            lScreen.addLogicGate(this.selectedLogicItem, clickPosition);
            console.log(lScreen.logic_gates[lScreen.logic_gates.length - 1].location);
          }
        }
      } else if (this.selectedTool === "delete") {
        // TODO: Delete wires associated with node that gets deleted


        const in_pins = lScreen.in_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const out_pins = lScreen.out_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const lgs = lScreen.logic_gates.filter(lg => this._withinRect_(lg.location, clickPosition, 80, 40));

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

        lScreen.render();

      } else if (this.selectedTool === "connect") {
        // TODO: Update connection code to work with new node system.

        // connection code here
        const in_pins = lScreen.in_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const out_pins = lScreen.out_pins.filter(pin => this._withinCircle_(pin.location, clickPosition, 13));
        const lgs = lScreen.logic_gates.filter(lg => this._withinRect_(lg.location, clickPosition, 80, 40));

        let item = null;
        if (in_pins.length > 0)
          item = in_pins[0];
        else if (out_pins.length > 0)
          item = out_pins[0];
        else if (lgs.length > 0)
          item = lgs[0];

        if (item === null) return;





        // TODO: Update code so that connecting nodes backwards is ok, gonna be kinda difficult to do i think, if I even can
        // might be easier with new nodes system
        if (this.connect_nodes.node_a === null) {
          this.connect_nodes.node_a = item;
        } else if (this.connect_nodes.node_b === null) {
          if (this.connect_nodes.node_a._id === item._id) return;
          this.connect_nodes.node_b = item;

          const xi = this.connect_nodes.node_a.label ? this.connect_nodes.node_a.location.x : this.connect_nodes.node_a.location.x + 40;
          const yi = this.connect_nodes.node_a.label ? this.connect_nodes.node_a.location.y : this.connect_nodes.node_a.location.y + 24;
          const xf = this.connect_nodes.node_b.label ? this.connect_nodes.node_b.location.x : this.connect_nodes.node_b.location.x + 40;
          const yf = this.connect_nodes.node_b.label ? this.connect_nodes.node_b.location.y : this.connect_nodes.node_b.location.y + 24;

          lScreen.addWire({ connects: [this.connect_nodes.node_a, this.connect_nodes.node_b], xi, xf, yi, yf, status: 0 });

          this.connect_nodes = {
            node_a: null,
            node_b: null,
          }
        }

        lScreen.render();
      } else {
        const pins = lScreen.in_pins.filter(v => this._withinCircle_(v.location, clickPosition, 13))
        if (pins.length > 0) {
          const pin = pins[0];
          pin.updateNode(pin.value === 0 ? 1 : 0);
          lScreen.evaluate();
          lScreen.render();
        }
      }

    }

    // I hate that this is in the toolbar class, but oh well
    /** @param {MouseEvent} ev */
    this.canvas.onmousedown = (ev) => {
      if (this.selectedTool !== "circuit") return;
      if (this.selectedLogicItem !== null) return;

      // Drag code fixed
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

        const wires = lScreen.wires.filter(v => v.connects[0]._id === item._id || v.connects[1]._id === item._id);

        this.cursor.itemToMove = item;
        this.cursor.pos = clickPosition;
        if (wires.length > 0) this.cursor.wiresToUpdate = wires;
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
      if (this.cursor.wiresToUpdate) {
        for (const wire of this.cursor.wiresToUpdate) {
          if (wire) {
            const ind = wire.connects.findIndex(v => v._id === this.cursor.itemToMove._id);
            if (ind === 0) {
              wire.xi = ev.clientX;
              wire.yi = ev.clientY;
            } else {
              wire.xf = ev.clientX;
              wire.yf = ev.clientY;
            }
          }
        }
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

      if (this.cursor.wiresToUpdate) {
        for (const wire of this.cursor.wiresToUpdate) {
          if (wire) {
            const ind = wire.connects.findIndex(v => v._id === this.cursor.itemToMove._id);
            if (ind === 0) {
              wire.xi = ev.clientX;
              wire.yi = ev.clientY;
            } else {
              wire.xf = ev.clientX;
              wire.yf = ev.clientY;
            }
          }
        }
      }

      this.cursor.itemToMove.location = this.cursor.pos;
      this.cursor.itemToMove = undefined;
      this.cursor.wiresToUpdate = undefined;
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
