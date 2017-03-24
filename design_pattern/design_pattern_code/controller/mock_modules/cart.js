function Cart(EE) {
  var items = [];

  this.getItems = function () {
    return items;
  }
  this.addItem = function (item) {
    items.push(item);
    EE.emit('itemadd', item);
  }
}

function CartController(cart, EE) {
  EE.addListener('itemadd', function (item) {
    console.log(item.getDescription() + '被添加到了当前购物栏')
    //todo 界面添加item。
  })
  EE.addListener('productSelected', function (product) {
    cart.addItem(product);
  })
}

module.exports = {
  Cart: Cart,
  CartController: CartController
}
