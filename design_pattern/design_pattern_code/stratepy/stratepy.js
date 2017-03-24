var validator = {
  types: {},
  messages: [],
  config: {},
  validate: function(data){
    var i, msg, type, checker, checker_result;
    for (i in data) {
      if (data.hasOwnProperty(i)) {
        type = this.config[i];
        checker = this.types[type];
        if(!type) {
          continue;
        }
        if(!checker){
          console.log("no such validator " +type+ " will check this arg");
          continue;
        }
        checker_result = checker.validate(data[i]);
        if(!checker_result){
          msg = "Invalid value for " + i + ", " + checker.infoMsg;
          this.messages.push(msg);
        }
      }
    }
  },
  hasErrors: function(){
    return this.messages.length !== 0;
  }
}



var data = {
  name:  "shimmer",
  age: 24,
  job: ["writer", "coder"],
  income: 1,
  wife: {
    name: "nickname",
    income: 2,
  }
}

validator.config = {
  name: "string",
  age: "number",
  job: "array",
  income: "number",
  wife: "object",
}

validator.types.string = {
  validate: function(value){
    return typeof value === "string";
  },
  infoMsg: "this arg should be string.",
}
validator.types.number = {
  validate: function(value){
    return typeof value === "number";
  },
  infoMsg: "this arg should be number",
}
validator.types.array = {
  validate: function(value){
    if(value instanceof Array && value.length){
      return true;
    } else {
      return false;
    }
  },
  infoMsg: "this arg should be array."
}
validator.types.object = {
  validate: function(value){
    if( value instanceof Object){
      return true;
    } else {
      return false;
    }
  },
  infoMsg: "this arg should be Object"
}


validator.validate(data);

if(validator.hasErrors()){
  console.log(validator.messages.join("\n"));
} else {
  console.log("all right!");
}
