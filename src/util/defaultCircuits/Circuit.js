class Circuit {
  static name = "";
  /** @type {(InputNode | OutputNode)[]} */
  inputs = [];
  // I don't like this but its the first thing i thought of
  /** @type {number[]} */
  connected_input_indecies = [];

  /** @type {(InputNode | OutputNode)[]} */
  outputs = [];

  value = 0;

  /** @type {number} */
  _id;

  // probably used for custom circuits
  // jk LogicScreen will handle this
  // connections = [];

  location = { x: 0, y: 0 };

  constructor() {
    this._id = id;
    id++;
  }

  /** @param {0 | 1} val  */
  updateNode(val) {
    this.value = val;
  }

  /**
   * 
   * @param  {...(InputNode | OutputNode)} inps 
   */
  updateInputs(...inps) {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].updateNode(inps[i]);
    }
  }

  /** @param {...(OutputNode[])} outs */
  updateOutputs(...outs) {
    for (const out of outs)
      this.outputs.push(out);
  }

  getValue() {

  }

  __evaluate__() {

  }

}