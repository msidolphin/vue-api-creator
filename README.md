# vue-api-manager

> An api manager bases on Vue and Element-UI

## Usage

### Install

```bash
npm install vue-api-manager -S
```

```js
import api from './api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ApiCreator from '../dist'

Vue.use(ElementUI)
Vue.use(ApiCreator, {
  modules: api,
  beforeRequest (options) {
    console.log(options)
  },
  axios: {
    baseURL: '/base-url'
  },
  mock: 'mock address'
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
        desc: 'get app list',
        method: 'GET',
        path: 'list',
        mock: false
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