
import ModelError from '../error';


export default class ValidateError extends ModelError {
  constructor(message) {
    super(message);

    let errors = this.errors = {};
    this.name = 'ValidateError';

    // babel的bug，还是Error.call的bug?
    this.catch = function (validatorError) {
      errors[validatorError.attr] = validatorError;
    };
  }
}

