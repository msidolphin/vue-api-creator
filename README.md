# vue-api-creator

[![Build Status](https://travis-ci.org/msidolphin/vue-api-creator.svg?branch=master)](https://travis-ci.org/msidolphin/vue-api-creator)
[![Coverage Status](https://coveralls.io/repos/github/msidolphin/vue-api-creator/badge.svg?branch=master)](https://coveralls.io/github/msidolphin/vue-api-creator?branch=master)

> An api manager bases on axios

[中文文档](./README_CN.md)

## Usage

### Install

```bash
npm install vue-api-creator -S
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
      console.log('An exception has occurred on your network')
    } else {
      console.log('An error response from server')
    }
  },
  mock: 'https://www.xxxx.com'
})
```

### Use
```js
export default {
    created () {
        this.$api('app/list').then(res => {
            // ....
        }).catch(err => {
            // ....
        })
    }
}
```

### Api directory

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
        mock: true // enable mock
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

### Server Response Structure

Your server response body shoule be like this:

```
{
  code: Number, // status code
  success: Boolean, // whether the response was successful 
  msg: String, // response message
  data: <T> // response data
}
```

### Configuration

#### ApiCreator config

* `baseURL`: The base URL of the request. (String or Function)
* `modules`: Api modules.
* `axios`: axios instance.
* `permanentErrors`: Response fails if response status is in this list, default: [404, 415, 500, 501, 429].
* `beforeRequest`: Called before the request is sent.
* `afterRequest`: Called after the request was received.
* `onError`: An error occurred during send request or server response, eg: status code in permanentErrors, the request was made but no response was received...
* `mock`: The base URL of the mock server.

#### Api config

* `name`: It is api's name.
* `desc`: The description of the api.
* `method`: The request method to be used when making the request.
* `path`: It is the server URL that will be used for the request.
* `mock`: Enable mock to the request.
* `params`: query params (Array or Boolean). eg: params: ['id', 'name'] => /api/xxxx?id=1&name=2
* `body`: body params (Array or Boolean). eg: body: ['ids', 'names'] => {ids: [1], names: ['a', 'b']}

## License
[MIT](http://opensource.org/licenses/MIT)

Copyright © 2019, msidolphin
