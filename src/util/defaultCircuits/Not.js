class NOT extends Circuit {
  static name = "NOT";
  name = "NOT";

  inputs = [new CircuitInputNode()];
  outputs = [new CircuitOutputNode(this)];

  constructor() {
    super();
  }

  // /** 
  //  * @param {...(InputNode | OutputNode)} val 
  //  */
  // updateInputs(...inps) {
  //   for (const inp of inps) {
  //     if (this.inputs.length === 1)
  //       this.inputs.splice(0, 1);

  //     this.inputs.push(inp);
  //   }
  //   this.__evaluate__();
  // }

  getValue() {
    const circuitValue = this.__evaluate__();
    console.log(circuitValue, "not gate eval");
    this.value = circuitValue;
    return circuitValue;
  }

  __evaluate__() {
    this.inputs[0].getValue();

    if (this.inputs[0].value === 1) return 0;
    else return 1;
    // this.outputs[0].updateNode(this.inputs[0].value === 0 ? 1 : 0);
  }
}