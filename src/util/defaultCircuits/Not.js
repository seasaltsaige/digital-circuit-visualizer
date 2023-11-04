class NOT extends Circuit {
  static name = "NOT";
  name = "NOT";

  constructor() {
    super();
  }

  /** 
   * @param {...(InputNode | OutputNode)} val 
   */
  updateInputs(...inps) {
    for (const inp of inps) {
      if (this.inputs.length === 1)
        this.inputs.splice(0, 1);

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

  __evaluate__() {
    const vals = this.inputs.map(v => v.getValue());
    if (vals.includes(1)) return 0;
    else return 1;
    // this.outputs[0].updateNode(this.inputs[0].value === 0 ? 1 : 0);
  }
}