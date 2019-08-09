# vue-api-creator

> An api manager bases on axios

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