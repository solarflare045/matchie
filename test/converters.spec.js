var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('with using as.integer()', function() {
    it('should convert the input to an integer', function() {
      expect(matchie(6.7, matchie.as.integer(6))).to.equal(true);
      expect(matchie(7.7, matchie.as.integer(6))).to.equal(false);
    });
  });

  describe('with using as.json()', function() {
    it('should convert the input from JSON to an Object', function() {
      var objA = '{"a": 1, "b": 2}';
      var objB = '{"a": 2, "b": 3}';
      var objI = '{haha: haha: lol}';

      var inner = matchie.has({a: 1});
      var matcher = matchie.as.json(inner);
      expect(matchie(objA, matcher)).to.equal(true);
      expect(matchie(objB, matcher)).to.equal(false);
      expect(matchie(objI, matcher)).to.equal(false);

      expect(matchie(objA, inner)).to.equal(false);
    });
  });

  describe('when using as.number()', function() {
    it('should convert the input to a number', function() {
      var inner = matchie.between('2', '4');
      var matcher = matchie.as.number(inner);

      expect(matchie('3', matcher)).to.equal(true);
      expect(matchie('33', matcher)).to.equal(false);
      expect(matchie('3', inner)).to.equal(true);
      expect(matchie('33', inner)).to.equal(true);

      expect(matchie('3', matchie.as.number(matchie.is.number))).to.equal(true);
    });
  });

  describe('when using as.string()', function() {
    it('should convert the input to a string', function() {
      expect(matchie(3, matchie.as.string(matchie.is.string))).to.equal(true);
      expect(matchie(3, matchie.is.string)).to.equal(false);
    });
  });
});
