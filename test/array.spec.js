var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../index');
var expect = chai.expect;

describe('matchie()', function() {
  describe('when comparing two arrays', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie([1, 2, 3], [1, 2, 3])).to.equal(true);
    });

    it('should return FALSE if the order is wrong', function() {
      expect(matchie([1, 2, 3], [1, 3, 2])).to.equal(false);
    });

    it('should return FALSE if the length does not match', function() {
      expect(matchie([1, 2], [1, 2, 3])).to.equal(false);
    });

    it('should perform a deep comparison', function() {
      expect(matchie([1, [2, 3]], [1, [2, 3]])).to.equal(true);
      expect(matchie([1, [2, 3]], [1, 2, 3])).to.equal(false);
    });

    it('should allow predicates Inception', function() {
      expect(matchie([1, ['Frank', {}], [3]], [matchie.is.number, [matchie.is.string, matchie.is.object], matchie.is.array])).to.equal(true);
      expect(matchie([1, ['Frank', {}], [3]], [matchie.is.string, matchie.is.object, matchie.is.array])).to.equal(false);
    });
  });

  describe('when using .partial()', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie.partial([1, 2])([1, 2])).to.equal(true);
    });

    it('should return TRUE if there are values missing from the predicate input', function() {
      expect(matchie.partial([1, 2, 3])([4, 3, 2, 1])).to.equal(true);
    });

    it('should return FALSE if there are values missing', function() {
      expect(matchie.partial([1, 2, 3, 4])([1, 3, 2])).to.equal(false);
    });

    it('should not allow the same predicate index to match multiple value indexes', function() {
      var twoStrings = matchie.partial([matchie.is.string, matchie.is.string]);
      expect(matchie(['Frank', 3, 5], twoStrings)).to.equal(false);
      expect(matchie([3, 'Max', 'Frank'], twoStrings)).to.equal(true);
    });
  });

  describe('when using .unordered()', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie.unordered([1, 2])([1, 2])).to.equal(true);
    });

    it('should return FALSE if the array lengths do not match', function() {
      expect(matchie.unordered([1, 2])([3, 2, 1])).to.equal(false);
      expect(matchie.unordered([1, 2, 3])([2, 1])).to.equal(false);
    });

    it('should return TRUE if the order is wrong', function() {
      expect(matchie.unordered([1, 2, 3])([3, 2, 1])).to.equal(true);
    });

    it('should not allow the same predicate index to match multiple value indexes', function() {
      var twoStringsAndANumber = matchie.unordered([matchie.is.string, matchie.is.string, matchie.is.number]);
      expect(matchie(['Frank', 3, 'Max'], twoStringsAndANumber)).to.equal(true);
      expect(matchie([3, 2, 'String'], twoStringsAndANumber)).to.equal(false);
    });
  });
});
