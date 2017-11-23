
import ModelError from '../error';


export default class ValidatorError extends ModelError {
  constructor(message) {
    super(message);

    this.name = 'ValidatorError';
  }
}

