# model
将数据模型化

## 功能

* 声明模型的所有属性。每个属性又有以下功能：
  * 声明数据类型
  * 设置默认值
  * 定义getter函数
  * 定义setter函数
  * 添加内置验证器
  * 自定义验证器
* 定义虚拟属性
* 定义静态方法
* 定义实例方法
* 监听数据变化


## 用例

```js
import { define, create, Types } from 'model';

const { String, Number } = Types;

// 定义模式
let schema = define({
  name: {
    type: String
  },
  age: {
    type: Number,
    default: 0
  }
});

// 创建模型
let User = create(schema);


// 创建对象
let user = new User({
  name: 'daifee',
  age: 27
});

// 读取属性
console.log(user.get('name'));
// 修改属性
user.set('age', 28);
```


核心概念：

* 数据类型：
* 数据模型
* 对象

数据类型 -> 数据模型 -> 对象



## 数据类型

> 数据类型是定义数据模型的基础，对应数据模型定义的每个属性。

内置数据类型：

* String
* Number
* Boolean
* Array
* Mixed


数据类型功能：

* 声明属性值的数据类型
* 定义属性的getter&setter方法
* 定义属性的验证器
* 定义属性默认值
