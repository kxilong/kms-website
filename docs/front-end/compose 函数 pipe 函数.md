# compose 函数 pipe 函数

## compose 函数

1. 将需要嵌套执行的函数平铺
2. 嵌套执行指的是一个函数的返回值将作为另一个函数的参数

#### 🍅 案例

计算一个数加 10 在乘以 10

```js
// 一般会这么做
let calculate = (x) => (x + 10) * 10;
console.log(calculate(10));
```

```js
// 用compose函数实现
let add = (x) => x + 10;
let multiply = (y) => y * 10;
console.log(multiply(add(10)));

let compose = function () {
  let args = [].slice.call(arguments);

  return function (x) {
    return args.reduceRight(function (total, current) {
      //从右往左执行args里的函数
      return current(total);
    }, x);
  };
};
let calculate = compose(multiply, add);
console.log(calculate, calculate(10)); // 200

// 用es6实现
const compose =
  (...args) =>
  (x) =>
    args.reduceRight((res, cb) => cb(res), x);
```

## pipe 函数

pipe 函数 compose 类似，只不过从左往右执行
