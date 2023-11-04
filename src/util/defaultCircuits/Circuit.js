class Circuit {
  static name = "";
  /** @type {(CircuitInputNode)[]} */
  inputs = [];
  // I don't like this but its the first thing i thought of
  /** @type {number[]} */
  connected_input_indecies = [];

  /** @type {(CircuitOutputNode)[]} */
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

  getValue() {

  }

  __evaluate__() {

  }

}