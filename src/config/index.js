let debug = process.env.NODE_ENV !== 'production'

let imgDomain
let apiDomain
let domain
if (process.env.NODE_ENV === 'production') {
    imgDomain = 'http://120.79.29.47'
    apiDomain = 'http://example.yunser.com'
    domain = {
        api: 'http://java.api.yunser.com/',
        imgApi: 'http://java.api.yunser.com',
        img1: 'http://img1.yunser.com'
    }
} else {
    imgDomain = 'http://120.79.29.47'
    // apiDomain = 'http://localhost:1030'
    apiDomain = 'http://localhost:1030'
    // apiDomain = 'http://java.api.yunser.com/'
    domain = {
        api: 'http://localhost:1026',
        // api: 'http://java.api.yunser.com/',
        imgApi: 'http://node.api.yunser.com',
        // imgApi: 'http://localhost:1026',
        img1: 'http://img1.yunser.com'
    }
}

module.exports = {
    imgDomain,
    apiDomain,
    debug,
    domain
}
