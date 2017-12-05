import Type from '../Type';
import CastError from '../errors/CastError';



export default class ObjectType extends Type {
  static isObject(value) {
    return value !== null && typeof value === 'object';
  }


  /**
   * 将originalValue转为Object
   *
   * @param {any} originalValue 源值
   * @returns Object | throw CastError
   * @memberof ObjectType
   */
  cast(originalValue) {
    if (typeof originalValue === 'undefined') {
      return originalValue;
    }

    if (ObjectType.isObject(originalValue)) {
      return originalValue;
    } else {
      throw new CastError('Object', this.attr, originalValue);
    }
  }

  checkRequired(value) {
    return ObjectType.isObject(value);
  }
}
