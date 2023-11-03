class Circuit {
  static name = "";
  /** @type {InputNode[]} */
  inputs = [];
  // I don't like this but its the first thing i thought of
  /** @type {number[]} */
  connected_input_indecies = [];

  /** @type {OutputNode[]} */
  outputs = [];

  // probably used for custom circuits
  // jk LogicScreen will handle this
  // connections = [];

  location = { x: 0, y: 0 };

  constructor() { }

  /**
   * 
   * @param  {...number} inps 
   */
  updateInputs(...inps) {
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].updateNode(inps[i]);
    }
  }

  __evaluate__() {

  }

}