function mergeSort(array) {
  var merge = function (left, right) {
    var total = []
    while (left.length && right.length)
      total.push(left[0] <= right[0] ? left.shift() : right.shift())
    return total.concat(left.concat(right));
  }

  var length = array.length;
  if (length < 2) return array
  var left = array.slice(0, parseInt(length / 2));
  var right = array.slice(parseInt(length / 2));

  return merge(mergeSort(left), mergeSort(right));
}

var array = [121,65,12,2,1,6,56,3,54,4]

var array1 = mergeSort(array)

console.log(array1)


Array.prototype.merge_sort = function() {
	var merge = function(left, right) {
		var final = [];
		while (left.length && right.length)
			final.push(left[0] <= right[0] ? left.shift() : right.shift());
		return final.concat(left.concat(right));
	};
	var len = this.length;
	if (len < 2) return this;
	var mid = len / 2;
	return merge(this.slice(0, parseInt(mid)).merge_sort(), this.slice(parseInt(mid)).merge_sort());
};