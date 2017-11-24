import ValidateError from '../../lib/errors/ValidateError';
import ValidatorError from '../../lib/errors/ValidatorError';


describe('lib/errors/ValidateError', function () {
  it('Error子类', function () {
    let err = new ValidateError('message');

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.equal('ValidateError');
    expect(err.message).to.be.an('string');
  });

  it('.catch(validatorError)', function () {
    let validateError = new ValidateError('test');
    let validatorError = new ValidatorError('test', 'attr', 'value');

    validateError.catch(validatorError);

    expect(validateError.errors['attr']).to.equal(validatorError);
  });
});
