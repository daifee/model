
import Type from '../Type';
import CastError from '../errors/CastError';


export default class NumberType extends Type {
  // 是否Number型
  static isNumber(value) {
    return (typeof value === 'number' || value instanceof Number)
      && !!!isNaN(value);
  };

  /**
   * 将originValue转为Number型
   *
   * @param {any} originalValue 源数据
   * @returns Number | throw CastError
   * @memberof NumberType
   */
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

  /**
   * 检测value是否Number型
   *
   * @param {any} value
   * @returns Boolean
   * @memberof NumberType
   */
  checkRequired(value) {
    return NumberType.isNumber(value);
  }
}
