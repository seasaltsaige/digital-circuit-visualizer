class NOR extends Circuit {
  static name = "NOR";
  name = "NOR";

  inputs = [new CircuitInputNode(), new CircuitInputNode()];
  outputs = [new CircuitOutputNode(this)];

  constructor() {
    super();
  }

  __evaluate__() {
    if (this.inputs.length < 2) return 0;
    const vals = this.inputs.map(n => n.getValue());
    // const num_ones = vals.filter(v => v === 1);
    if (vals.includes(1)) return 0;
    else return 1;
  }


  /** @param {...InputNode | OutputNode} inps */
  updateInputs(...inps) {
    for (const inp of inps) {
      this.inputs.push(inp);
    }
    this.__evaluate__();
  }

  getValue() {
    const circuitValue = this.__evaluate__();

    this.value = circuitValue;
    return circuitValue;
  }
}