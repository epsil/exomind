/**
 * Stable sort, preserving the original order when possible.
 * @param {Array} arr - The array to sort.
 * @param {function} [fn] - A comparison function that returns
 * `-1` if the first argument scores less than the second argument,
 * `1` if the first argument scores more than the second argument,
 * and `0` if the scores are equal.
 * @return {Array} - The array, sorted.
 */
function sort(arr, fn) {
  const result = arr;
  const cmp = fn || sort.ascending();
  let i = 0;
  let pairs = arr.map(function(x) {
    return {
      idx: i++,
      val: x
    };
  });
  pairs = pairs.sort(function(a, b) {
    const x = cmp(a.val, b.val);
    if (x) {
      return x;
    }
    if (a.idx < b.idx) {
      return -1;
    }
    return a.idx > b.idx ? 1 : 0;
  });
  for (i = 0; i < arr.length; i++) {
    result[i] = pairs[i].val;
  }
  return result;
}

/**
 * Create an ascending comparison function.
 * @param {function} fn - A scoring function.
 * @return {function} - A comparison function that returns
 * `-1` if the first argument scores less than the second argument,
 * `1` if the first argument scores more than the second argument,
 * and `0` if the scores are equal.
 */
sort.ascending = function(fn) {
  return sort.comparator(function(x, y) {
    if (x < y) {
      return -1;
    }
    return x > y ? 1 : 0;
  }, fn);
};

/**
 * Create a descending comparison function.
 * @param {function} fn - A scoring function.
 * @return {function} - A comparison function that returns
 * `-1` if the first argument scores more than the second argument,
 * `1` if the first argument scores less than the second argument,
 * and `0` if the scores are equal.
 */
sort.descending = function(fn) {
  return sort.comparator(function(x, y) {
    if (x < y) {
      return 1;
    }
    return x > y ? -1 : 0;
  }, fn);
};

/**
 * Create a comparison function.
 * @param {function} cmp - A comparator function.
 * @param {function} [fn] - A scoring function.
 * @return {function} - A comparison function that returns
 * `-1`, `1` or `0` depending on its arguments' scoring values
 * and the intended order.
 */
sort.comparator = function(cmp, fn) {
  const score = fn || sort.identity;
  return function(a, b) {
    return cmp(score(a), score(b));
  };
};

/**
 * Combine comparison functions.
 * @param {...function} fn - A comparison function.
 * @return {function} - A combined comparison function that returns
 * the first comparison value unless the comparands are equal,
 * in which case it returns the next value.
 */
sort.combine = function(...args) {
  return args.reduce(function(fn1, fn2) {
    return function(a, b) {
      const val = fn1(a, b);
      return val === 0 ? fn2(a, b) : val;
    };
  });
};

/**
 * Identity function.
 * @param {object} x - A value.
 * @return {object} - The same value.
 */
sort.identity = function(x) {
  return x;
};

export default sort;
