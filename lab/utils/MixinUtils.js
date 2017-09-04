'use strict';

// function defineProperties(target, props) {
//     for (var i = 0; i < props.length; i++) {
//         var descriptor = props[i];
//         descriptor.enumerable = descriptor.enumerable || false;
//         descriptor.configurable = true;
//         if ("value" in descriptor) descriptor.writable = true;
//         Object.defineProperty(target, descriptor.key, descriptor);
//     }
// }

//TODO
export function(Constructor) {
  let args = Array.prototype.slice.call(arguments);
  args[0] = Constructor.prototype;
  Object.assign.apply(args);
};
