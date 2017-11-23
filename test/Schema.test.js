
import Schema, {define} from '../lib/Schema';
import NumberType from '../lib/types/Number';
import StringType from '../lib/types/String';


describe.only('lib/Schema', function () {
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
    expect(schema.get(null, 'not-found', 28)).to.equal(28);
  });

  it('.get(context, attr, originalValue)', function () {
    let schema = define({
      name: {
        type: StringType
      }
    });

    expect(schema.set(null, 'name', 'daifee')).to.equal('daifee');
    expect(schema.set(null, 'name', 28)).to.equal(28);
    expect(schema.set(null, 'not-found', 28)).to.equal(28);
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
});

