var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));

var matchie = require('../matchie');
var expect = chai.expect;

describe('matchie()', function() {
  describe('with two number values', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie(2, 2)).to.equal(true);
    });

    it('should return FALSE if they are different', function() {
      expect(matchie(2, 3)).to.equal(false);
    });
  });

  describe('with two strings', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie('boots', 'boots')).to.equal(true);
    });

    it('should return FALSE if they are different', function() {
      expect(matchie('boots', 'shoes')).to.equal(false);
    });
  });

  describe('with two booleans', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie(true, true)).to.equal(true);
    });

    it('should return FALSE if they are different', function() {
      expect(matchie(true, false)).to.equal(false);
    });
  });

  describe('with two falsey primatives', function() {
    it('should return TRUE if they are both UNDEFINED', function() {
      expect(matchie(undefined, undefined)).to.equal(true);
    });

    it('should return FALSE if one is UNDEFINED and the other is NULL', function() {
      expect(matchie(undefined, null)).to.equal(false);
    });

    it('should return FALSE if both are NAN', function() {
      expect(matchie(NaN, NaN)).to.equal(false);
    });
  });

  describe('with up to two Dates', function() {
    it('should return TRUE if they are the same', function() {
      expect(matchie(new Date('2013/02/03'), new Date('2013/02/03'))).to.equal(true);
    });

    it('should return FALSE if they are different', function() {
      expect(matchie(new Date('2013/02/03'), new Date('2010/01/01'))).to.equal(false);
    });

    it('should return FALSE if Dates are not compared against other dates', function() {
      expect(matchie({}, new Date('2010/01/01'))).to.equal(false);
      expect(matchie(new Date('2013/02/03'), {})).to.equal(false);
    });
  });

  describe('with the second parameter being a function', function() {
    it('should compare the first value against that function and return its value', function() {
      var stub = sinon.stub();
      stub.returns(false);

      expect(matchie(2, stub)).to.equal(false);
      expect(stub).to.have.been.calledWith(2);
    });
  });

  describe('with an integer and an array', function() {
    it('should not have any specific comparison available', function() {
      expect(matchie(5, [5, 0])).to.equal(false);
    });
  });

  describe('.matches()', function() {
    it('should wrap around matchie', function() {
      var matches = matchie.matches(matchie.gte(5));
      expect(matches(3)).to.equal(false);
      expect(matches(5)).to.equal(true);
      expect(matches(7)).to.equal(true);
    });
  });
});
