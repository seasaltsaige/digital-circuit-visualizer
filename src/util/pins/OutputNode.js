class OutputNode {
  static name = "output";
  name = "output";
  label = "";

  location = { x: 500, y: 200 };
  /**
   * @type {(InputNode | OutputNode)[]}
   */
  inputs = []

  /** @type {number} */
  _id;
  /** @type {number} */
  value = 0;
  r = 13;
  constructor() {
    this._id = id;
    id++;
  }

  /** @param {0 | 1} value */
  updateNode(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  evaluate() {
    const inputValues = [];
    for (const input of this.inputs)
      inputValues.push(input.getValue())

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
}