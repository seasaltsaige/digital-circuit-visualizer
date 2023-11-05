class Circuit {
  static name = "";
  /** @type {(CircuitInputNode)[]} */
  inputs = [];

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

  /** @returns {0 | 1} */
  getValue() {

  }

  __evaluate__() {

  }

}