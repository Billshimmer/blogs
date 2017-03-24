var MenuComponent = function () {

}
MenuComponent.prototype.getName = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.getDescription = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.getPrice = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.isVegetarian = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.print = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.add = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.remove = function () {
  throw new Error("该方法必须重写");
};
MenuComponent.prototype.getChild = function () {
  throw new Error("该方法必须重写");
};

var MenuItem = function (name, description, vergetarian, price) {
  MenuComponent.apply(this);
  this.name = name;
  this.description = description;
  this.vergetarian = vergetarian;
  this.price = price;
}

MenuItem.prototype = new MenuComponent();
MenuItem.prototype.getName = function() {
  return this.name;
}
MenuItem.prototype.getDescription = function() {
  return this.description;
}
MenuItem.prototype.getPrice = function() {
  return this.price;
}
MenuItem.prototype.isVegetarian = function() {
  return this.vergetarian;
}
MenuItem.prototype.print = function () {
    console.log(this.getName() + ": " + this.getDescription() + ", " + this.getPrice() + "euros");
};

var Menu = function(name, description) {
  MenuComponent.apply(this);
  this.menuComponents = [];
  this.name = name;
  this.description = description;
  this.createIterator = function() {
    throw new Error("this method must be overWritten!");
  }
}

Menu.prototype = new MenuComponent();
Menu.prototype.add = function(menuItem) {
  this.menuComponents.push(menuItem);
}
Menu.prototype.remove = function(menuItem) {
  var newItems = [];
  this.menuComponents = this.menuComponents.filter(function(item, index) {
    if(item == menuItem){
      return false;
    }else{
      return true;
    }
  })
  return this.menuComponents;
}
Menu.prototype.print = function() {
  console.log(this.getName() + ": " + this.getDescription());
}
