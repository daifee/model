

export default class Schema {
  constructor(definition = {}, options = {}) {
    this.definition = {};
    for (let attr in definition) {
      let options = definition[attr];
      this.definition[attr] = new options.type(attr, options);
    }

    this.options = options;
  }

  get(context, attr, originalValue) {
    let type = this.definition[attr];

    if (!type) {
      return originalValue;
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

  validate(context, originalDoc = {}) {
    for (let attr in originalDoc) {
      let value = originalDoc[attr];
      let type = this.definition[attr];

      if (!type) continue;
      try {
        type.applyValidations(context, value);
      } catch (err) {

      }
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
