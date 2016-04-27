var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('when comparing two objects', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie({
        a: 1,
        b: 2
      }, {
        b: 2,
        a: 1
      })).to.equal(true);
    });

    it('should return FALSE if properties are not the same', function() {
      expect(matchie({
        a: 1,
        b: 2
      }, {
        a: 3,
        b: 4
      })).to.equal(false);
    });

    it('should return FALSE if properties are missing from either side', function() {
      expect(matchie({
        a: 1
      }, {
        a: 1,
        b: 2
      })).to.equal(false);

      expect(matchie({
        a: 1,
        b: 2
      }, {
        a: 1
      })).to.equal(false);
    });

    it('should perform a deep comparison', function() {
      expect(matchie({
        a: {
          b: 2
        }
      }, {
        a: {
          b: 2
        }
      })).to.equal(true);

      expect(matchie({
        a: {
          b: 2
        }
      }, {
        a: {
          b: 2,
          c: 3
        }
      })).to.equal(false);
    });

    it('should accept predicates', function() {
      expect(matchie({
        a: 1,
        b: {
          c: 2
        },
        d: {
          e: 5
        }
      }, {
        a: matchie.is.number,
        b: matchie.hasProperty('c', 2),
        d: matchie.is.object
      })).to.equal(true);

      expect(matchie({
        a: 1,
        b: {
          c: 'Frank'
        }
      }, {
        a: matchie.is.string, // Is actually a number :-)
        b: matchie.is.object
      })).to.equal(false);
    });
  });

  describe('.partial()', function() {
    it('should return TRUE if both objects have the same properties', function() {
      expect(matchie.partial({
        a: 1,
        b: 2
      })({
        a: 1,
        b: 2
      })).to.equal(true);
    });

    it('should return FALSE if they do not match', function() {
      expect(matchie.partial({
        a: 1,
        b: 2
      })({
        a: 3,
        b: 4
      })).to.equal(false);
    });

    it('should return TRUE if there are missing properties from the value', function() {
      expect(matchie.partial({
        a: 1
      })({
        a: 1,
        b: 2
      })).to.equal(true);
    });

    it('should return FALSE if there are missing properties from the predicate', function() {
      expect(matchie.partial({
        a: 1,
        b: 2
      })({
        a: 1
      })).to.equal(false);
    });

    it('should require partial() to be reapplied at each new Object depth level', function() {
      expect(matchie.partial({
        a: {
          b: 2
        }
      })({
        a: {
          b: 2,
          c: 3
        },
        d: 4
      })).to.equal(false);

      expect(matchie.partial({
        a: matchie.partial({
          b: 2
        })
      })({
        a: {
          b: 2,
          c: 3
        },
        d: 4
      })).to.equal(true);
    });
  });

  describe('.hasProperty()', function() {
    var hasLengthTwo = matchie.hasProperty('length', 2);
    it('should return TRUE if the provided object has a property with that value', function() {
      expect(matchie({length: 2, height: 3}, hasLengthTwo)).to.equal(true);
      expect(matchie({health: 100, mana: 75}, hasLengthTwo)).to.equal(false);
      expect(matchie([1, 2], hasLengthTwo)).to.equal(true);
    });

    it('should handle comparing NULL safely', function() {
      expect(matchie(null, hasLengthTwo)).to.equal(false);
    });

    it('should handle comparing UNDEFINED safely', function() {
      expect(matchie(undefined, hasLengthTwo)).to.equal(false);
    });
  });
});
