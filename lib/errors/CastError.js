
import ModelError from '../error';


export default class CastError extends ModelError {
  constructor(type, attr, value) {
    let message = `${attr}属性值不是${type}类型`;
    super(message);

    this.value = value;
    this.name = 'CastError';
  }
}

