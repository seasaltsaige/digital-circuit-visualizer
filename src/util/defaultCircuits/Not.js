class NOT extends Circuit {
  static name = "NOT";
  name = "NOT";

  inputs = [new CircuitInputNode()];
  outputs = [new CircuitOutputNode(this)];

  constructor() {
    super();
  }

  getValue() {
    const circuitValue = this.__evaluate__();
    this.value = circuitValue;
    return circuitValue;
  }

  __evaluate__() {
    this.inputs[0].getValue();

    if (this.inputs[0].value === 1) return 0;
    else return 1;
  }
}