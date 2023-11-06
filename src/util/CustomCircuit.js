class CustomCircuit extends Circuit {
  static name = "";

  /**
   * @type {CircuitInputNode[]}
   */
  inputs = [];

  /**
   * @type {CircuitOutputNode[]}
   */
  outputs = [];

  truth_table = [];

  input_map = new Map();

  constructor(inputs, outputs, name) {
    super();
    this.name = name;
    this.simulate(inputs, outputs);

    for (const _ of inputs) {
      const cin = new CircuitInputNode();
      this.inputs.push(cin);
    }

    for (const _ of outputs) {
      const cout = new CircuitOutputNode(this);
      this.outputs.push(cout);
    }

    for (let i = 0; i < this.truth_table.length; i++) {
      for (let j = 0; j < this.truth_table[i].length; j++) {
        let bin = i.toString(2);
        while (bin.length < inputs.length)
          bin = "0" + bin;

        bin += `_${j}`;
        this.input_map.set(bin, this.truth_table[i][j][1]);
      }
    }

  }

  __evaluate__(requester_id) {
    let result = "";
    for (const input of this.inputs) {
      result += input.getValue().toString();
    }

    const out_node = this.outputs.findIndex(v => v._id === requester_id);
    result += `_${out_node}`;

    const res = this.input_map.get(result);
    return res;

  }

  getValue(requester_id) {
    const circuitValue = this.__evaluate__(requester_id);
    this.value = circuitValue;
    return circuitValue;
  }



  simulate(inputs, outputs) {
    if (inputs.length < 1 || outputs.length < 1) return null;

    for (let i = 0; i < Math.pow(2, inputs.length); i++) {
      const bin = i.toString(2);
      const bits = [];
      for (const bit of bin) {
        const b = parseInt(bit);
        bits.push(b);
      }
      while (bits.length < inputs.length)
        bits.unshift(0);

      for (let i = 0; i < bits.length; i++) {
        inputs[i].updateNode(bits[i])
      }
      const results = [];
      for (const out of outputs) {
        out.evaluate();
        results.push([out.label, out.getValue()]);
      }
      this.truth_table.push(results);
    }
  }

}