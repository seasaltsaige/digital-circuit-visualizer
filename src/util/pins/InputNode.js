class InputNode {
  static name = "input";
  name = "input";
  label = "";
  /** @type {0 | 1} */
  value = 0;
  location = { x: 200, y: 200 }

  constructor() { }
  /**
   * @param {0 | 1} value 
   */
  updateNode(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

}