/**
 * 数据类型。每个属性都必须声明具体数据类型。
 *
 * @export
 * @class Type
 */


export default class Type {
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
  constructor(attr, options) {
    this.attr = attr;
    this._getters = [];
    this._setters = [];
    this._validators = [];

    let key;
    for (key in options) {
      this[key] && this[key](options[key]);
    }

    this.pushToGetters(this.cast);
  }

  pushToGetters(item) {
    this._getters.push(item);
  }

  unshiftToGetters(item) {
    this._getters.unshift(item);
  }

  pushToSetters(item) {
    this._setters.push(item);
  }

  unshiftToSetters(item) {
    this._setters.unshift(item);
  }

  pushToValidations(item) {
    this._validators.push(item);
  }

  unshiftToValidations(item) {
    this._validators.unshift(item);
  }

  /**
   * 将value强制转换为指定类型。每个子类都必须重载
   * _getters最后一个项
   * @param {any} value
   * @returns
   * @memberof Type
   */
  cast(value) {
    return value;
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
    value = this.cast(value);

    return typeof value !== 'undefined';
  }



  /**
   * 下面为配置项的包装方法
   */

  default(defaultValue) {
    let _this = this;
    this.unshiftToGetters(function (value) {
      return _this.checkRequired(value) ? value : defaultValue;
    });
  }

  get(value) {
    this.pushToGetters(value);
  }

  set(value) {
    this.pushToSetters(value);
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

