var Promise = require("./promise.org.js")

var p = new Promise(function(resolve, reject){
  console.log(1);
  resolve(1);
});

p.then(function(data){
  console.log("%s from then", data);
  return data;
}).then(function(data){
  console.log("%s from next then", data);
  return data;
}).then(function(data){
  console.log("%s from other next then", data);
})
