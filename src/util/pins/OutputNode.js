class OutputNode {
  static name = "output";
  name = "output";
  label = "";
  /** @type {0 | 1} */
  output = 0;
  location = { x: 500, y: 200 };
  constructor() { }

  /** @param {0 | 1} value */
  updateNode(value) {
    this.output = value;
  }

  getValue() {
    return this.output;
  }
}