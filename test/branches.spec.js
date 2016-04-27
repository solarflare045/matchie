var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('.and()', function() {
    var and = matchie.and(_.constant(true), _.identity, _.constant(true));

    it('should return TRUE if every predicate returns a truthy value', function() {
      expect(and(2)).to.equal(true);
    });

    it('should return FALSE if any predicate returns a falsy value', function() {
      expect(and(0)).to.equal(false);
    });

    it('should accept a matchie-style match', function() {
      expect(matchie.and(2, _.constant(true))(2)).to.equal(true);
      expect(matchie.and(3, _.constant(true))(2)).to.equal(false);
      expect(matchie.and(2, _.constant(false))(2)).to.equal(false);
    });
  });

  describe('.or()', function() {
    var or = matchie.or(_.constant(false), _.identity, _.constant(false));

    it('should return TRUE if any predicate returns a truthy value', function() {
      expect(or(2)).to.equal(true);
    });

    it('should return FALSE if every predicate returns a falsy value', function() {
      expect(or(0)).to.equal(false);
    });

    it('should accept a matchie-style match', function() {
      expect(matchie.or(2, _.constant(false))(2)).to.equal(true);
      expect(matchie.or(3, _.constant(true))(2)).to.equal(true);
      expect(matchie.or(3, _.constant(false))(2)).to.equal(false);
    });
  });

  describe('.maybe()', function() {
    var maybe = matchie.maybe(2);

    it('should return TRUE if the value provided is undefined', function() {
      expect(maybe(undefined)).to.equal(true);
    });

    it('should return TRUE if the value provided matches the predicate', function() {
      expect(maybe(2)).to.equal(true);
    });

    it('should return FALSE if the value provided is not undefined and does not match the predicate', function() {
      expect(maybe(3)).to.equal(false);
    });
  });

  describe('.not()', function() {
    it('should act as a negator for a predicate', function() {
      expect(matchie.not(_.constant(false))(5)).to.equal(true);
      expect(matchie.not(_.constant(true))(7)).to.equal(false);
    });

    it('should act as a not-equal function', function() {
      expect(matchie.not(6)(6)).to.equal(false);
      expect(matchie.not(6)(5)).to.equal(true);
    });

    it('should chain nicely with the simple predicates', function() {
      var notANumber = matchie.not(matchie.is.number);
      expect(notANumber('Frank')).to.equal(true);
      expect(notANumber(6)).to.equal(false);
    });
  });

  describe('.none()', function() {
    var none = matchie.none(matchie.is.number, matchie.is.array, matchie.is.string);
    it('should return TRUE if all of the predicates returns falsey', function() {
      expect(none(/Reg/)).to.equal(true);
      expect(none({})).to.equal(true);
    });

    it('should return FALSE if any of the predicates returns true', function() {
      expect(none(6)).to.equal(false);
      expect(none([])).to.equal(false);
      expect(none('Frank')).to.equal(false);
    });
  });

  describe('.xor()', function() {
    var xor = matchie.xor(/ran/, matchie.hasProperty('length', 5), /\d/);
    it('should return FALSE if no predicate returns truthy', function() {
      expect(xor('Rich')).to.equal(false);
    });

    it('should return TRUE if exactly one predicate returns truthy', function() {
      expect(xor('Fran')).to.equal(true);
      expect(xor('Bingo')).to.equal(true);
      expect(xor('123')).to.equal(true);
    });

    it('should return FALSE if more than one predicate returns truthy', function() {
      expect(xor('Frank')).to.equal(false);
      expect(xor('12345')).to.equal(false);
      expect(xor('9ran')).to.equal(false);
      expect(xor('9ran9')).to.equal(false);
    });
  });
});
