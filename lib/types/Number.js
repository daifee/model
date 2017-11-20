
import Type from '../Type';
import CastError from '../errors/CastError';


export default class Number extends Type {
  static isNumber(value) {
    return typeof value === 'number';
  };

  cast(originalValue) {
    if (Type.isUndefined(value)) {
      return originalValue;
    }

    let value = Number(originalValue);

    if (Number.isNumber(value)) {
      return value;
    }

    throw new CastError('Number', this.attr, originalValue);
  }

  checkRequired(value) {
    return Number.isNumber(value);
  }
}