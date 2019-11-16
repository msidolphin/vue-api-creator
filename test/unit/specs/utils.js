export function tryCatch(cb = () => {}, msg = '') {
    try {
        cb()
    } catch (e) {
        expect(e.toString()).toMatch(msg)
    }
}

export function spyFn (cb = () => {}) {
    cb()
}

export function createSuccessResponse () {
    return {
        config: {
            method: "get",
            timeout: 0,
            responseType: 'json' 
        },
        data: {code: 200, success: true, msg: "处理成功", data: {msg: 'ok'}},
        headers: {'content-type': "application/json; charset=utf-8", 'content-length': "4326"},
        request: {
            status: 200,
            statusText: "OK",
            timeout: 0,
            withCredentials: true
        },
        status: 200,
        statusText: "OK"
    }
}

export function createFailedResponseDueToNetwork () {
    return {
        config: {
            method: "get",
            timeout: 0,
            responseType: 'json' 
        },
        data: null,
        headers: {'content-type': "application/json; charset=utf-8"},
        request: {
            status: 404,
            statusText: "Not Found",
            timeout: 0,
            withCredentials: true
        },
        status: 404,
        statusText: "Not Found"
    }
}

export function createFailedResponseDueToServer () {
    return {
        config: {
            method: "get",
            timeout: 0,
            responseType: 'json' 
        },
        data: {code: 200, success: false, msg: 'order is closed'},
        headers: {'content-type': "application/json; charset=utf-8"},
        request: {
            status: 200,
            statusText: "OK",
            timeout: 0,
            withCredentials: true
        },
        status: 200,
        statusText: "OK"
    }
}

export const modules = {
    pub: {
        BASE_URL: '/pub',
        api: [
            {
                name: 'list',
                desc: 'list',
                method: 'GET',
                path: 'list'
            },
            {
                name: 'detail',
                desc: 'detail',
                path: 'GET',
                path: 'detail'
            }
        ]
    },
    cms: {
        ad: {
            BASE_URL: '/cms/ad',
            api: [
                {
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: 'list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    path: 'GET',
                    path: 'detail'
                }
            ]
        },
        news: {
            BASE_URL: '/cms/news',
            api: [
                {
                    name: 'list',
                    desc: 'list',
                    method: 'POST',
                    path: 'list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    method: 'GET',
                    path: 'detail'
                },
                {
                    name: 'delete',
                    desc: 'delete',
                    method: 'DELETE',
                    path: 'delete',
                    body: true
                },
                {
                    name: 'post',
                    desc: 'post',
                    method: 'POST',
                    path: 'post',
                    body: ['ids'],
                    params: ['code', 'name']
                }
            ]
        }
    }
}