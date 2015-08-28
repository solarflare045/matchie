var _ = require('lodash');

function isDirectlyComparible(x) {
  return !_.isObject(x) || _.isNull(x) || _.isUndefined(x);
}

function _arrayMatchPartial(a, b, full) {
  if (full && a.length !== b.length)
    return false;

  if (!b.length)
    return true;

  var bFirst = _.first(b);
  var bRest = _.rest(b);

  var aIndexes = _.chain(a)
    .map(function(o, i) {
      return matchie(o, bFirst) ? i : -1;
    })
    .without(-1)
    .value();

  if (!aIndexes.length)
    return false;

  return _.any(aIndexes, function(index) {
    var aWithout = _.filter(a, function(o, i) {
      return i !== index;
    });
    return _arrayMatchPartial(aWithout, bRest, full);
  });
}

function arrayMatchPartial(a, b) {
  return _arrayMatchPartial(a, b, false);
}

function arrayMatchUnderordered(a, b) {
  return _arrayMatchPartial(a, b, true);
}

function arrayMatch(a, b) {
  if (a.length !== b.length)
    return false;

  for (var i = 0, c = a.length; i < c; i++) {
    if (!matchie(a[i], b[i]))
      return false;
  }
  return true;
}

function objectMatchPartial(a, b) {
  var happy = true;
  _.forOwn(b, function(value, key) {
    return (happy = !!(happy && matchie(a[key], value)));
  });
  return happy;
}

function objectMatch(a, b) {
  if (!objectMatchPartial(a, b))
    return false;

  var happy = true;
  _.forOwn(a, function(value, key) {
    if (_.isUndefined(value))
      return true;
    return (happy = !!(happy && !_.isUndefined(b[key])));
  });
  return happy;
}

function matchie(a, b) {
  if (isDirectlyComparible(a) && isDirectlyComparible(b))
    return a === b;

  if (_.isFunction(b))
    return b(a);

  if (_.isRegExp(b))
    return isDirectlyComparible(a) && a.toString().match(b);

  if (_.isObject(a) && _.isObject(b))
    return objectMatch(a, b);

  if (_.isArray(a) && _.isArray(b))
    return arrayMatch(a, b);

  return false;
}

matchie.and = function() {
  var args = arguments;
  return function(val) {
    return _.all(args, function(arg) {
      return matchie(val, arg);
    });
  };
};

matchie.between = function(a, b) {
  return function(val) {
    return val >= a && val < b;
  };
};

matchie.contains = function(str) {
  return function(val) {
    return _.contains(val, str);
  };
};

matchie.equals = function(obj) {
  return function(val) {
    return val == obj;
  };
};

matchie.gt = function(num) {
  return function(val) {
    return val > num;
  };
};

matchie.gte = function(num) {
  return function(val) {
    return val >= num;
  };
};

matchie.hasProperty = function(key, value) {
  var obj = {};
  obj[key] = value;
  return matchie.partial(obj);
};

matchie.in = function(arr) {
  return function(val) {
    return _.contains(arr, val);
  };
};

matchie.instanceOf = function(cls) {
  return function(val) {
    return val instanceof cls;
  };
};

matchie.lt = function(num) {
  return function(val) {
    return val < num;
  };
};

matchie.lte = function(num) {
  return function(val) {
    return val <= num;
  };
};

matchie.maybe = function(val) {
  return matchie.or(matchie.is.undefined, val);
};

matchie.not = function(pre) {
  return function(val) {
    return !matchie(val, pre);
  };
};

matchie.or = function() {
  var args = arguments;
  return function(val) {
    return _.any(args, function(arg) {
      return matchie(val, arg);
    });
  };
};

matchie.outside = function(a, b) {
  return matchie.not(matchie.between(a, b));
};

matchie.partial = matchie.has = function(obj) {
  return function(val) {
    if (_.isArray(obj) && _.isArray(val))
      return arrayMatchPartial(val, obj);

    if (_.isObject(obj) && _.isObject(val))
      return objectMatchPartial(val, obj);

    return false;
  };
};

matchie.same = function(obj) {
  return function(val) {
    return obj === val; // For reference checking.
  };
};

matchie.typeOf = function(type) {
  return function(val) {
    return typeof val === type;
  };
};

matchie.unordered = function(obj) {
  return function(val) {
    if (_.isArray(obj) && _.isArray(val))
      return arrayMatchUnderordered(val, obj);

    return false;
  };
};

matchie.is = {
  array: _.isArray,
  boolean: _.isBoolean,
  date: _.isDate,
  element: _.isElement,
  empty: _.isEmpty,
  equal: _.isEqual,
  error: _.isError,
  finite: _.isFinite,
  function: _.isFunction,
  match: _.isMatch,
  nan: _.isNaN,
  native: _.isNative,
  null: _.isNull,
  number: _.isNumber,
  object: _.isObject,
  plainObject: _.isPlainObject,
  regExp: _.isRegExp,
  string: _.isString,
  typedArray: _.isTypedArray,
  undefined: _.isUndefined,
};

module.exports = matchie;
