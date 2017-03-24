function Event(name) {
  var handlers = [];

  this.getHandlers = function () {
    return handlers;
  }
  this.getName = function () {
    return name;
  }
  this.addHandler = function (handler) {
    handlers.push(handler);
  }

  this.removeHandler = function (handler) {
    for(var i = 0; i<handlers.length; i++){
      if(handlers[i] == handler){
        handlers.slice(i, 1);
      }
    }
  }

  this.fire = function (arg) {
    handlers.map(function (handler) {
      handler(arg);
    })
  }
}

function EventEmitter(){
  var Events = [];

  this.getEvents = function () {
    return Events;
  }
  function getEvent(name) {
    return Events.filter(function (Event) {
      return Event.getName() == name;
    })[0]
  }
  this.addListener = function (name, callback) {
    if( typeof name == 'string' && typeof callback == 'function'){
      var event = getEvent(name);
      if(!event){
        event = new Event(name);
        Events.push(event);
      }
      event.addHandler(callback);
    } else {
      throw "event listen arguments error";
    }
  }

  this.emit = function (name, arg) {
    Events.map(function (Event) {
      if (Event.getName() == name) {
        Event.fire(arg);
      }
    })
  }
  this.on = this.addListener;
}

module.exports = EventEmitter;
