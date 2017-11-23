import ModelError from '../lib/error';


describe('lib/error', function () {
  it('Error子类', function () {
    let err = new ModelError('test');

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.equal('ModelError');
    expect(err.message).to.equal('test');
  });
});
