var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('when transfering matchie objects', function() {
    it('should serialize and deserialize correctly', function() {
      var base = matchie.or(
        matchie.between(1, 3),
        matchie.between(6, 8),
        matchie.in([4, {
          a: matchie.is.integer
        }]),
        matchie.contains(matchie.is.string)
      );
      var serialized = matchie.serialize(base);
      var match = matchie.deserialize(serialized);

      expect(JSON.parse(serialized).o).to.deep.equal({
        type: 'function',
        path: 'or',
        arguments: [{
          type: 'function',
          path: 'between',
          arguments: [1, 3]
        }, {
          type: 'function',
          path: 'between',
          arguments: [6, 8]
        }, {
          type: 'function',
          path: 'in',
          arguments: [{
            type: 'array',
            value: [4, {
              type: 'object',
              value: {
                a: {
                  type: 'function',
                  path: 'is.integer',
                }
              }
            }]
          }]
        }, {
          type: 'function',
          path: 'contains',
          arguments: [{
            type: 'function',
            path: 'is.string'
          }]
        }]
      });

      expect(matchie(1, match)).to.equal(true);
      expect(matchie(2, match)).to.equal(true);
      expect(matchie(3, match)).to.equal(false);
      expect(matchie(4, match)).to.equal(true);
      expect(matchie(5, match)).to.equal(false);
      expect(matchie(6, match)).to.equal(true);
      expect(matchie(7, match)).to.equal(true);
      expect(matchie(8, match)).to.equal(false);

      expect(matchie(_.set({}, 'a', 3), match)).to.equal(true);
      expect(matchie(_.set({}, 'a', 3.5), match)).to.equal(false);

      expect(matchie([111], match)).to.equal(false);
      expect(matchie(['abc'], match)).to.equal(true);
    });

    it('should not serialize anything that contians an unsafe function', function() {
      var base = {
        a: function() {
          return true;
        }
      };

      expect(matchie.serialize.bind(matchie, base)).to.throw(/unsafe function/);
    });

    it('should not be able to deserialize an unknown object type', function() {
      var str = JSON.stringify({
        v: '1.0.0',
        o: {
          type: 'frank',
          value: 5
        }
      });

      expect(matchie.deserialize.bind(matchie, str)).to.throw(/unknown value type/i);
    });

    it('should not deserialize anything that contains a later major version', function() {
      var str = JSON.stringify({
        v: '2.0.0',
        o: {}
      });

      expect(matchie.deserialize.bind(matchie, str)).to.throw(/later version/);
    });
  });
});
