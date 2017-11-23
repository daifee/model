
import ModelError from '../error';


export default class ValidatorError extends ModelError {
  constructor(message, attr, value) {
    super(message);

    this.attr = attr;
    this.value = value;
    this.name = 'ValidatorError';
  }
}

