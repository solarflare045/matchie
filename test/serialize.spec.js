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
        matchie.between(6, 8)
      );
      var serialized = matchie.serialize(base);
      var match = matchie.deserialize(serialized);

      expect(JSON.parse(serialized).o).to.deep.equal({
        type: 'function',
        path: 'or',
        arguments: [
          {
            type: 'function',
            path: 'between',
            arguments: [1, 3]
          },
          {
            type: 'function',
            path: 'between',
            arguments: [6, 8]
          }
        ]
      });

      expect(matchie(1, match)).to.equal(true);
      expect(matchie(2, match)).to.equal(true);
      expect(matchie(3, match)).to.equal(false);
      expect(matchie(4, match)).to.equal(false);
      expect(matchie(5, match)).to.equal(false);
      expect(matchie(6, match)).to.equal(true);
      expect(matchie(7, match)).to.equal(true);
      expect(matchie(8, match)).to.equal(false);
    });
  });
});
