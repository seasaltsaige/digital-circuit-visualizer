class CustomCircuitBuilder {
  inputs;
  outputs;
  name;
  builder = true;
  constructor(inputs, outputs, name) {
    this.inputs = inputs;
    this.outputs = outputs;
    this.name = name;
  }

  build() {
    return new CustomCircuit(this.inputs, this.outputs, this.name);
  }
}