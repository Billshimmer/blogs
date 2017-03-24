var tree = {
}

tree.decorate = function () {
  console.log('show tree before decorate');
}

tree.getDecorate = function (decorate) {
  tree[decorate].prototype = this;
  return new tree[decorate];
}

tree.summer = function () {
  this.decorate = function () {
    this.summer.prototype.decorate();
    this.summer.color = 'red';
    console.log('tree in summer, color: ' + this.summer.color);
  }
}

tree.autumn = function () {
  this.decorate = function () {
    this.autumn.prototype.decorate();
    this.autumn.color = 'orange';
    console.log('tree in autumn, color: ' + this.autumn.color);
  }
}

tree.winter = function () {
  this.decorate = function () {
    this.winter.prototype.decorate();
    this.winter.color = 'grey';
    console.log('tree in winter, color: ' + this.winter.color);
  }
}

tree.spring = function () {
  this.decorate = function () {
    this.spring.prototype.decorate();
    this.spring.color = 'green';
    console.log('tree in spring, color: ' + this.spring.color);
  }
}

var a = new Object(tree);
a = a.getDecorate('spring');
a = a.getDecorate('summer');
a = a.getDecorate('autumn');
a = a.getDecorate('winter');
a.decorate();


/*
**
*/