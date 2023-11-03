class InputNode {
  static name = "input";
  name = "input";
  label = "";
  /** @type {0 | 1} */
  value = 0;
  location = { x: 200, y: 200 };
  /** @type {number} */
  _id;

  // Input node is the only one with no inputs

  // Not good names
  /** @type {(InputNode | OutputNode)[]} */
  outputs = [];

  constructor() {
    this._id = id;
    id++;
  }
  /**
   * @param {0 | 1} value 
   */
  updateNode(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  /** @param {...(OutputNode[])} outs */
  updateOutputs(...outs) {
    for (const out of outs)
      this.outputs.push(out);
  }

}