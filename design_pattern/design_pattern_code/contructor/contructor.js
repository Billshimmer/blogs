function Car(model, years, miles) {
  if(!(this instanceof Car)){
    return new Car(model, years, miles);
  }
  this.model = model || "car";
  this.years = years || 10;
  this.miles = miles || 0;
}

Car.prototype.output = function () {
  console.log("这辆车%s行驶了%s米",this.model,this.miles);
}


var C = new Car("BMW", 10, 20000);
C.output();
