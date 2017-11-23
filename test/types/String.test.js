import StringType from '../../lib/types/String';
import Type from '../../lib/Type';


describe('lib/types/String', function () {
  it('继承Type', function () {
    let str = new StringType('test', {});
    expect(str).to.be.an.instanceof(Type);
  });

  it('#isString(value)', function () {
    let values = [1, {}, null, undefined, function () {}, [], NaN];
    values.forEach(function (value) {
      expect(StringType.isString(value)).to.deep.equal(false);
    });

    expect(StringType.isString('')).to.deep.equal(true);
    expect(StringType.isString(new String('1'))).to.deep.equal(true);
  });

  it('.cast(value)', function () {
    let str = new StringType('test');
    expect(str.cast(undefined)).to.deep.equal(undefined);
    expect('a').to.deep.equal('a');
    let aa = new String('a');
    expect(aa).to.deep.equal(aa);

    expect(str.cast({})).to.deep.equal({} + '');
    expect(str.cast(null)).to.deep.equal(null + '');
    expect(str.cast([])).to.deep.equal([] + '');
    expect(str.cast([28])).to.deep.equal([28] + '');
  });

  it('.checkRequired(value)', function () {
    let values = [100, {}, null, undefined, function () {}, [], NaN];
    let str = new StringType('test');
    values.forEach(function (value) {
      expect(str.checkRequired(value)).to.deep.equal(false);
    });

    expect(str.checkRequired('')).to.deep.equal(true);
    expect(str.checkRequired(new String('1'))).to.deep.equal(true);
  });
});
