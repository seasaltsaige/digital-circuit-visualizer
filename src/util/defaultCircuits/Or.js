class OR extends Circuit {
  static name = "OR";
  name = "OR";

  inputs = [new CircuitInputNode(), new CircuitInputNode()];
  outputs = [new CircuitOutputNode(this)];

  constructor() {
    super();
  }

  __evaluate__() {
    if (this.inputs.length < 2) return 0;
    const vals = this.inputs.map(n => n.getValue());
    // const num_ones = vals.filter(v => v === 1);
    if (vals.includes(1)) return 1;
    else return 0;
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