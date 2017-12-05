
import Type from '../Type';
import CastError from '../errors/CastError';


export default class StringType extends Type {
  // 是否String型
  static isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
  };

  /**
   * 将originalValue转为String
   *
   * @param {any} originalValue 源值
   * @returns String | throw CastError
   * @memberof StringType
   */
  cast(originalValue) {
    if (typeof originalValue === 'undefined') {
      return originalValue;
    }

    try {
      let value = originalValue + '';
      if (StringType.isString(value)) {
        return value;
      } else {
        throw new CastError('String', this.attr, originalValue);
      }
    } catch (e) {
      throw new CastError('String', this.attr, originalValue);
    }
  }

  /**
   * 检测value是否String型
   *
   * @param {any} value
   * @returns
   * @memberof StringType
   */
  checkRequired(value) {
    return StringType.isString(value);
  }
}
