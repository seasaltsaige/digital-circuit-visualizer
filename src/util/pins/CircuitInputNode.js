class CircuitInputNode extends InputNode {
  /** @type {null | InputNode | CircuitOutputNode} */
  input = null;

  constructor() {
    super();
  }

  getValue() {
    this.input.getValue();
  }
}
