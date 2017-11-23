
import ModelError from '../error';


export default class ValidateError extends ModelError {
  constructor(message) {
    super(message);

    this.name = 'ValidateError';
  }
}

