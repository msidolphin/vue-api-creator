# vue-api-creator

[![Build Status](https://travis-ci.org/msidolphin/vue-api-creator.svg?branch=master)](https://travis-ci.org/msidolphin/vue-api-creator)
[![Coverage Status](https://coveralls.io/repos/github/msidolphin/vue-api-creator/badge.svg?branch=master)](https://coveralls.io/github/msidolphin/vue-api-creator?branch=master)

> 基于axios以及vue的前端请求工具，便于你的使用和api集中管理

## 使用

### 安装

```bash
npm install vue-api-creator -S
```

### 淘宝镜像
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```

```js
import api from './api'
import ApiCreator from 'vue-api-creator'

Vue.use(ApiCreator, {
  baseURL: '/baseURL'
  modules: api,
  // Response fails if response status is in this list
  permanentErrors: [404, 415, 500, 501, 429],
  beforeRequest (options) {
    console.log(options)
  },
  afterRequest (res) {
    console.log(res)
  },
  onError (err) {
    if (err.isInternalError) {
      console.log('您的网络出了问题')
    } else {
      console.log('服务端返回错误信息')
    }
  },
  mock: 'https://www.xxxx.com'
})
```

### 函数原型
```ts
$api(path: String): Promise
$api(path: String, data?: any): Promise
$api(path: String, data?: any, usingOriginResponse?: Boolean ): Promise
$api(path: String, data?: any, headers?: Object, usingOriginResponse?: Boolean ): Promise
```

### 调用方式
```js
export default {
    created () {
        // 基本使用
        this.$api('app/list').then(res => {
            // ....
        }).catch(err => {
            // ....
        })
        // 传递参数
        this.$api('app/list', {
            a: 1,
            b: 2
        }).then(res => {
            // ....
        }).catch(err => {
            // ....
        })
        // 配置headers
        this.$api('app/list', {}, {
            TOKEN: 'token'
        }).then(res => {
            // ....
        }).catch(err => {
            // ....
        })
        // 在then中使用服务端原始响应数据
        this.$api('app/list', {}, true).then(res => {
            // ....
        }).catch(err => {
            // ....
        })
        // 或者
        this.$api('app/list', {}, {}, true).then(res => {
            // ....
        }).catch(err => {
            // ....
        })
    }
}
```

### Api目录

```js
├──  api
│    │── app
│    │    ├── index.js
│    └── index.js   
```

#### app/index.js
```js
export default {
    BASE_URL: '/sys/app',
    api: [
      {
        name: 'list',
        desc: 'get apps',
        method: 'GET',
        path: 'list',
        mock: true // 开启mock
      }
    ]
}
```

#### api/index.js
```js
import app from './app'

export default {
    app
}
```

### 服务端返回结构

服务端返回结构应该像下面这样：

```
{
  code: Number, // 状态码
  success: Boolean, // 请求是否成功
  msg: String, // 消息
  data: <T> // 响应数据
}
```

### 配置

#### ApiCreator配置

* `baseURL`: 请求基地址. (字符串或函数)
* `modules`: api模块.
* `axios`: axios实例或axios配置.
* `permanentErrors`: 失败状态码列表, 默认: [404, 415, 500, 501, 429].
* `beforeRequest`: 请求发送前的回调函数.
* `afterRequest`: 请求完成后的回调函数.
* `onError`: 当请求失败的回调函数, 例如：请求发送失败或服务端响应错误
* `mock`: mock服务基地址.

#### Api配置

* `name`: api名称.
* `desc`: api的描述.
* `method`: 请求方式.
* `path`: 请求地址.
* `mock`: 是否开启mock.
* `params`: 指定查询字符串参数集 (数组或布尔类型). 例如: params: ['id', 'name'] => /api/xxxx?id=1&name=2
* `body`: 指定请求body参数集 (数组或布尔类型). 例如: body: ['ids', 'names'] => {ids: [1], names: ['a', 'b']}
* `responseType`: response type. 可选值：['', 'arraybuffer', 'blob', 'document', 'json', 'text']. 默认为json

#### 动态请求地址

api配置
```js
{
    name: 'dynamic',
    desc: '动态请求地址',
    method: 'GET',
    path: '/api/v1/{name}/detail/{id}'
}
```

调用
```js
// 最终的请求地址：/api/v1/articles/detail/123456
this.$api('xx/xx/xx/dynamic', {
    name: 'articles',
    id: 123456
}).then(res => {}).catch(e => {})
```


## License
[MIT](http://opensource.org/licenses/MIT)

Copyright © 2019, msidolphin
