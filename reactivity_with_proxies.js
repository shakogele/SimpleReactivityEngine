let data = {price: 2, quantity: 5};
let target, salePrice;
let total = 0

class Dep {
  constructor(){
    this.subscribers = [];
  }
  depend(){
    if(target && !this.subscribers.includes(target)){
      this.subscribers.push(target);
    }
  }
  notify(){
    this.subscribers.forEach(sub => sub());
  }
}

let deps = new Map();
const dep = new Dep();
//let internalVal = data.price;
Object.keys(data).forEach(key => {
    deps.set(key, new Dep());
})

let data_without_proxy = data;

data = new Proxy(data_without_proxy, {
  get(obj, key) {
    deps.get(key).depend();
    return obj[key];
  },
  set(obj, key, newVal) {
    obj[key] = newVal;
    deps.get(key).notify();
    return true;
  }
});

function watcher(myFunc){
  target = myFunc;
  dep.depend();
  target();
  target = null;
}

watcher(()=>{
  total = data.price * data.quantity;
})

data.price = 5;
console.log(total)
data.price = 20;
console.log(total)
data.quantity = 10;
console.log(total);

deps.set('discount_percent', new Dep());
watcher(()=>{
  total = (data.price - data.price * data.discount_percent * 0.01) * data.quantity;
})

data.discount_percent = 10;
console.log(total);
data.discount_percent = 20;
console.log(total);
