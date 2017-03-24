function Product(id,  description) {
  this.getId = function () {
    return id;
  }
  this.getDescription = function () {
    return description;
  }
}
function ProductPool() {
  var products = [new Product(1, '水果'), new Product(2, '蔬菜'), new Product(3, '干果')];
  this.getProducts = function(){
    return products;
  }
  this.removeProduct = function (product) {
    products = products.filter(function(item, index) {
      if(item.getId() == product.getId()){
        console.log('当前商品'+item.getDescription()+'被拿走了');
        return false;
      }else {
        return true;
      }
    })
  }
  this.choosedProduct = this.removeProduct;
}

function ProductController(pp, EE) {
  this.onProductSelected = function(product) {
    pp.removeProduct(product);
    EE.emit('productSelected', product);
  }
}

module.exports = {
  Product: Product,
  ProductPool: ProductPool,
  ProductController: ProductController
};
