class Circuit2 {
  inputs = [];
  /**
   * [
   * [ [AND_output] ]
   * ]
   */
  outputs = [];



}

/**
 * Renders a gate with n1 inputs and n2 outputs
  n1 = 8;
  n2 = 2;
  r = 5;
  d = 100;
  midY = 500;
  sep = (d-n1*r)/(n1+1);
  sep2 = (d-n2*r)/(n2+1);
  xPos = 700;
  nodeOffset = 15; 
  rectHeight = 40;
  rectWidth = 80;

  // input bar
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.moveTo(xPos, midY - (d/2));
  ctx.lineTo(xPos, midY + (d/2));
  ctx.stroke();
  ctx.closePath();
  // input nodes
  for (let i = 1; i <= n1; i++) {
    const yPos = (i * sep) + ((i - 1) * r) + midY - (d/2);
      // node
      ctx.beginPath();
      ctx.moveTo(xPos - nodeOffset, yPos);
      ctx.lineTo(xPos, yPos);
      ctx.stroke();
      ctx.closePath();
    // connecting wire to input bar
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(xPos - nodeOffset, yPos,r,0,Math.PI * 2);
    ctx.fill();
    ctx.closePath()
  }


  // output bar
xPos2 = xPos + nodeOffset*2 + rectWidth;
  ctx.beginPath();
  ctx.strokeStyle = "yellow";
  ctx.moveTo(xPos2, midY - (d/2));
  ctx.lineTo(xPos2, midY + (d/2));
  ctx.stroke();
  ctx.closePath();

// output nodes
for (let j = 1; j <= n2; j++) {
  const yPos = (j * sep2) + ((j - 1) * r) + midY - (d / 2);
  // 
  ctx.beginPath();
  ctx.moveTo(xPos2 + nodeOffset, yPos);
  ctx.lineTo(xPos2, yPos);
  ctx.stroke();
  ctx.closePath();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(xPos2 + nodeOffset, yPos, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

}
	
  // connect input bar to LG
  ctx.beginPath();
  ctx.moveTo(xPos, midY);
  ctx.lineTo(xPos + nodeOffset, midY);
  ctx.stroke();
  ctx.closePath();

  // connect output bar to LG
  ctx.beginPath();
  ctx.moveTo(xPos2, midY);
  ctx.lineTo(xPos2 - nodeOffset, midY);
  ctx.stroke();
  ctx.closePath();


  ctx.rect(xPos + nodeOffset, midY - (rectHeight/2), rectWidth, rectHeight);
  ctx.fillStyle = "#1c1c1c";
  ctx.strokeStyle = "orange";
  ctx.fill();
  ctx.stroke();
 */


class AND2 extends Circuit {
  static name = "AND2";
  name = "AND2";
  inputs = [
    new CircuitInputNode(), new CircuitInputNode(),
  ];

  /**  */
  outputs = [
    new CircuitOutputNode()
  ];
  constructor() {
    super();

    for (const inp of this.inputs)
      inp.r = 5;
  }

}