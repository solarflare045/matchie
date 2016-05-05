var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('.between()', function() {
    var between = matchie.between(7, 9);
    it('should do a X <= i < Y comparison', function() {
      expect(between(6)).to.equal(false);
      expect(between(7)).to.equal(true);
      expect(between(8)).to.equal(true);
      expect(between(9)).to.equal(false);
      expect(between(10)).to.equal(false);
    });
  });

  describe('.contains()', function() {
    var contains = matchie.contains('ran');
    it('should return whether the contains() parameter exists in the provided value', function() {
      expect(contains('Frank')).to.equal(true);
      expect(contains(['walked', 'crawled', 'ran'])).to.equal(true);
      expect(contains('Max')).to.equal(false);
      expect(contains([1, 2, 3])).to.equal(false);
    });
  });

  describe('.equals()', function() {
    var equals = matchie.equals('0');
    it('should return whether they weaky equal', function() {
      expect(equals('0')).to.equal(true);
      expect(equals(0)).to.equal(true);
      expect(equals(1)).to.equal(false);
    });
  });

  describe('.gt()', function() {
    var gt = matchie.gt(8);
    it('should do a greater than comparison', function() {
      expect(gt(7)).to.equal(false);
      expect(gt(8)).to.equal(false);
      expect(gt(9)).to.equal(true);
    });
  });

  describe('.gte()', function() {
    var gte = matchie.gte(8);
    it('should do a greater than or equal comparison', function() {
      expect(gte(7)).to.equal(false);
      expect(gte(8)).to.equal(true);
      expect(gte(9)).to.equal(true);
    });
  });

  describe('.in()', function() {
    var In = matchie.in([1, 3, 5]);
    it('should return whether the provided value exists in the in() parameter', function() {
      expect(In(1)).to.equal(true);
      expect(In(2)).to.equal(false);
      expect(In(5)).to.equal(true);
    });
  });

  describe('.instanceOf()', function() {
    var isArr = matchie.instanceOf(Array);
    var isObj = matchie.instanceOf(Object);
    it('should return whether the provided value is of the provided instance type', function() {
      expect(isArr([])).to.equal(true);
      expect(isArr({})).to.equal(false);
      expect(isArr(5)).to.equal(false);

      expect(isObj([])).to.equal(true);
      expect(isObj({})).to.equal(true); // Remember! An Array is an Object!
      expect(isObj(5)).to.equal(false);
    });
  });

  describe('.lt()', function() {
    var lt = matchie.lt(8);
    it('should do a less than comparison', function() {
      expect(lt(7)).to.equal(true);
      expect(lt(8)).to.equal(false);
      expect(lt(9)).to.equal(false);
    });
  });

  describe('.lte()', function() {
    var lte = matchie.lte(8);
    it('should do a less than or equal to comparison', function() {
      expect(lte(7)).to.equal(true);
      expect(lte(8)).to.equal(true);
      expect(lte(9)).to.equal(false);
    });
  });

  describe('.outside()', function() {
    var outside = matchie.outside(7, 9);
    it('should do a i < X || i >= Y comparison', function() {
      expect(outside(6)).to.equal(true);
      expect(outside(7)).to.equal(false);
      expect(outside(8)).to.equal(false);
      expect(outside(9)).to.equal(true);
      expect(outside(10)).to.equal(true);
    });
  });

  describe('.same()', function() {
    var same = matchie.same('0');
    it('should return whether they strongly equal', function() {
      expect(same('0')).to.equal(true);
      expect(same(0)).to.equal(false);
      expect(same(1)).to.equal(false);
    });
  });

  describe('.typeOf()', function() {
    var isStr = matchie.typeOf('string');
    var isNum = matchie.typeOf('number');
    it('should return whether the provided value matches the provided type', function() {
      expect(isStr('Frank')).to.equal(true);
      expect(isStr(5)).to.equal(false);
      expect(isNum('Frank')).to.equal(false);
      expect(isNum(5)).to.equal(true);
    });
  });
});
