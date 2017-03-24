function nameCreator(spec, my) {
    var that = {},
    fName = spec.firstName,
    lName = spec.lastName;

    if(typeof my.outputName !== 'function'){
      throw 'not implemented';
    }

    that.outputAll = function () {
      console.log("该人的昵称:" + my.outputName());
      console.log("姓:" + fName);
      console.log("名:" + lName);
    }

    return that;
}


function EnglishNameCreator(spec) {
    var that = {}, my = {};
    my.outputName = function () {
      return spec.firstName + spec.lastName;
    };

    that = nameCreator(spec, my);
    return that;
}

function ChineseNameCreator(spec) {
    var that = {}, my = {};
    my.outputName = function () {
      return spec.lastName + spec.firstName;
    };

    that = nameCreator(spec, my);
    return that;
}

var Names = [
  EnglishNameCreator({firstName: 'bill', lastName:'shimmer'}),
  ChineseNameCreator({firstName: 'bill', lastName:'shimmer'})
]
 for (var i = 0; i < Names.length; i++) {
   Names[i].outputAll();
 }
