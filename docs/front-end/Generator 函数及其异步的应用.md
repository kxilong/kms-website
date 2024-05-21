# Generator 函数及其异步的应用

## Generator 函数

Generator 函数可以直接生成迭代器，也是 es6 异步编程的解决方案

- es6 异步编程解决方案
- 声明：通过 function \*声明
- 返回值：符合可迭代协议和迭代器协议的生成器对象
- 在执行时能暂停，又能从暂停出继续执行

生成器对象原型上有 3 个方法：

1. next(param);
2. return(param)
3. throw(param)

#### 迭代器 vs 生成器

迭代器:有 next 方法，执行返回结果对象 结果对象包含：1.value 2.done

用 es5 自己写一个迭代器，让大家看的更清楚

```js
function createIterator(item) {
  var i = 0;
  return {
    next: function () {
      var done = i >= item.length;
      var value = !done ? item[i++] : undefined;
      return {
        done: done,
        value: value,
      };
    },
  };
}

var iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // { done: false, value: 1 }
console.log(iterator.next()); // { done: false, value: 2 }
console.log(iterator.next()); // { done: false, value: 3 }
console.log(iterator.next()); // { done: true, value: undefined }
```

## next 方法的参数

yield 表达式本身没有返回值，或者说总是返回 undefined。next 方法可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```js
function* f() {
  for (var i = 0; true; i++) {
    var reset = yield i;
    if (reset) {
      i = -1;
    }
  }
}
var g = f();
g.next(); // { value: 0, done: false }
g.next(); // { value: 1, done: false }
g.next(true); // { value: 0, done: false }
```

上面代码先定义了一个可以无限运行的 Generator 函数 f，如果 next 方法没有参数，每次运行到 yield 表达式，变量 reset 的值总是 undefined。当 next 方法带一个参数 true 时，变量 reset 就被重置为这个参数（即 true），因此 i 会等于-1，下一轮循环就会从-1 开始递增。

## Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 throw 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log("内部捕获", e);
  }
};
var i = g();
i.next();
try {
  i.throw("a");
  i.throw("b");
} catch (e) {
  console.log("外部捕获", e);
}
// 内部捕获 a
// 外部捕获 b
```

上面代码中，遍历器对象 i 连续抛出两个错误。第一个错误被 Generator 函数体内的 catch 语句捕获。i 第二次抛出错误，由于 Generator 函数内部的 catch 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 catch 语句捕获。

## Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 return 方法，可以返回给定的值，并且终结遍历 Generator 函数。

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}
var g = gen();
g.next(); // { value: 1, done: false }
g.return("foo"); // { value: "foo", done: true }
g.next(); // { value: undefined, done: true }
```

上面代码中，遍历器对象 g 调用 return 方法后，返回值的 value 属性就是 return 方法的参数 foo。并且，Generator 函数的遍历就终止了，返回值的 done 属性为 true，以后再调用 next 方法，done 属性总是返回 true。

## next()、throw()、return() 的共同点

next()、throw()、return()这三个方法本质上是同一件事，可以放在一起理解。它们的作用都是让 Generator 函数恢复执行，并且使用不同的语句替换 yield 表达式。

#### next()是将 yield 表达式替换成一个值。

```js
const g = function* (x, y) {
  let result = yield x + y;
  return result;
};
const gen = g(1, 2);
gen.next(); // Object {value: 3, done: false}
gen.next(1); // Object {value: 1, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = 1;
```

#### throw()是将 yield 表达式替换成一个 throw 语句。

```js
gen.throw(new Error("出错了")); // Uncaught Error: 出错了
// 相当于将 let result = yield x + y
// 替换成 let result = throw(new Error('出错了'));
```

#### return()是将 yield 表达式替换成一个 return 语句。

```js
gen.return(2); // Object {value: 2, done: true}
// 相当于将 let result = yield x + y
// 替换成 let result = return 2;
```

## for…of 循环

for...of 循环可以自动遍历 Generator 函数运行时生成的 Iterator 对象，且此时不再需要调用 next 方法。

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

上面代码使用 for...of 循环，依次显示 5 个 yield 表达式的值。这里需要注意，一旦 next 方法的返回对象的 done 属性为 true，for...of 循环就会中止，且不包含该返回对象，所以上面代码的 return 语句返回的 6，不包括在 for...of 循环之中。

下面是一个利用 Generator 函数和 for...of 循环，实现斐波那契数列的例子。

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}
for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

## Generator 函数的应用

回调函数的写法

```js
function readFilesByCallback() {
  const fs = require("fs");
  const files = [
    "/Users/kitty/testgenerator/1.json",
    "/Users/kitty/testgenerator/2.json",
    "/Users/kitty/testgenerator/3.json",
  ];
  fs.readFile(files[0], function (err, data) {
    console.log(data.toString());
    fs.readFile(files[1], function (err, data) {
      console.log(data.toString());
      fs.readFile(files[2], function (err, data) {
        console.log(data.toString());
      });
    });
  });
}
// 调用
readFilesByCallback();
```

generator 函数的写法

```js
function* readFilesByGenerator() {
  const fs = require("fs");
  const files = [
    "/Users/kitty/testgenerator/1.json",
    "/Users/kitty/testgenerator/2.json",
    "/Users/kitty/testgenerator/3.json",
  ];
  let fileStr = "";
  function readFile(filename) {
    fs.readFile(filename, function (err, data) {
      console.log(data.toString());
      f.next(data.toString());
    });
  }
  yield readFile(files[0]);
  yield readFile(files[1]);
  yield readFile(files[2]);
}
// 调用
const f = readFilesByGenerator();

f.next();
```

缺点：需要在 readFile 函数内部调用生成器 f，不是很优雅，thunk 能把这个耦合能解开来，不用在函数内部调用函数外部的变量

## Thunk 函数

- 求职策略 传值调用，传名调用 sum（x+1，x+2）
  - 传值调用就是在计算 sum 之前先计算 x+1 和 x+2 的值，这 2 个值有了才传入 sum 函数里面计算
  - 传名调用是等函数内部用到 x+1 和 x+2 的时候在计算
- thunk 函数是传名调用的实现方式之一
- 可以实现自动执行 Generator 函数

```js
const fs = require("fs");
const Thunk = function (fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    };
  };
};
const readFileThunk = Thunk(fs.readFile);

function run(fn) {
  var gen = fn();
  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }
  next();
}

const g = function* () {
  const s1 = yield readFileThunk("/Users/kitty/testgenerator/1.json");
  console.log(s1.toString());
  const s2 = yield readFileThunk("/Users/kitty/testgenerator/2.json");
  console.log(s2.toString());
  const s3 = yield readFileThunk("/Users/kitty/testgenerator/3.json");
  console.log(s3.toString());
};

run(g);
```
