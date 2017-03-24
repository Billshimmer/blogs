var Handler = function (s, data) {
  this.successor = s || null;
  this.data = data || {};
}

Handler.prototype.handler = function () {
  if(this.successor){
    this.successor.handler();
  }
}

var app = new Handler({
  handler: function () {
    console.log("app handler it");
  }
}, {name: "应用"});

var md = new Handler(app, {name: "模块"});
md.handler = function () {
  console.log(this.data.name + " hanlder it. ");
  Handler.prototype.handler.call(this);
}
var comp = new Handler(md, {name: "组件"});

comp.handler();
