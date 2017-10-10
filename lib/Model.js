

class Model {
  constructor(obj) {

    this._doc = {};
    this._listeners = [];

    this.set(obj, true);
  }

  get(attr) {
    return this.schema.get(this, attr);
  }

  set(attr, value, silent = false) {
    if (typeof attr === 'object') {
      silent = typeof value === 'undefined' ? false : value;

      let obj = attr;
      for (attr in obj) {
        value = obj[attr];
        this.set(attr, value, true);
      }
    } else {
      this.schema.set(this, attr, value);
    }

    if (!silent) {
      this._listeners.forEach(function (listener) {
        listener();
      });
    }

    return this;
  }

  toJSON() {
    return this.schema.toJSON(this);
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



export function compile(schema) {
  // return Model
  class PowerfulModel extends Model {
    schema = schema;
  }

  return PowerfulModel;
}
