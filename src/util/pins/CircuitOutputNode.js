class CircuitOutputNode extends OutputNode {
  // Output TO
  outputs = [];
  /** @type {Circuit} */
  parent = null;
  name = "circuit_output";

  constructor(parent, label) {
    super();
    this.parent = parent;
    this.label = label;
  }

  updateOutputs(...outs) {
    this.outputs.push(...outs);
  }

  getValue() {
    const val = this.parent.getValue(this._id);
    this.value = val;
    return val;
  }
}
