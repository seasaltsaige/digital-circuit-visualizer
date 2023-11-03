/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#2b2b2b";
ctx.fillRect(0, 0, canvas.width, canvas.height);


const lScreen = new LogicScreen(ctx);
const tool = new Toolbar();

// 

