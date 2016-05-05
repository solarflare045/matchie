var _ = require('lodash');
var pjson = require('./package.json');
var semver = require('semver');

module.exports = function(matchie) {
  matchie.serialize = function(obj) {
    function _serialize_(obj) {
      if (matchie.is.function(obj)) {
        if (!obj.path) {
          throw new Error('Cannot serialize as it contains an unsafe function!');
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
      v: pjson.version,
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
        var func = _.get(matchie, obj.path);

        if (!obj.arguments) {
          return func;
        }
        return func.apply(undefined, _.map(obj.arguments, _deserialize_));

      } else {
        throw new Error('Unknown value type "' + obj.type + '"');

      }
    }

    var obj = JSON.parse(str);

    if (!semver.satisfies(obj.v, '^1.0.0')) {
      throw new Error('Matchie object serialized with a significantly later version!');
    }
    return _deserialize_(obj.o);
  };
};
