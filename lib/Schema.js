import ValidateError from '../lib/errors/ValidateError';
import ValidatorError from './errors/ValidatorError';

export default class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = {};
    this.requiredAttrs = [];

    for (let attr in definition) {
      let options = definition[attr];
      this.definition[attr] = new options.type(attr, options);

      if (options.required) {
        this.requiredAttrs.push(attr);
      }
    }

    this.options = options;
  }

  get(context, attr, originalValue) {
    let type = this.definition[attr];

    if (!type) {
      return undefined;
    } else {
      return type.applyGetters(context, originalValue);
    }
  }

  set(context, attr, originalValue) {
    let type = this.definition[attr];

    if (!type) {
      return originalValue;
    } else {
      return type.applySetters(context, originalValue);
    }
  }

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
    for (let attr in this.definition) {
      result[attr] = this.get(context, attr, originalDoc[attr]);
    }

    return result;
  }
}

export function define(definition, options) {
  return new Schema(definition, options);
}
