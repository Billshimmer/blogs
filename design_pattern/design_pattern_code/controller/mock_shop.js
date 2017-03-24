var EventEmitter = require('./mock_modules/EventEmitter.js');
var {Cart, CartController} = require('./mock_modules/cart.js');
var {Product, ProductPool,ProductController} = require('./mock_modules/product.js');

var EE = new EventEmitter(),
    c = new Cart(EE),
    cc = new CartController(c, EE),
    p = new Product(),
    pp = new ProductPool(),
    pc = new ProductController(pp, EE);

pc.onProductSelected(new Product(1, '水果'));
console.log(pp.getProducts());
console.log(c.getItems());
pc.onProductSelected(new Product(2, '蔬菜'));
console.log(pp.getProducts());
console.log(c.getItems());
