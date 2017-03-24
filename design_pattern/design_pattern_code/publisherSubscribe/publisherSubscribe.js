var pubsub = {};

(function (q) {
  var topics = {};

  q.publish = function(topic, args) {
    if(!topics[topic]){
      throw new Error("not exited topic");
      return false;
    }

    var sub = topics[topic];
    for (var i = 0; i < sub.length; i++) {
      sub[i](args);
    }
    return true;
  }

  q.subscribe = function(topic, callback) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    topics[topic].push(callback);
  }

  q.unsubscribe = function(topic) {
    if(!topics[topic]){
      return true;
    }

    delete topics[topic];
    console.log("topic %s unsubscribe");
  }
}(pubsub));

pubsub.subscribe("test", function(data) {
  console.log(data);
})
pubsub.subscribe("test", function(data) {
  console.log(data+" another one");
})

pubsub.publish("test", "apple");
pubsub.publish("test", "orange");

pubsub.unsubscribe("test");
