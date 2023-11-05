class CircuitInputNode extends InputNode {
  /** @type {null | InputNode | CircuitOutputNode} */
  input = null;
  /** @type {CircuitOutputNode | InputNode} */
  parent = null;
  name = "circuit_input";

  constructor() {
    super();
    this.label = null;
  }

  getValue() {
    const val = this.input.getValue();
    this.value = val;
    return val;
  }

  updateInputs(inp) {
    this.input = inp;
  }
}
