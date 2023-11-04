class AND extends Circuit {
  static name = "AND";
  name = "AND";

  constructor() {
    super();
  }

  __evaluate__() {
    if (this.inputs.length < 2) return 0;
    const vals = this.inputs.map(n => n.getValue());
    if (vals.includes(0)) return 0;
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
    for (const out of this.outputs) {
      out.updateNode(circuitValue);
    }
    this.value = circuitValue;
    return circuitValue;
  }
}