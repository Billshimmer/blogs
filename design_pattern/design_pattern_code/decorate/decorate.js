function Macbook() {
  this.hardOption = {};
  this.cost = function () {
    var total = 0;
    for (var i in this.hardOption) {
      if (this.hardOption.hasOwnProperty(i)) {
        total += this.hardOption[i].cost;
      }
    }
    return total || 1000;
  }
}

function addMemory(Macbook) {
  Macbook.hardOption["memory"] = {
    type: "memory",
    cost: 1000,
  }
}

function addInsurance(Macbook) {
  Macbook.hardOption["insurance"] = {
    type: "insurance",
    cost: 50,
  }
}

function addSsd(Macbook) {
  Macbook.hardOption["ssd"] = {
    type: "ssd",
    cost: 3000,
  }
}

var a = new Macbook();
console.log(a.cost());
addMemory(a);
addInsurance(a);
addSsd(a);
console.log(a.cost());
