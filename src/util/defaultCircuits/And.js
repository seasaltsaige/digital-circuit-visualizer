class AND extends Circuit {
  static name = "AND";
  name = "AND";

  constructor() {
    super();
    this.inputs.push(new InputNode());
    this.inputs.push(new InputNode());

    this.outputs.push(new OutputNode());
  }

  __evaluate__() {
    const a = this.inputs[0];
    const b = this.inputs[1];
    if (a.value === 1 && b.value === 1) return this.outputs[0].updateNode(1);
    else return this.outputs[0].updateNode(0);
  }


  /** @param {...number} inps */
  updateInputs(...inps) {
    super.updateInputs(...inps);
    this.__evaluate__();
  }
  getOutput() {
    return this.outputs[0].output;
  }

}