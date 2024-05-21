# 手写 Promise

## 先实现整体结构

定义一个模块

```js
// 我们用es5的自执行函数定义模块，如果用AMD规范的需要编译，用自执行函数方便我们一会调用测试
(function (window) {
  function Promise() {}
  window.Promise = Promise;
})(window);
```

基本结构

```js
(function (window) {
  // executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
  function Promise(executor) {}
  /**
   * then方法指定了成功的和失败的回调函数,如果指定的不是函数，会忽略该值
   * 返回一个新的promise对象，该promsie的结果onResolved和onRejected决定，状态由上个Promise决定
   */
  Promise.prototype.then = function (onResolved, onRejected) {};
  /**
   * 传入失败回调
   * 返回一个新的Promise,由于已经捕获错误了，会返回一个成功的Promise
   */
  Promise.prototype.catch = function (OnRejected) {};
  /**
   * 返回一个指定结果成功的promise
   */
  Promise.resolve = function (value) {};
  /**
   * 返回一个指定reason失败的promise
   */
  Promise.reject = function (reason) {};
  /**
   * 返回一个新Promsie
   * 所有的promise成功才成功，有一个失败就失败
   */
  Promise.all = function (promises) {};
  /**
   * 返回一个新Promsie
   * 传入的数组中第一个返回的Promise成功就成功，如果不成功就失败(第一个promise不是你传入的第一个，比如请求接口，最新拿到结果的是第一个)
   */
  Promise.race = function (promises) {};
  window.Promise = Promise;
})(window);
```

## 实现 Promise 内部的 resolve 和 reject

当我们 new promise((resolve,reject)=>{})时会传入一个回调函数，我们这里叫 executor(执行器)，promise 拿到这个方法以后， 调用这个 executor 方法并传入 resolve 和 reject 方法，让用户控制 promise 是成功还是失败；调用 resolve 是成功，调用 reject 是失败。

```js
(function (window) {
  // 常量定义3promise的三个状态
  const PENDING = "pending";
  const FULFILLED = "fulfilled";
  const REJECTED = "rejected";
  // executor执行器，就是我们new Promise((resolve,reject)=>) 传过来的函数，它是同步执行的
  function Promise(executor) {
    // 存一下this，因为代码中调用resolve时，在全局下调用的，此时resolve里面this是window
    // 关于this指向问题，就是谁调用就指向谁，当然也可以用箭头函数处理这个问题
    const self = this;
    self.status = PENDING;
    self.state = undefined; //存传的值
    self.callbackQueues = []; // 存回调队列

    // 让promise成功的函数
    function resolve(value) {
      if (self.status !== PENDING) return;
      self.status = FULFILLED;
      self.state = value;
      /*
      这里会让人感到疑惑？下面是干什么的？
      onResolved是then方法的第一个参数，onRejected是第二个参数
      其实promise用了发布订阅的设计模式，promise把then方法的OnResolved和OnRejected方法存到一个数组里
      不懂没关系，可以看下面的我分析的代码执行步骤
    */
      if (self.callbackQueues.length > 0) {
        self.callbackQueues.map((item) => {
          setTimeout(() => {
            item.onResolved(value);
          });
        });
      }
    }
    // 让promsie失败的函数
    function reject(reason) {
      // 如果不是pending状态，就没必要往下了，因为promise的状态一旦改变就无法在更改
      if (self.status !== PENDING) return;
      self.status = REJECTED;
      self.state = reason;

      if (self.callbackQueues.length > 0) {
        self.callbackQueues.map((item) => {
          setTimeout(() => {
            item.onRejected(value);
          });
        });
      }
    }
    // 捕获executor函数里意外错误，如果错误改变状态
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  /**
   * then方法指定了成功的和失败的回调函数
   * 返回一个新的promise对象
   */
  Promise.prototype.then = function (onResolved, onRejected) {
    const seft = this;
    seft.callbackQueues.push({
      onResolved,
      onRejected,
    });
  };
  window.Promise = Promise;
})(window);
```

## 分析一下代码执行步骤

```js
<script src="./Promise.js"></script>
<script>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    })
  }).then(res => {
    console.log(res)
  })
</script>
```

1. new Promise() 会传入一个回调函数到构造函数 Promise 中，然后执行 Promise 里的代码。
2. 开始就是 const self=this 的执行，这些不是重点，重点是执行 executor(resolve,reject),并传入 resolve 和 reject 函数。
3. 开始执行 executor 函数，函数里执行了 setTimeout，我们知道 setTimeout 是异步执行的，接下来会执行 then 方法。
4. 执行 then 方法并传入了 onResolved 函数，then 方法里把传入的 onResolvedpush 到了 callbackQueues 数组里。
5. 同步的代码执行完了，开始执行异步任务了，显然是指行 setTimeout 里 resovle 方法。
6. 在 resolve 方法里开始判断不是 pending 状态就退出，然后就把状态改成 fulfilled,把传过来的值存到 state 里；然后执行 callbackQueues 里的函数，callbackQueues 里存的 then 方法传回调函数，调用里面的回调把 state 值传进去。

上面代码只是简单的实现了 then 方法，接下来我们具体实现

## 实现 Promise 原型上的 then 方法

我们要先明确 then 方法实现了什么？

1. 返回一个新的 Promsie
2. 新的 promise 的值由上一个 Promsie 的 onResolved 和 onRejected 的结果决定

```js
Promise.prototype.then=function(onResolved,onRejected){
   const self= this
   /*
    我们为什么把判断写到promise里面？

    因为我们需要根据上一个Promsie的状态去改变当前这个返回的promise的状态
    上一个promsie的状态可以根据seft.status拿到，我们要改变返回的这个promise的状态，
    就是调用resolve或reject，我们只有写在promise里面才到调用这两个函数
   */
   return new Promise((resolve,reject)=>{
     // 我们调用then方法的时候 ，promise可能是以下三种状

     // 如果是pending状态，那么说明Promsie内部的resolve还没执行，因为如果执行了，resolve函数会改变状态的
     // 由于resolve函数还未执行，我们也拿不到传过来的值，先把回调函数放到callbackQueues数组中
     if(seft.status===PENDING){
         seft.callbackQueues.push({
               onResolved,
               onRejected
         })

     }else if(seft.status===FULFILLED){
       // 用self.state 拿到当前promsie state的值，把值传递给使用者传入的第一个回调函数
       onResolved(self.state)

     else {
        // 用self.state 拿到当前promsie state的值，把值传递给使用者传入的第二个回调函数
        onRejected(self.state)
       }
   })

 }
```

上面我们实现了，返回一个 promsie，并调用了传递过来的 onResolved 和 onRejected 函数，接下来我们改变这个返回 promise 的状态

```js
 Promise.prototype.then=function(onResolved,onRejected){
    const self= this
    return new Promise((resolve,reject)=>{
      if(seft.status===PENDING){
          seft.callbackQueues.push({
                onResolved,
                onRejected
          })

     // 当前Promise fulfilled状态时
      }else if(seft.status===FULFILLED){
        /*
          const p = new Promise((resolve,reject)=>{resolve(1)})
          p.then((res)=>{
            return 2
             or
            return new Promise((resolve,reject)=>{resolve(2)})
          })
        */
        // 我们调用onResolved拿到函数的返回值，这个返回值，也有可能是一个promise
        const result= onResolved(self.state)
        if(result instance Promise){
          result.then(res=>{ // 调用then方法拿到值
            resolve(res) // 改变返回的这个promise状态为fulfilled，并传入了值
          })
        } else {
            resolve(result) // 改变返回的这个promise状态为fulfilled，并传入了值
        }

      // 当前Promise 为rejected状态时，下面的实现方法跟上面基本一样
      // 为什么我们下面也调用resolve，因为onRejected这个函数中已经捕获了错误
      // 一旦有onRejected函数捕获了错误，错误就不再往下传递，让下一个promise成功！
      else {
          const result= onRejected(self.state)
        if(result instance Promise){
          result.then(res=>{ // 调用then方法拿到值
            resolve(res) // 改变返回的这个promise状态为fulfilled，并传入了值
            })
          } else {
            resolve(result) // 改变返回的这个promise状态为fulfilled，并传入了值
          }
        }
    })

  }
```

把相同的代码封装成一个函数 handle,我们知道 promsie 的 then 的回调函数是异步的，所以 setTimeout 模拟 then 方法的异步问题

```js
Promise.prototype.then=function(onResolved,onRejected){

    const self= this
    return new Promise((resolve,reject)=>{
      // 把相同的代码封装起来,并用try catch捕获错误
      /*
        像这种情况，使用者如果抛出错误，直接让下个promise也就是当前返回的promise状态为失败
       then(res=>{
         throw '我抛出错误'
       })
      */
    function handle (callback){
        try {
           const result= callback(self.state)
            if(result instance Promise){
              result.then(res=>{
                resolve(res)
              })
            } else {
                resolve(result)
          }
         }catch(reason){
          reject(reason)
        }
      }
     // 当前Promise pending状态时
      if(seft.status===PENDING){
          seft.callbackQueues.push({
                onResolved,
                onRejected
          })

     // 当前Promise fulfilled状态时
      }else if(seft.status===FULFILLED){
         setTimeout(()=>{
            handle(onResolved)
         })
      // 当前Promise 为rejected状态时
      else {
        setTimeout(()=>{
           handle(onRejected)
          })
        }
    })
  }
```

then 方法已经实现的差不多了，但是 promise 为 pending 状态时，我们没有去改变返回那个 promise 的状态，改变状态需要调用 resolve 或 reject 然而我们并没有调用

```js
Promise.prototype.then=function(onResolved,onRejected){
  // 如果传入的不是函数，就用默认函数，并把上一个promse的值往下传递
  const onResolved=typeof onResolved ==='fucntion' ? onResolved :(value)=>value
  // 如果传入的不是函数，就给默认函数，并抛出错误，让返回的这个promsie为失败状态
  const onResolved=typeof onRejected ==='fucntion' ? onRejected :(reason)=>{throw reason}

    const self= this
    return new Promise((resolve,reject)=>{

    function handle (callback){
        /*省略*/
      }
     // 当前Promise pending状态时
      if(seft.status===PENDING){
          seft.callbackQueues.push({
                onResolved()=>{
                  handle(onResolved)
                },
                onRejected()=>{
                 handle(onRejected)
              }
          })

      }else if(seft.status===FULFILLED){// 当前Promise fulfilled状态时
        /*省略*/

      else {  // 当前Promise 为rejected状态时
         /*省略*/
        }
    })
  }
```

then 完整代码

```js
/**
 * then方法指定了成功的和失败的回调函数
 * 返回一个新的promise对象，它实现了链式调用
 * 返回的promise的结果由onResolved和onRejected决定
 */
Promise.prototype.then = function (onResolved, onRejected) {
  onResolved = typeof onResolved === "function" ? onResolved : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (reason) => {
          throw reason;
        };
  const seft = this;

  return new Promise((resolve, reject) => {
    function handle(callback) {
      try {
        const result = callback(seft.state);
        if (result instanceof Promise) {
          result.then(
            (res) => {
              resolve(res);
            },
            (err) => {
              reject(err);
            }
          );
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    }
    // 当是Promise状态为pending时候，将onResolved和onRejeactd存到数组中callbackQueues
    if (seft.status === PENDING) {
      seft.callbackQueues.push({
        onResolved(value) {
          handle(onResolved);
        },
        onRejected(reason) {
          handle(onRejected);
        },
      });
    } else if (seft.status === FULFILLED) {
      setTimeout(() => {
        handle(onResolved);
      });
    } else {
      setTimeout(() => {
        handle(onRejected);
      });
    }
  });
};
```

## 实现 promsie 原型的 catch 方法

```js
/**
 * 传入失败回调
 * 返回一个新的Promise
 */
// 第一个参数不传，then里面会有默认参数，传入OnRejected回调函数
// then 方法里会调用OnRejected并传入拒绝的理由
Promise.prototype.catch = function (OnRejected) {
  return this.then(undefined, OnRejected);
};
```

## Promise.resolve

```js
/**
 * Promise函数对象的resove方法
 * 返回一个指定结果成功的promise
 */
// 这个简单 让返回的promise成功就行
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(resolve, reject);
    } else {
      resolve(value);
    }
  });
};
```

## Promise.reject

```js
/**
 *  Promise函数对象的reject方法
 * 返回一个指定reason失败的promise
 */
// 这个简单 让返回的promise失败就行
Promise.reject = function (reason) {
  return new Promise((resove, reject) => {
    reject(reason);
  });
};
```

## Promise.all

```js
/**
 * 所有成功才成功，有一个失败就失败
 * 返回一个的Promise，这个promise的结果由传过来的数组决定，一个失败就是失败
 */
// 这个也不难，循环传入的数组，把成功的promise的返回的值放到results中
// 只有当results和promises长度相同时，说明全部成功，这时候返回一个成功的数组，有一个失败就失败
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let count = 0;

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((result) => {
          results[index] = result;
          count++;

          if (count === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};
```

## Promise.race

```js
/**
 * 第一个成功就成功，如果不成功就失败(就是最先拿到谁的值，就成功)
 * 返回一个Promsie
 */
//  这个简单，只要发现一个promsie成功了，就让返回的promsie成功
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    promises.map((item) => {
      if (item instanceof Promise) {
        item.then(resolve, reject);
      } else {
        resolve(item);
      }
    });
  });
};
```

## 总结

我们要实现 promsie 应该先看 A+规范，上一章有中文的翻版，当然也可以去网上看英文版，那我总结一下重点：

1. promise 用了发布订阅的设计模式。

2. 重点在 then 方法，它实现了返回一个新的 promise，这个 promsie 的状态由上一个 promsie 的状态所决定。

3. 调用 resolve 和 reject 去改变 promise 的状态

   [完整代码](https://github.com/hejialianghe/Senior-FrontEnd/tree/master/examples/jsadvanced/promise)
