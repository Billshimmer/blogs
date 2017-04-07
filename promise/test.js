var Promise = require("./promise.org.js")

// var p = new Promise(function(resolve, reject){
//   resolve(1);
// });

// p.then(function(data){
//   console.log("%s from then", data);
//   return data;
// }).then(function(data){
//   console.log("%s from next then", data);
//   return data;
// }).then(function(data){
//   console.log("%s from other next then", data);
// })

setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);