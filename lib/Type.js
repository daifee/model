/**
 * 数据类型。每个属性都必须声明具体数据类型。
 * 然后属性就支持下列功能：
 * * get
 * * set
 * * validator
 * * default
 * * requred
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
  }

  default(value) {
    this._getters.unshift(function () {
      return value;
    });
  }

  get(value) {
    this._getters.push(value);
  }

  set(value) {
    this._setters.push(value);
  }

  validator(obj) {
    this._validators.push(obj);
  }

  required(message) {
    let validator = {
      validate: this.checkRequired,
      message: message
    };

    this._validators.unshift(validator);
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
   * 检查value是否为空。每个子类都必须重载
   * _validators第一项（如果声明了required）
   *
   * @param {any} value
   * @returns
   * @memberof Type
   */
  checkRequired(value) {
    return typeof value !== 'undefined';
  }
}

