import Type from '../Type';
import CastError from '../errors/CastError';



export default class MixedType extends Type {
  static isMixed(value) {
    return true;
  }


  /**
   * 将originalValue转为Mixed
   *
   * @param {any} originalValue 源值
   * @returns Mixed | throw CastError
   * @memberof MixedType
   */
  cast(originalValue) {
    return originalValue;
  }

  checkRequired(value) {
    return MixedType.isMixed(value);
  }
}
