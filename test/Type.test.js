import Type from '../lib/Type';


describe('lib/Type.js', function () {

  it('isUndefined(value)接口', function () {
    let data = [null, 0, {}, '', true, false];
    data.forEach(function (value) {
      expect(Type.isUndefined(value)).to.deep.equal(false);
    });

    expect(Type.isUndefined(undefined)).to.deep.equal(true);
  });

  it('创建第一个Type实例', function () {
    let type = new Type('test', {
      default: 'daifee',
      get: function (value) {
        return value
      },
      set: function (value) {
        return value;
      },
      required: '不能为空',
      validator: {
        validate: function (value) {
          return !!value;
        },
        message: '验证不通过'
      }
    });

    // default, get, cast 都是getter
    expect(type._getters.length).to.deep.equal(3);

    // set
    expect(type._setters.length).to.deep.equal(1);

    // required, validator 都是validator
    expect(type._validators.length).to.deep.equal(2);


    expect(type.attr).to.deep.equal('test');
  });


  it('options.default', function () {
    let type = new Type('test', {default: 'daifee'});

    expect(type.applyGetters(null, undefined)).to.deep.equal('daifee');
  });

  it('options.get', function () {
    let obj = {};
    let type = new Type('test', {
      get: function () {
        expect(this).to.deep.equal(obj);
        return 100;
      }
    });

    expect(type.applyGetters(obj, 0)).to.deep.equal(100);
  });

  it('options.set', function () {
    let obj = {};
    let type = new Type('test', {
      set: function () {
        expect(this).to.deep.equal(obj);
        return 100;
      }
    });

    expect(type.applySetters(obj, 0)).to.deep.equal(100);
  });

  it('options.required', function () {
    let type = new Type('test', {required: 'fail'});
    let err;
    try {
      type.applyValidations(null, undefined);
    } catch (e) {
      err = e;
    }


    // 没通过验证，返回message
    expect(err).to.be.an.instanceof(Error);
    expect(err.attr).to.equal('test');
    expect(err.value).to.deep.equal(undefined);
    expect(err.name).to.deep.equal('ValidatorError');
    // 通过验证，返回true
    expect(type.applyValidations(null, true)).to.deep.equal(true);
  });

  it('options.validator', function () {
    let obj = {};
    let type = new Type('test', {
      validator: {
        validate: function (value) {
          expect(this).to.deep.equal(obj);
          return !!value;
        },
        message: 'fail'
      }
    });

    let err;
    try {
      type.applyValidations(obj, undefined);
    } catch (e) {
      err = e;
    }


    // 没通过验证，返回message
    expect(err).to.be.an.instanceof(Error);
    expect(err.attr).to.equal('test');
    expect(err.value).to.deep.equal(undefined);
    expect(err.name).to.deep.equal('ValidatorError');
    // 通过验证，返回true
    expect(type.applyValidations(obj, true)).to.deep.equal(true);
  });
});
