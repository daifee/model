import Type from '../Type';
import CastError from '../errors/CastError';


export default class ArrayType extends Type {
  static isArray(value) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === '[object Array]';
    }
  }

  /**
   * 将originalValue转为Array
   *
   * @param {any} originalValue 源值
   * @returns Array | throw CastError
   * @memberof ArrayType
   */
  cast(originalValue) {
    if (typeof originalValue === 'undefined') {
      return originalValue;
    }

    if (ArrayType.isArray(originalValue)) {
      return originalValue;
    } else {
      throw new CastError('Array', this.attr, originalValue);
    }
  }

  checkRequired(value) {
    return ArrayType.isArray(value);
  }
}
