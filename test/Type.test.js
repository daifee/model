import Type from '../lib/Type';


describe('lib/Type.js', function () {
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
    // cast必须在最后
    expect(type._getters[2]).to.deep.equal(type.cast);

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

    // 没通过验证，返回message
    expect(type.applyValidations(null, undefined)).to.deep.equal('fail');
    // 通过验证，返回undefined
    expect(type.applyValidations(null, true)).to.deep.equal(undefined);
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

    // 没通过验证，返回message
    expect(type.applyValidations(obj, undefined)).to.deep.equal('fail');
    // 通过验证，返回undefined
    expect(type.applyValidations(obj, true)).to.deep.equal(undefined);
  });
});
