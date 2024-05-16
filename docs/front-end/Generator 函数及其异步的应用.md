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
