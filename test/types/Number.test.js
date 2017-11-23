import NumberType from '../../lib/types/Number';
import Type from '../../lib/Type';


describe('lib/types/Number.js', function () {
  it('继承Type', function () {
    let num = new NumberType('test', {});
    expect(num).to.be.an.instanceof(Type);
  });

  it('.isNumber(value)', function () {
    let values = ['', {}, null, undefined, function () {}, [], NaN];
    values.forEach(function (value) {
      expect(NumberType.isNumber(value)).to.deep.equal(false);
    });

    expect(NumberType.isNumber(0)).to.deep.equal(true);
    expect(NumberType.isNumber(new Number(1))).to.deep.equal(true);
  });


  it('.cast(value)', function () {
    let num = new NumberType('test');
    expect(num.cast(undefined)).to.deep.equal(undefined);

    expect(num.cast('')).to.deep.equal(0);
    expect(num.cast(null)).to.deep.equal(0);
    expect(num.cast([])).to.deep.equal(0);
    expect(num.cast([28])).to.deep.equal(28);

    function err() {
      num.cast('ffda');
    }

    expect(err).to.throw(Error);
  });

  it('.checkRequired(value)', function () {
    let values = ['', {}, null, undefined, function () {}, [], NaN];
    let num = new NumberType('test');
    values.forEach(function (value) {
      expect(num.checkRequired(value)).to.deep.equal(false);
    });

    expect(num.checkRequired(0)).to.deep.equal(true);
    expect(num.checkRequired(new Number(1))).to.deep.equal(true);
  });
});
