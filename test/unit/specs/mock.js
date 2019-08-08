import Mock from 'mockjs'

Mock.mock('/api/cms/news/list', 'post', () => {
    return Mock.mock({
        "code": 200,
        "success": true,
        "msg": "ok",
        "data": {
        }
    })
})

Mock.mock('/api/cms/news/detail', 'get', () => {
    return Mock.mock({
        "code": 200,
        "success": false,
        "msg": "resouce is not exists",
        "data": {
        }
    })
})