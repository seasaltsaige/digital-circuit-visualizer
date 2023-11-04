// On hold for now, current logic makes this quite difficult to achieve
class CustomCircuit extends Circuit {
  static name = "";

  // All input nodes will go here
  inputs = [];

  // I will have to update this somehow
  outputs = [];

  truth_table = [];

  constructor(inputs, outputs) {
    super();
    this.simulate(inputs, outputs);
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


    // for (const out of outputs) {
    //   out.getValue();
    // }
  }

}