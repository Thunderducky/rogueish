// NOTE: This class is used internally in pubsub and shouldn't be accessed directly

import Uid from '../utils/uid.js'

// We are adding the ability to do prioritization
// might make this TRUELY UNIVERSAAAAL
let _Uid = -1;
const newToken = () => {
  return Uid.nextId();
}

// A specific levels subscribers will always fire first, unless interrupted by a publishSync
// which allows for interrupts / extensions into other systems that can finish first
// even if needing to cross systems
// priorityFn
// (a,b)
// <0 a comes before b
// 0 a and b are equal
// >0 a comes after b
const makeLink = (fn, priority, next = null) => {
  return {id : newToken(), fn, priority, next}
};


class SubscriberList {
  constructor(){
    this.root = null;
    this.tail = null;
    this.length = 0;
  }
  // For now we just add priorities by number
  // lower priority runs first
  subscribe(fn, priority = 0){
    if(typeof fn !== "function"){
      throw new Error("")
    }
    // Case #1 Empty Subscriber List
    if(this.length === 0){
      this.root = makeLink(fn, priority);
      this.tail = this.root;
      this.length++;
      return this.root.id;
    }
    // Case #2 We already have some subscribers
    // If subscribers have the same priority, it's first come first serve
    else {
      // let's check if we need to be first

      let traveller = this.root;

      // SPECIAL CASE, priority is lower than root
      if(priority < traveller.priority){
        this.root = makeLink(fn, priority, this.root);
        this.length++;
        return this.root.id;
      }

      while(traveller && traveller.next && traveller.next.priority <= priority){
        traveller = traveller.next;
      }

      traveller.next = makeLink(fn, priority, traveller.next);
      // move the tail if we are at the end
      if(traveller === this.tail){
          this.tail = traveller.next;
      }

      this.length++;
      return traveller.next.id;
    }
  }

  subscribeOnce(fn, priority = 0){
    let id = this.subscribe((topic, message) => {
      fn(topic, message);
      this.unsubscribe(id);
    }, priority);
    return id;
  }

  unsubscribe(id){
    if(this.length === 0){
      return false;
    }

    // Case #1: We are removing the first element
    if(this.root.id === id){
      this.root = this.root.next;
      this.length--;
      if(this.length <= 1){
        this.tail = this.root;
      }
      return true;
    }

    // Case #2, we are moving a subsequent element

    // keep travelling until we hit an end condition
    let traveller = this.root;
    while(traveller && traveller.next && traveller.next.id !== id){
      traveller = traveller.next;
    }

    // Condition #1: We hit the end of the list
    if(!traveller.next){
      return false;
    }
    // Condition #2 We found our item somewhere in the list
    else {
      // Condition #2a, we are removing the tail, make sure to update the tail
      if(traveller.next === this.tail){
        this.tail = traveller;
      }
      // traveller.next is replace with the following entry
      traveller.next = traveller.next.next;
      this.length--;
      return true;
    }
  }

  notify(message, topic){
    let traveller = this.root;
    while(traveller != null){
      traveller.fn(message, topic); // potentially allow early cutoffs?
      traveller = traveller.next;
    }
  }

  // Don't know if this clears memory right, but I hope so
  clear(){
    this.root = null;
    this.tail = null;
    this.length = 0;
  }
}

export default SubscriberList;
