import ValidatorError from '../../lib/errors/ValidatorError';


describe('lib/errors/ValidatorError', function () {
  it('Error子类', function () {
    let err = new ValidatorError('message', 'name', 28);

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.equal('ValidatorError');
    expect(err.message).to.be.an('string');
    expect(err.attr).to.equal('name');
    expect(err.value).to.equal(28)
  });
});
