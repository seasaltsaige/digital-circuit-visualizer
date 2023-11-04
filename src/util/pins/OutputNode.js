class OutputNode {
  static name = "output";
  name = "output";
  label = "";
  /** @type {0 | 1} */
  output = 0;
  location = { x: 500, y: 200 };
  /**
   * @type {(InputNode | OutputNode)[]}
   */
  inputs = []
  /** @type {(InputNode | OutputNode)[]} */
  outputs = [];
  /** @type {number} */
  _id;
  /** @type {number} */
  value;
  constructor() {
    this._id = id;
    id++;
  }

  /** @param {0 | 1} value */
  updateNode(value) {
    this.value = value;
    this.output = value;
  }

  getValue() {
    return this.output;
  }

  evaluate() {
    const inputValues = [];
    for (const input of this.inputs) {
      inputValues.push(input.getValue())
    }
    if (inputValues.includes(1)) this.updateNode(1);
    else this.updateNode(0);
  }

  /** 
 * @param {...(InputNode | OutputNode)} val 
 */
  updateInputs(...inps) {
    for (const inp of inps) {
      this.inputs.push(inp);
    }
  }

  /** @param {...(OutputNode[])} outs */
  updateOutputs(...outs) {
    for (const out of outs)
      this.outputs.push(out);
  }
}