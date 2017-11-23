/**
 * 数据类型。每个属性都必须声明具体数据类型。
 *
 * @export
 * @class Type
 */
import ValidatorError from './errors/ValidatorError';

export default class Type {
  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  /**
   * Creates an instance of Type.
   * @param {string} attr
   * @param {any} options
   *   @prop default {any} 默认值
   *   @prop get {function} getter函数
   *   @prop set {function} setter函数
   *   @prop validator {object} 验证器对象
   *     @prop validate {function} 验证方法
   *     @prop message {string} 错误提示
   *   @prop required {string} 错误提示
   * @memberof Type
   */
  constructor(attr, options = {}) {
    this.attr = attr;
    this._getters = [];
    this._setters = [];
    this._validators = [];

    let key;
    for (key in options) {
      this[key] && this[key](options[key]);
    }

    // 转换数据类型的getter放在最后
    this.pushToGetters((originalValue) => {
      return this.cast(originalValue);
    });
  }

  pushToGetters(item) {
    this._getters.push(item);
  }

  unshiftToGetters(item) {
    this._getters.unshift(item);
  }

  // 对象保存原始数据，读取时才转换
  applyGetters(context, originalValue) {
    let value = originalValue;
    this._getters.forEach(function (get) {
      value = get.call(context, value);
    });

    return value;
  }


  pushToSetters(item) {
    this._setters.push(item);
  }

  unshiftToSetters(item) {
    this._setters.unshift(item);
  }

  applySetters(context, originalValue) {
    let value = originalValue;
    this._setters.forEach(function (set) {
      value = set.call(context, value);
    });

    return value;
  }


  pushToValidations(item) {
    this._validators.push(item);
  }

  unshiftToValidations(item) {
    this._validators.unshift(item);
  }

  applyValidations(context, originalValue) {
    let result;
    let validator;
    let i = 0, len = this._validators.length;
    let value;

    try {
      value = this.applyGetters(context, originalValue);
    } catch (err) {
      throw new ValidatorError(err.message, this.attr, originalValue);
    }

    for (; i < len; i++) {
      validator = this._validators[i];
      if (!validator.validate.call(context, value)) {
        throw new ValidatorError(validator.message, this.attr, originalValue);
      }
    }

    return true;
  }

  /**
   * 将originalValue强制转换为指定类型。每个子类都必须重载
   * _getters最后一个项
   * @param {any} originalValue
   * @returns
   * @memberof Type
   */
  cast(originalValue) {
    return originalValue;
  }

  /**
   * 检查value是否满足 required。每个子类都必须重载
   * _validators第一项（如果声明了required）
   *
   * @param {any} value
   * @returns
   * @memberof Type
   */
  checkRequired(value) {
    return typeof value !== 'undefined';
  }



  /**
   * 下面为配置项的包装方法
   */

  default(defaultValue) {
    let _this = this;
    this.unshiftToGetters(function (originalValue) {
      return _this.checkRequired(originalValue) ? originalValue : defaultValue;
    });
  }

  get(originalValue) {
    this.pushToGetters(originalValue);
  }

  set(originalValue) {
    this.pushToSetters(originalValue);
  }

  validator(validator) {
    this.pushToValidations(validator);
  }

  required(message) {
    let validator = {
      validate: this.checkRequired,
      message: message
    };

    this.unshiftToValidations(validator);
  }
}

