class XOR extends Circuit {
  static name = "XOR";
  name = "XOR";

  // seemingly weird xor behavior with multiple outputs

  constructor() {
    super();
  }

  __evaluate__() {
    if (this.inputs.length < 2) return 0;
    const vals = this.inputs.map(n => n.getValue());
    const num_ones = vals.filter(v => v === 1);
    if (num_ones.length === 1) return 1;
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
    for (const out of this.outputs) {
      // out.updateNode(circuitValue);
    }
    this.value = circuitValue;

    console.log(this.value, circuitValue);
    return circuitValue;
  }
}