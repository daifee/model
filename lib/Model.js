

export default class Model {
  constructor(obj) {
    this._doc = {};
    this._listeners = [];

    this.set(obj, true);
  }

  get(attr) {
    try {
      return this.schema.get(this, attr, this._doc[attr]);
    } catch (err) {
      return;
    }
  }

  set(attr, value, silent = false) {
    if (typeof attr === 'object') {
      let obj = attr;
      silent = typeof value === 'undefined' ? false : value;

      for (attr in obj) {
        value = obj[attr];
        this.set(attr, value, true);
      }
    } else {
      this._doc[attr] = this.schema.set(this, attr, value);
    }

    if (!silent) {
      this._listeners.forEach(function (listener) {
        listener();
      });
    }

    return this;
  }

  toJSON() {
    try {
      return this.schema.toJSON(this, this._doc);
    } catch (err) {
      return null;
    }
  }

  listen(listener) {
    this._listeners.push(listener);
  }

  unlisten(listener) {
    let i = 0;
    let len = this._listeners.length;
    for (; i < len; i++) {
      if (listener === this._listeners[i]) {
        this._listeners.splice(i, 1);
        return true;
      }
    }

    return false;
  }
}



export function create(schema) {
  // return UniqueModel
  class UniqueModel extends Model {

  }

  UniqueModel.prototype.schema = schema;

  return UniqueModel;
}
