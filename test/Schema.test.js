
import Schema, {define} from '../lib/Schema';
import NumberType from '../lib/types/Number';
import StringType from '../lib/types/String';


describe('lib/Schema', function () {
  it('定义一个Schema对象', function () {
    let schema = define({
      name: {
        type: StringType,
        required: '不能为空',
        default: 'guest',
        get: function (val) {
          return val;
        },
        set: function (val) {
          return val;
        },
        validator: {
          validate: function (val) {
            return val !== 'daifee';
          },
          message: 'daifee已被注册'
        }
      },
      age: {
        type: NumberType
      }
    });

    expect(schema).to.be.an.instanceof(Schema);
  });

  it('.get(context, attr, originalValue)', function () {
    let schema = define({
      name: {
        type: StringType
      }
    });

    expect(schema.get(null, 'name', 'daifee')).to.equal('daifee');
    expect(schema.get(null, 'name', 28)).to.equal('28');
    expect(schema.get(null, 'not-found', 28)).to.equal(undefined);
  });

  it('.get(context, attr, originalValue) 抛出异常', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });

    let err;
    try {
      schema.get(null, 'age', NaN);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.deep.equal('CastError');
  });

  it('.set(context, attr, originalValue)', function () {
    let schema = define({
      name: {
        type: StringType
      }
    });

    expect(schema.set(null, 'name', 'daifee')).to.equal('daifee');
    expect(schema.set(null, 'name', 28)).to.equal(28);
    expect(schema.set(null, 'not-found', 28)).to.equal(28);
  });

  it('getter & setter', function () {
    let context = {};
    let count = 0;
    let schema = define({
      name: {
        type: StringType,
        get: function (value) {
          expect(this).to.deep.equal(context);
          expect(value).to.deep.equal('daifee');
          count++;
        },
        set: function (value) {
          expect(this).to.deep.equal(context);
          expect(value).to.deep.equal(28);
          count++;
        }
      }
    });

    schema.get(context, 'name', 'daifee');
    schema.set(context, 'name', 28);

    expect(count).to.deep.equal(2);
  });

  it('.toJSON(context, originalDoc)', function () {
    let schema = define({
      name: {
        type: StringType
      },
      age: {
        type: NumberType
      }
    });

    expect(schema.toJSON(null, {
      name: 'daifee',
      age: 28,
      gender: 'male'
    })).to.deep.equal({
      name: 'daifee',
      age: 28
    });
  });

  it('.toJSON(context, originalDoc)抛出异常', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });

    let err;
    try {
      schema.toJSON(null, {age: NaN});
    } catch (e) {
      err = e;
    }

    expect(err).to.be.an.instanceof(Error);
    expect(err.name).to.deep.equal('CastError');
  });


  describe('.validate(context, originDoc)', function () {

    it('通过验证', function () {
      let schema = define({
        name: {
          type: StringType,
          validator: {
            validate: function() {
              return true;
            },
            message: 'fail'
          }
        }
      });

      let result = schema.validate(null, {name: 'daifee'});
      expect(result).to.deep.equal(true);
    });

    it('不能为空', function () {
      let schema = define({
        name: {
          type: StringType,
          required: 'is required'
        }
      });

      let err;

      try {
        schema.validate(null, {});
      } catch (e) {
        err = e;
      }

      expect(err).to.be.an.instanceof(Error);
      expect(err.name).to.equal('ValidateError');
      expect(err.errors['name']).to.be.an.instanceof(Error);
      expect(err.errors['name'].message).to.equal('is required');
    });

    it('自定义验证器，不通过', function () {
      let context = {};
      let schema = define({
        name: {
          type: StringType,
          validator: {
            validate: function(value) {
              expect(this).to.deep.equal(context);
              return false;
            },
            message: 'fail'
          }
        }
      });

      let err;

      try {
        schema.validate(context, {name: 'daifee'});
      } catch (e) {
        err = e;
      }

      expect(err).to.be.an.instanceof(Error);
      expect(err.name).to.equal('ValidateError');
    });

    it('只验证部分属性', function () {
      let schema = define({
        name: {
          type: StringType,
          required: 'is required'
        },
        gender: {
          type: StringType,
          required: 'is required'
        }
      });

      let err;

      try {
        schema.validate(null, {}, ['gender']);
      } catch (e) {
        err = e;
      }

      expect(err.name).to.equal('ValidateError');
      expect(err.errors['gender']).to.be.an.instanceof(Error);
      // 没有执行验证
      expect(err.errors['name']).to.deep.equal(undefined);
    });
  });
});

