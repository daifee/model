import ValidateError from '../lib/errors/ValidateError';
import ValidatorError from './errors/ValidatorError';

export default class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = {};

    for (let attr in definition) {
      let options = definition[attr];
      this.definition[attr] = new options.type(attr, options);
    }

    this.options = options;
  }

  /**
   * 经过attr定义的SchemaType处理originialValue，并返回
   * 如果该attr没有定义SchemaType，返回undefined
   * 过程可能会抛出异常
   *
   * @param {object} context model对象
   * @param {stringany} attr 属性名
   * @param {any} originalValue 源值
   * @returns value | throw Error
   * @memberof Schema
   */
  get(context, attr, originalValue) {
    let type = this.definition[attr];

    if (!type) {
      return undefined;
    } else {
      return type.applyGetters(context, originalValue);
    }
  }

  /**
   * 经过attr定义的SchemaType处理originialValue，并返回
   * 如果该attr没有定义SchemaType，返回源值
   * 过程可能会抛出异常
   *
   * @param {object} context
   * @param {string} attr
   * @param {any} originalValue
   * @returns
   * @memberof Schema
   */
  set(context, attr, originalValue) {
    let type = this.definition[attr];

    if (!type) {
      return originalValue;
    } else {
      return type.applySetters(context, originalValue);
    }
  }

  /**
   *
   *
   * @param {any} context
   * @param {any} [originalDoc={}]
   * @param {any} [validateAttrs=[]]
   * @returns
   * @memberof Schema
   */
  validate(context, originalDoc = {}, validateAttrs = []) {
    let validateError;

    // 如果 validateAttrs 为空数组，则全部属性都要验证
    if (validateAttrs.length === 0) {
      validateAttrs = Object.keys(this.definition);
    }

    validateAttrs.forEach((attr) => {
      let value = originalDoc[attr];
      let type = this.definition[attr];

      if (!type) return;

      try {
        type.applyValidations(context, value);
      } catch (err) {
        if (!validateError) {
          validateError = new ValidateError(err.message);
        }

        validateError.catch(err);
      }
    });

    if (validateError) {
      throw validateError;
    }

    return true;
  }

  toJSON(context, originalDoc = {}) {
    let result = {};

    // 以定义的key为准
    for (let attr in originalDoc) {
      let value = this.get(context, attr, originalDoc[attr]);
      if (value !== undefined) {
        result[attr] = value;
      }
    }

    return result;
  }
}

export function define(definition, options) {
  return new Schema(definition, options);
}
