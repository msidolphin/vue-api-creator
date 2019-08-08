export default {
    BASE_URL: '',
    api: [
        {
            name: 'list',
            desc: 'get feedback list',
            method: 'GET',
            path: '/pub/feedback/list',
            mock: true
        },
        {
            name: 'error',
            desc: 'response error',
            method: 'GET',
            path: '/error',
            mock: true
        }
    ]
}
