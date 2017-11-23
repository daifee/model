
import Type from '../Type';
import CastError from '../errors/CastError';


export default class NumberType extends Type {
  static isNumber(value) {
    return (typeof value === 'number' || value instanceof Number)
      && !!!isNaN(value);
  };

  cast(originalValue) {
    if (Type.isUndefined(originalValue)) {
      return originalValue;
    }

    let value = Number(originalValue);

    if (NumberType.isNumber(value)) {
      return value;
    }

    throw new CastError('Number', this.attr, originalValue);
  }

  checkRequired(value) {
    return NumberType.isNumber(value);
  }
}
