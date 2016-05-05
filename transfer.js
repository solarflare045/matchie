var _ = require('lodash');
var semver = require('semver');

var CURRENT_SERIALIZATION_VERSION = '2.0.0';
var SAFE_SERIALIZATION_MASK = '<3.0.0';

module.exports = function(matchie) {
  matchie.serialize = function(obj) {
    function _serialize_(obj) {
      if (matchie.is.function(obj)) {
        if (!obj.path) {
          throw new Error('Cannot serialize as it contains an unsafe function.');
        }
        return {
          type: 'function',
          path: obj.path,
          arguments: obj.args ? _.map(obj.args, _serialize_) : undefined
        };

      } else if (matchie.is.array(obj)) {
        return {
          type: 'array',
          value: _.map(obj, _serialize_)
        };

      } else if (matchie.is.object(obj)) {
        return {
          type: 'object',
          value: _.mapValues(obj, _serialize_)
        };

      } else {
        return obj;

      }
    }

    return JSON.stringify({
      v: CURRENT_SERIALIZATION_VERSION,
      o: _serialize_(obj)
    });
  };

  matchie.deserialize = function(str) {
    function _deserialize_(obj) {
      if (!matchie.is.object(obj)) {
        return obj;

      } else if (obj.type === 'object') {
        return _.mapValues(obj.value, _deserialize_);

      } else if (obj.type === 'array') {
        return _.map(obj.value, _deserialize_);

      } else if (obj.type === 'function') {
        if (!_.has(matchie, obj.path))
          throw new Error('The function path ' + obj.path + ' does not exist.');

        var func = _.get(matchie, obj.path);
        if (!_.isFunction(func))
          throw new Error('The function path ' + obj.path + ' is not a function.');

        if (!obj.arguments)
          return func;

        return func.apply(undefined, _.map(obj.arguments, _deserialize_));

      } else {
        throw new Error('Unknown value type "' + obj.type + '"');

      }
    }

    var obj = JSON.parse(str);

    if (!semver.satisfies(obj.v, SAFE_SERIALIZATION_MASK)) {
      throw new Error('Matchie object serialized with an unsupported version.');
    }
    return _deserialize_(obj.o);
  };
};
