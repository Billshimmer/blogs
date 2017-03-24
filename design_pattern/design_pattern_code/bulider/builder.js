var dom = {};

dom.link = function (name, type) {
  var dom = {
    name: name || "linkDom",
    type: type || "dom",
  };
  return dom;
}

dom.text = function (name, type) {
  var dom = {
    name: name || "textDom",
    type: type || "dom",
  };
  return dom;
}

dom.factory = function (type) {
  return new dom[type]();
}

var a = dom.factory("text");
var b = dom.factory("link");
console.log(a);
console.log(b);
