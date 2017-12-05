import Schema, {define} from '../lib/Schema';
import NumberType from '../lib/types/Number';
import StringType from '../lib/types/String';
import Model, {create} from '../lib/Model';


describe('lib/Model', function () {
  it('创建一个Model类', function () {
    let User = create({});

    expect(User).to.be.a('function');
  });

  it('创建一个Model对象', function () {
    let schema = define({
      age: {
        type: NumberType
      },
      name: {
        type: StringType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    expect(user).to.be.an.instanceof(User);
    expect(user).to.be.an.instanceof(Model);
    expect(user._doc).to.be.deep.equal({age: '27', name: 'daifee'});
  });

  it('#get(attr)', function () {
    let schema = define({
      age: {
        type: NumberType
      },
      name: {
        type: StringType
      }
    });
    let User = create(schema);
    let user = new User({
      age: '27',
      name: 'daifee',
      gender: 'male'
    });

    expect(user.get('age')).to.deep.equal(27);
    expect(user.get('name')).to.deep.equal('daifee');
    expect(user.get('gender')).to.deep.equal(undefined);
  });

  it.skip('#get(attr) 数据类型转换失败', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({
      age: '中文'
    });

    expect(user.get('age')).to.deep.equal(undefined);
  });

  it('#set(attr, value)', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({age: '27'});

    expect(user._doc).to.deep.equal({age: '27'});
    user.set('age', '99');
    expect(user._doc).to.deep.equal({age: '99'});
  });

  it('#set(obj)', function () {
    let schema = define({
      age: {
        type: NumberType
      },
      name: {
        type: StringType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    expect(user._doc).to.deep.equal({age: '27', name: 'daifee'});

    user.set({age: 27, gender: 'male'});
    expect(user._doc).to.deep.equal({age: 27, name: 'daifee', gender: 'male'});
  });

  it('#listen', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    expect(user._listeners.length).to.equal(0);
    user.listen(() => {});
    user.listen(() => {});
    expect(user._listeners.length).to.equal(2);
  });

  it('#unlinsten(listener)', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    function listener() {
      // do nothing
    }

    expect(user._listeners.length).to.equal(0);
    user.listen(() => {});
    user.listen(listener);
    user.unlisten(listener);
    expect(user._listeners.length).to.equal(1);
  });

  it('监听数据变化', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    let count = 0;
    user.listen(function () {
      count++;
    });

    user.set('age', 28);
    user.set('name', 'daifee');
    expect(count).to.deep.equal(2);
    user.set({age: 29, name: 'daifee2'});
    expect(count).to.deep.equal(3);
  });

  it('调用#set()接口不触发listener', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({age: '27', name: 'daifee'});

    let count = 0;
    user.listen(function () {
      count++;
    });

    user.set('age', 28, true);
    expect(count).to.deep.equal(0);

    user.set({age: 29, name: 'daifee'}, true);
    expect(count).to.deep.equal(0);
  });


  it('#toJSON()', function () {
    let schema = define({
      age: {
        type: NumberType
      }
    });
    let User = create(schema);
    let user = new User({
      age: '27',
      name: 'daifee'
    });

    expect(user.toJSON()).to.deep.equal({
      age: 27
    });
  });
});
