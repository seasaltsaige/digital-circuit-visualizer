class CircuitOutputNode extends OutputNode {
  // Output TO
  output = null;
  /** @type {Circuit} */
  circuitConnectedTo = null;

  constructor() {
    super();
  }

  getValue() {
    return this.circuitConnectedTo.getValue();
  }
}