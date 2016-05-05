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
  var bRest = _.tail(b);

  var aIndexes = _.chain(a)
    .map(function(o, i) {
      return matchie(o, bFirst) ? i : -1;
    })
    .without(-1)
    .value();

  if (!aIndexes.length)
    return false;

  return _.some(aIndexes, function(index) {
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
  return _.every(_.keys(b), function(key) {
    return matchie(a[key], b[key]);
  });
}

function objectMatch(a, b) {
  if (!objectMatchPartial(a, b))
    return false;

  return _.every(_.keys(a), function(key) {
    return _.isUndefined(a[key]) || !_.isUndefined(b[key]);
  });
}

function matchie(a, b) {
  if (isDirectlyComparible(a) && isDirectlyComparible(b))
    return a === b;

  if (_.isFunction(b))
    return !!b(a);

  if (_.isRegExp(b))
    return isDirectlyComparible(a) && !!a.toString().match(b);

  if (_.isArray(a) && _.isArray(b))
    return !!arrayMatch(a, b);

  if (_.isObject(a) && _.isObject(b))
    return !!objectMatch(a, b);

  return false;
}

function buildCallback(name, args, func) {
  return _.extend(func, {
    path: name,
    args: args
  });
}

function buildUnsharableCallback(func) {
  return _.extend(func, {
    unsharable: true
  });
}

function buildLodash(name, func) {
  return _.extend(func, {
    path: 'is.' + name,
    args: null
  });
}

matchie.and = matchie.all = function() {
  var args = arguments;
  return buildCallback('and', arguments, function(val) {
    return _.every(args, function(arg) {
      return matchie(val, arg);
    });
  });
};

matchie.between = function(a, b) {
  return buildCallback('between', arguments, function(val) {
    return val >= a && val < b;
  });
};

matchie.contains = function(str) {
  return buildCallback('contains', arguments, function(val) {
    if (_.isString(val) && _.isString(str)) {
      return val.indexOf(str) >= 0;
    } else if (_.isArray(val)) {
      return _.some(val, function(i) {
        return matchie(i, str);
      });
    }
    return false;
  });
};

matchie.equals = function(obj) {
  return buildCallback('equals', arguments, function(val) {
    return val == obj;
  });
};

matchie.gt = function(num) {
  return buildCallback('gt', arguments, function(val) {
    return val > num;
  });
};

matchie.gte = function(num) {
  return buildCallback('gte', arguments, function(val) {
    return val >= num;
  });
};

matchie.hasProperty = function(key, value) {
  return buildCallback('hasProperty', arguments, function(val) {
    return !_.isUndefined(val) && !_.isNull(val) && matchie(val[key], value);
  });
};

matchie.in = function(arr) {
  return buildCallback('in', arguments, function(val) {
    return _.some(arr, function(i) {
      return matchie(val, i);
    });
  });
};

matchie.instanceOf = function(cls) {
  return buildUnsharableCallback(function(val) {
    return val instanceof cls;
  });
};

matchie.lt = function(num) {
  return buildCallback('lt', arguments, function(val) {
    return val < num;
  });
};

matchie.lte = function(num) {
  return buildCallback('lte', arguments, function(val) {
    return val <= num;
  });
};

matchie.maybe = function(val) {
  return matchie.or(matchie.is.undefined, val);
};

matchie.none = function() {
  var args = arguments;
  return buildCallback('none', arguments, function(val) {
    return !_.some(args, function(arg) {
      return matchie(val, arg);
    });
  });
};

matchie.not = function(pre) {
  return buildCallback('not', arguments, function(val) {
    return !matchie(val, pre);
  });
};

matchie.or = function() {
  var args = arguments;
  return buildCallback('or', arguments, function(val) {
    return _.some(args, function(arg) {
      return matchie(val, arg);
    });
  });
};

matchie.outside = function(a, b) {
  return matchie.not(matchie.between(a, b));
};

matchie.partial = matchie.has = function(obj) {
  return buildCallback('partial', arguments, function(val) {
    if (_.isArray(obj) && _.isArray(val))
      return arrayMatchPartial(val, obj);

    if (_.isObject(obj) && _.isObject(val))
      return objectMatchPartial(val, obj);

    return false;
  });
};

matchie.same = function(obj) {
  return buildCallback('same', arguments, function(val) {
    return obj === val; // For reference checking.
  });
};

matchie.typeOf = function(type) {
  return buildCallback('typeOf', arguments, function(val) {
    return typeof val === type;
  });
};

matchie.unordered = function(obj) {
  return buildCallback('unordered', arguments, function(val) {
    if (_.isArray(obj) && _.isArray(val))
      return arrayMatchUnderordered(val, obj);

    return false;
  });
};

matchie.xor = matchie.one = matchie.single = function() {
  var args = arguments;
  return buildCallback('xor', arguments, function(val) {
    var count = 0;
    _.each(args, function(arg) {
      if (matchie(val, arg))
        count++;
      return count < 2;
    });
    return count === 1;
  });
};

matchie.is = {
  array: buildLodash('array', _.isArray),
  boolean: buildLodash('boolean', _.isBoolean),
  date: buildLodash('date', _.isDate),
  element: buildLodash('element', _.isElement),
  empty: buildLodash('empty', _.isEmpty),
  error: buildLodash('error', _.isError),
  finite: buildLodash('finite', _.isFinite),
  function: buildLodash('function', _.isFunction),
  integer: buildLodash('integer', _.isInteger),
  nan: buildLodash('nan',  _.isNaN),
  native: buildLodash('native', _.isNative),
  nil: buildLodash('nil', _.isNil),
  null: buildLodash('null', _.isNull),
  number: buildLodash('number', _.isNumber),
  object: buildLodash('object', _.isObject),
  plainObject: buildLodash('plainObject', _.isPlainObject),
  regExp: buildLodash('regExp', _.isRegExp),
  string: buildLodash('string', _.isString),
  typedArray: buildLodash('typedArray', _.isTypedArray),
  undefined: buildLodash('undefined', _.isUndefined),
};

module.exports = matchie;
require('./transfer.js')(matchie);
