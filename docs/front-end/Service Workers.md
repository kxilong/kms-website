# Service Workers

## 初识 Service Workers

Service Worker（以下简称 sw）是基于 WEB Worker 而来的。

Service Workers 的本质充当 WEB 应用程序、浏览器与网络（可用时）之间的代理服务器，这个 API 旨在创建有效的离线体验，它会拦截网络请求并根据网络是否可用来采取适当的动作，更新来自服务器的资源，它还提供入口推送通知和访问后台同步 API。

### :tomato: service worker 的特点 <Badge text="重要" type="tip"/>

- 网站必须使用 HTTPS，除了本地开发环境（localhost）
- 运行于浏览器，可以控制打开的作用域范围下所有的页面请求，可拦截请求和返回，缓存文件；sw 可以通过 fetch 这个 api，来拦截网络和处理网络请求，再配合 cacheStorage 来实现 web 页面的缓存管理以及与前端 postMessage 通信
- 单独的作用域范围，单独的运行环境和执行环境
- 不能操作页面 DOMM，可以通过是事件机制来处理
- 完全异步，同步 API（如 XHR 和 localStorage）不能再 service work 中使用，sw 大量使用 promise
- 一旦被 install，就永远存在，除非被 uninstall 或者 dev 模式手动删除
- 响应推送
- service worker 是事件驱动的 worker，生命周期与页面无关。 关联页面未关闭时，它也可以退出，没有关联页面时，它也可以启动。

## :tomato: service worker 的生命周期 <Badge text="重要" type="tip"/>

<font color="red">注册 -> 安装 -> 激活 -> 废弃</font>

- installing（安装中）

  这个状态发生在 service worker 注册之后，表示开始安装，同时会进入 service Worker 的 install 事件中，触发 install 的事件回调指定一些静态资源进行离线缓存

- install(安装后)

  安装完成，进入了 waiting 状态，等待其他 Service worker 被关闭，所以当前脚本尚未激活，处于等待中；可以通过 self.skipWaiting()跳过等待

- activating（激活中）

  等待激活，在这个状态下没有被其他的 Servie Worker 控制的客户端，允许当前 worker 完成安装，并且清除了了其他的 worker 以及关联缓存的旧缓存资源（在 acitive 的事件回调中，可以调用 self.clients.claim()）

- activated（激活后）

  在这个状态会处理 actived 事件回调，并且提供处理功能性事件：fetch（请求）、sync（后台同步）、push（推送）

- redundant（废弃）

  表示一个 Service Worker 的生命周期结束

## service worker 的优势

1. 支持离线访问
2. 加载速度快
3. 离线状态下的可用性

就算已经关闭了页面，它也能帮助我们继续发送代理的请求

## service worker 的安全策略

由于 service worker 功能强大，可以修改任何通过它的请求，因此需要对其进行一定的安全限制

1. 使用 https 或者本地的 localhost 才能使用 Service Worker

2. Service Worker 都有一个有限的控制范围，这个范围通过放置 Service Worker 的 js 文件的目录决定的，也就是 Service Worker 所在目录以及所有的子目录。

也可以通过注册 Service Worker 的时候传入一个`scope`选项，用来覆盖默认的作用域，但是只能将作用域的范围缩小，不能将它扩大。

```js
navigator.serviceWorker.register("serviceworker.js", { scope: "/" });
```

## 3.9.1 小试牛刀

源码地址：/Senior-FrontEnd/examples/jsadvanced/3.9

1. 新建 index.html

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document1</title>
  </head>
  <body>
    <div>test1</div>
    <script src="./sw.js"></script>
    <script>
      window.onload = function () {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("./sw.js", { scope: "/" })
            .then((registration) => {
              console.log(
                "ServiceWorker 注册成功！作用域为: ",
                registration.scope
              );
            })
            .catch((err) => {
              console.log("ServiceWorker 注册失败: ", err);
            });
        }
      };
    </script>
  </body>
</html>
```

2. 新建 sw.js

```js
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("cache").then((cache) => {
      // 缓存index.html文件
      return cache.add("./index.html");
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 匹配返回缓存资源
      return caches.match("./index.html");
    })
  );
});
```

3. 启动一个服务

```bash
browser-sync start --server # 在3.9文件夹下
```

4. 打开地址：http://localhost:3000

![](~@/jsasvanced/sw1.png)

5. 关闭服务

关闭刚刚启动的服务，发现照样能访问资源，只不过控制台会出现一行报错`sw.js:1 Uncaught SyntaxError: Unexpected token '<'`

:::tip 查看自己的浏览器上有哪些网站用了 service worker
浏览器访问：chrome://serviceworker-internals/
:::
