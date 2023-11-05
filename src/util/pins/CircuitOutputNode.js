class CircuitOutputNode extends OutputNode {
  // Output TO
  outputs = [];
  /** @type {Circuit} */
  parent = null;
  name = "circuit_output";

  constructor(parent) {
    super();
    this.parent = parent;
    this.label = null;
  }

  updateOutputs(...outs) {
    this.outputs.push(...outs);
  }

  getValue() {
    const val = this.parent.getValue();
    this.value = val;
    return val;
  }
}
