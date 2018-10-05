let data = {price: 2, quantity: 5};
let target, total, salePrice;

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
const dep = new Dep();
//let internalVal = data.price;
Object.keys(data).forEach(key => {
  let internalVal = data[key];
  const dep = new Dep();
  Object.defineProperty(data, key, {
      get(){
        console.log(`getting ${key}: ${internalVal}`);
        dep.depend();
        return internalVal;
      },
      set(newVal){
        console.log(`setting ${key}: ${newVal}`);
        dep.notify();
        internalVal = newVal;
      }
  })
})

function watcher(myFunc){
  target = myFunc;
  dep.depend();
  target();
  target = null;
}

watcher(()=>{
  total = data.price * data.quantity;
})

watcher(()=>{
  salePrice = data.price * 0.09;
})

data.price = 5;
data.price = 20;
console.log(data.quantity)
