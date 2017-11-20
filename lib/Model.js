

class Model {
  constructor(obj) {

    this._doc = {};
    this._listeners = [];

    this.set(obj, true);
  }

  get(attr) {
    return this.schema.get(this, attr, this._doc[attr]);
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
    return this.schema.toJSON(this, this._doc);
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
  // return Model
  class PowerfulModel extends Model {
    schema = schema;
  }

  return PowerfulModel;
}
