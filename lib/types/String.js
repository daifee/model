
import Type from '../Type';
import CastError from '../errors/CastError';


export default class String extends Type {
  static isString(value) {
    return typeof value === 'string';
  };

  cast(originalValue) {
    let value = originalValue + '';

    if (String.isString(value)) {
      return value;
    }

    throw new CastError('String', this.attr, originalValue);
  }

  checkRequired(value) {
    return String.isString(value);
  }
}
