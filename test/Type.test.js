import Type from '../lib/Type';


describe('lib/Type.js', function () {
  it('default', function () {
    let type = new Type('test', {default: 'daifee'});

    expect(type.applyGetters(null, undefined)).to.deep.equal('daifee');
  });
});
