class NOT extends Circuit {
  static name = "NOT";
  name = "NOT";
  /**
   * @type {InputNode[]}
   */
  inputs = [
    new InputNode(),
  ];

  /** @type {OutputNode[]} */
  outputs = [];


  // connections = [];

  constructor() {
    super();
    this.inputs.push(new InputNode());
    this.outputs.push(new OutputNode());
  }

  /** 
   * @param {number} val 
   */
  updateInputs(val) {
    this.inputs[0].updateNode(val);
    this.__evaluate__();
  }

  __evaluate__() {
    this.outputs[0].updateNode(this.inputs[0].value === 0 ? 1 : 0);
  }
}