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

  /**
   * 尾部插入一个getter
   *
   * @param {function} item
   * @memberof Type
   */
  pushToGetters(item) {
    this._getters.push(item);
  }

  /**
   * 头部插入一个getter
   *
   * @param {function} item
   * @memberof Type
   */
  unshiftToGetters(item) {
    this._getters.unshift(item);
  }

  /**
   * 执行所有getter处理originalValue，并返回结果
   *
   * @param {object} context model对象
   * @param {any} originalValue 源值
   * @returns
   * @memberof Type
   */
  applyGetters(context, originalValue) {
    let value = originalValue;
    this._getters.forEach(function (get) {
      value = get.call(context, value);
    });

    return value;
  }

  /**
   * 尾部插入一个setter
   *
   * @param {function} item setter
   * @memberof Type
   */
  pushToSetters(item) {
    this._setters.push(item);
  }

  /**
   * 头部插入一个setter
   *
   * @param {function} item setter
   * @memberof Type
   */
  unshiftToSetters(item) {
    this._setters.unshift(item);
  }

  /**
   * 运行所有setter处理originalValue，并返回结果
   *
   * @param {object} context model对象
   * @param {any} originalValue
   * @returns
   * @memberof Type
   */
  applySetters(context, originalValue) {
    let value = originalValue;
    this._setters.forEach(function (set) {
      value = set.call(context, value);
    });

    return value;
  }

  /**
   * 尾部插入一个验证器
   *
   * @param {object} item 验证器对象
   * @memberof Type
   */
  pushToValidations(item) {
    this._validators.push(item);
  }

  /**
   * 头部插入一个验证器
   *
   * @param {object} item 验证器对象
   * @memberof Type
   */
  unshiftToValidations(item) {
    this._validators.unshift(item);
  }

  /**
   * 执行所有验证器验证该类型的originalValue
   *
   * @param {object} context model对象
   * @param {any} originalValue
   * @returns true
   * @memberof Type
   */
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
      return originalValue === undefined ? defaultValue : originalValue;
    });
  }

  get(getter) {
    this.pushToGetters(getter);
  }

  set(setter) {
    this.pushToSetters(setter);
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

