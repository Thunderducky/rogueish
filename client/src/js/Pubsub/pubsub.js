// Inspired by https://github.com/mroderick/PubSubJS/blob/master/src/pubsub.js
// you should use this one instead, I'm adapting their design for my own education
import SubscriberList from './SubscriberList';
class PubSub {
  constructor(){
    this.topics = {};
  }
  publish(topic, message){ // we will keep doing this synchronously until we can't anymore :P
    // TODO: Add subtopics and specialized subscriptions
    if(!this.topics[topic]){
      this.topics[topic].notify(message, topic); // we flip this so that the handling is easier, for instance if we don't care about the topic
    }
  }
  subscribe(topic, fn, priority = 0){
    // check if it exists already
    if(!this.topics[topic]){ // if this doesn't already exist
      this.topics[topic] = new SubscriberList();
    }
    this.topics[topic].subscribe(topic, fn, priority);
  }
  subscribeOnce(topic, fn){
    if(!this.topics[topic]){ // if this doesn't already exist
      this.topics[topic] = new SubscriberList();
    }
    this.topics[topic].subscribeOnce(topic, fn, priority);
  }
  unsubscribe(topic, id){
    // Currently no error
    if(this.topics[topic]){
      this.topics[topic].unsubscribe(id);
    }
  }
  clearSubscriptions(topic){
    if(this.topics[topic]){
      this.topics[topic].clear();
    }
  }
}

export default PubSub
