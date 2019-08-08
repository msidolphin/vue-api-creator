import Vue from 'vue'
import { modules } from './utils'
import ApiCreator from '@/index'
import './mock'

describe('index.js', () => {

    it('install', () => {
        Vue.use(ApiCreator, {
            axios: {
                baseURL: '/api'
            },
            modules
        })
        expect('$api' in Vue.prototype).toBeTruthy()
    })

    it('request successfully', async () => {
        Vue.use(ApiCreator, {
            axios: {
                baseURL: '/api'
            },
            modules
        })
        await Vue.prototype.$api('cms/news/list', {a: 1})
    })

    it('request failed', async () => {
        Vue.use(ApiCreator, {
            axios: {
                baseURL: '/api'
            },
            modules
        })
        try {
            await Vue.prototype.$api('cms/ad/list')
        } catch(e) {
            expect(true).toBeTruthy()
        }
    })

    it('server response failed', async () => {
        Vue.use(ApiCreator, {
            axios: {
                baseURL: '/api'
            },
            modules
        })
        try {
            let resp = await Vue.prototype.$api('cms/news/detail')
        } catch(e) {
            expect(true).toBeTruthy()
        }
    })
})