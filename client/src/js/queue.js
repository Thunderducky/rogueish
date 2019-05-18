// should add a regular linked list implementation
// along with a doubly linked list

const makeLink = (data) => {
  return {
    data,
    next: null
  }
}


const make = (priorityFn) => {
  return {
    root:null,
    tail:null,
    length: 0,
    enqueue: function(data){

      if(!this.root){
        this.root = makeLink(data);
        this.tail = this.root;
      } else {
        const newLink = makeLink(data)
        if(priorityFn){
          if(priorityFn(this.root.data, newLink.data) < 0){ // if data should come first
            newLink.next = this.root;
            this.root = newLink
          } else {
            let last = this.root;
            let next = this.root.next;
            let done = false;
            while(!done){
              if(!next){  // if we run out
                last.next = newLink;
                done = true;
              } else {
                if(priorityFn(next.data, newLink.data) < 0){
                  done = true;
                  last.next = newLink;
                  newLink.next = next;
                } else {
                  last = last.next;
                  next = last.next;
                }
              }
            }
          }
          // check if we are the first
        } else {
          this.tail.next = newLink;
          this.tail = newLink;
        }

      }
      this.length++;
    },
    dequeue: function(){
      if(!this.root){
        return null;
      } else {
        this.length--;
        const toReturn = this.root.data;
        this.root = this.root.next;
        return toReturn;
      }
    }
  }

};
const defaultPrint = (a) => { return a.toString() }
const print = (queue, printFn = defaultPrint)  => {
  let member = queue.root;
  let str = "root->";
  while(member){
    str += printFn(member.data) + '->';
    member = member.next;
  }
  str += "end";
  console.log(str)
}

const each = (queue, fn) => {
  if(typeof fn !== "function"){
    throw new Error("Queue.each must be passed a function as it's second argument");
  }
  let traveller = queue.root;
  let index = 0;
  while(traveller != null){
    fn(traveller.data, index)
    index++;
    traveller = traveller.next;
  }
}

export default {
  make,
  each,
  print
}
