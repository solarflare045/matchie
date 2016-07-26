var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('.between()', function() {
    it('should do a X <= i < Y comparison', function() {
      var between = matchie.between(7, 9);
      expect(between(6)).to.equal(false);
      expect(between(7)).to.equal(true);
      expect(between(8)).to.equal(true);
      expect(between(9)).to.equal(false);
      expect(between(10)).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var between = matchie.between(new Date('2012/05/01'), new Date('2012/06/01'));
      expect(between(new Date('2012/04/01'))).to.equal(false);
      expect(between(new Date('2012/05/01'))).to.equal(true);
      expect(between(new Date('2012/05/15'))).to.equal(true);
      expect(between(new Date('2012/06/01'))).to.equal(false);
      expect(between(new Date('2012/07/01'))).to.equal(false);
    });
  });

  describe('.contains()', function() {
    it('should return whether the contains() parameter exists in the provided value', function() {
      var contains = matchie.contains('ran');
      expect(contains('Frank')).to.equal(true);
      expect(contains(['walked', 'crawled', 'ran'])).to.equal(true);
      expect(contains('Max')).to.equal(false);
      expect(contains([1, 2, 3])).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var contains = matchie.contains(new Date('2010/01/01'));
      expect(contains([new Date('2010/01/01'), new Date('2011/01/01')])).to.equal(true);
      expect(contains([new Date('2011/01/01'), new Date('2012/01/01')])).to.equal(false);
    });
  });

  describe('.equals()', function() {
    it('should return whether they weaky equal', function() {
      var equals = matchie.equals('0');
      expect(equals('0')).to.equal(true);
      expect(equals(0)).to.equal(true);
      expect(equals(1)).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var date = new Date('2010/01/01');
      var equals = matchie.equals(date);
      expect(equals(date)).to.equal(true);
      expect(equals(new Date('2010/01/01'))).to.equal(false);
    });
  });

  describe('.gt()', function() {
    it('should do a greater than comparison', function() {
      var gt = matchie.gt(8);
      expect(gt(7)).to.equal(false);
      expect(gt(8)).to.equal(false);
      expect(gt(9)).to.equal(true);
    });

    it('should work with Dates correctly', function() {
      var gt = matchie.gt(new Date('2009/01/01'));
      expect(gt(new Date('2008/01/01'))).to.equal(false);
      expect(gt(new Date('2009/01/01'))).to.equal(false);
      expect(gt(new Date('2010/01/01'))).to.equal(true);
    });
  });

  describe('.gte()', function() {
    it('should do a greater than or equal comparison', function() {
      var gte = matchie.gte(8);
      expect(gte(7)).to.equal(false);
      expect(gte(8)).to.equal(true);
      expect(gte(9)).to.equal(true);
    });

    it('should work with Dates correctly', function() {
      var gte = matchie.gte(new Date('2009/01/01'));
      expect(gte(new Date('2008/01/01'))).to.equal(false);
      expect(gte(new Date('2009/01/01'))).to.equal(true);
      expect(gte(new Date('2010/01/01'))).to.equal(true);
    });
  });

  describe('.in()', function() {
    it('should return whether the provided value exists in the in() parameter', function() {
      var In = matchie.in([1, 3, 5]);
      expect(In(1)).to.equal(true);
      expect(In(2)).to.equal(false);
      expect(In(5)).to.equal(true);
    });

    it('should work with Dates correctly', function() {
      var In = matchie.in([new Date('2014/01/01'), new Date('2014/01/03')]);
      expect(In(new Date('2014/01/01'))).to.equal(true);
      expect(In(new Date('2014/01/02'))).to.equal(false);
      expect(In(new Date('2014/01/03'))).to.equal(true);
    });
  });

  describe('.instanceOf()', function() {
    it('should return whether the provided value is of the provided instance type', function() {
      var isArr = matchie.instanceOf(Array);
      var isObj = matchie.instanceOf(Object);
      var isDate = matchie.instanceOf(Date);

      expect(isArr([])).to.equal(true);
      expect(isArr({})).to.equal(false);
      expect(isArr(5)).to.equal(false);
      expect(isArr(new Date('2010/01/01'))).to.equal(false);

      expect(isObj([])).to.equal(true);
      expect(isObj({})).to.equal(true); // Remember! An Array is an Object!
      expect(isObj(5)).to.equal(false);
      expect(isObj(new Date('2010/01/01'))).to.equal(true); // Remember! A Date is an Object!

      expect(isDate(5)).to.equal(false);
      expect(isDate(new Date('2010/01/01'))).to.equal(true);
    });
  });

  describe('.lt()', function() {
    it('should do a less than comparison', function() {
      var lt = matchie.lt(8);
      expect(lt(7)).to.equal(true);
      expect(lt(8)).to.equal(false);
      expect(lt(9)).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var lt = matchie.lt(new Date('2009/01/01'));
      expect(lt(new Date('2008/01/01'))).to.equal(true);
      expect(lt(new Date('2009/01/01'))).to.equal(false);
      expect(lt(new Date('2010/01/01'))).to.equal(false);
    });
  });

  describe('.lte()', function() {
    it('should do a less than or equal to comparison', function() {
      var lte = matchie.lte(8);
      expect(lte(7)).to.equal(true);
      expect(lte(8)).to.equal(true);
      expect(lte(9)).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var lte = matchie.lte(new Date('2009/01/01'));
      expect(lte(new Date('2008/01/01'))).to.equal(true);
      expect(lte(new Date('2009/01/01'))).to.equal(true);
      expect(lte(new Date('2010/01/01'))).to.equal(false);
    });
  });

  describe('.outside()', function() {
    it('should do a i < X || i >= Y comparison', function() {
      var outside = matchie.outside(7, 9);
      expect(outside(6)).to.equal(true);
      expect(outside(7)).to.equal(false);
      expect(outside(8)).to.equal(false);
      expect(outside(9)).to.equal(true);
      expect(outside(10)).to.equal(true);
    });

    it('should work with Dates correctly', function() {
      var outside = matchie.outside(new Date('2012/05/01'), new Date('2012/06/01'));
      expect(outside(new Date('2012/04/01'))).to.equal(true);
      expect(outside(new Date('2012/05/01'))).to.equal(false);
      expect(outside(new Date('2012/05/15'))).to.equal(false);
      expect(outside(new Date('2012/06/01'))).to.equal(true);
      expect(outside(new Date('2012/07/01'))).to.equal(true);
    });
  });

  describe('.same()', function() {
    it('should return whether they strongly equal', function() {
      var same = matchie.same('0');
      expect(same('0')).to.equal(true);
      expect(same(0)).to.equal(false);
      expect(same(1)).to.equal(false);
    });

    it('should work with Dates correctly', function() {
      var date = new Date('2010/01/01');
      var same = matchie.same(date);
      expect(same(date)).to.equal(true);
      expect(same(new Date('2010/01/01'))).to.equal(false);
    });
  });

  describe('.typeOf()', function() {
    it('should return whether the provided value matches the provided type', function() {
      var isStr = matchie.typeOf('string');
      var isNum = matchie.typeOf('number');
      expect(isStr('Frank')).to.equal(true);
      expect(isStr(5)).to.equal(false);
      expect(isNum('Frank')).to.equal(false);
      expect(isNum(5)).to.equal(true);
    });
  });
});
