import CastError from '../../lib/errors/CastError';


describe('lib/errors/CastError', function () {
  it('Error子类', function () {
    let err = new CastError('number', 'name', {});

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.equal('CastError');
    expect(err.message).to.be.an('string');
  });
});
