let price = 2;
let quantity = 5;
let totalPrice = price * quantity;
let target = null;
let storage = [];

target = () => {total = price * quantity;}
function record() {storage.push(target);}
function replay() {storage.forEach(run => run())}

record();
target();
console.log(`total is ${total}`);
price = 20;
replay();
console.log(`total is ${total}`);
