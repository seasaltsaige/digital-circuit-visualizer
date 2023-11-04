let n = 7;
let counter = 0;
while (n !== 0) {
  n = n >> 1;
  counter += 1;
}

console.log(counter);