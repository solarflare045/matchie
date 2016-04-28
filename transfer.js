var _ = require('lodash');

module.exports = function(matchie) {
  matchie.serialize = function(obj) {
    function _serialize_(obj) {
      if (matchie.is.function(obj)) {
        if (!obj.path) {
          throw new Error('Cannot serialize arbitrary functions!');
        }
        return {
          type: 'function',
          path: obj.path,
          arguments: _.map(obj.args, _serialize_)
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

    return JSON.stringify(_serialize_(obj));
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

    return _deserialize_(JSON.parse(str));
  };
};
