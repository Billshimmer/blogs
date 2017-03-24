function ConcreateClass() {
  this.performTask = function () {
    this.preTask();
    console.log("some progress is loading!");
    this.doneTask();
  }
}

function AbstractConcreateClass(decorated) {
  this.performTask = function () {
    decorated.performTask();
  }
}

function ConcreateDecoratedClass(decorated) {
  this.base = AbstractConcreateClass;
  this.base(decorated);

  decorated.preTask = function () {
    console.log("before progress");
  }
  decorated.doneTask = function () {
    console.log("after progress");
  }
}

var a = new ConcreateClass();
var ConcreateDecoratedA = new ConcreateDecoratedClass(a);

ConcreateDecoratedA.performTask();
