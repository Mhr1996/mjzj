import axios from 'axios'
import qs from 'qs'
import Tool from './tool'


const mainUrl = 'http://mjzj.maiguo01.com'
//1.const mainUrl = 'http://szhshgxmr.app.xiaozhuschool.com'

function getUrl(url) {
    /* 判断传入的url路径是否是http开头 */
    if (url.startsWith('http') || url.startsWith('https')) {
        return url
    }
    /* 不是http开头，进行路径的拼接 */
    return `${mainUrl}${url}`
}

const Http = {
    get: (url, query) => new Promise((resolve, reject) => {
        /* new Promise 是为进行在vue store里面进行异步传值 */
        var path = getUrl(url)
        /* get请求 */
        axios.get(path, {
            params: query
        }).then((res1, error) => {
            if (res1) {
                resolve(res1)
            } else {
                reject(error)
            }
        })
    }),

    post: (url, query , contentType) => new Promise((resolve, reject) => {
        /* new Promise 是为进行在vue store里面进行异步传值 */
        var path = getUrl(url)
        query.token = query.token?query.token:localStorage.getItem('token')
        //2. query.user_id = query.user_id?query.user_id:localStorage.getItem('user_id')
        /* post请求 */
        axios({
            url: path,
            method: 'post',
            data: contentType?query:qs.stringify(query),
            headers: {
                'Content-Type': contentType?contentType:'application/x-www-form-urlencoded' //数据被编码为名称/值对。这是标准的编码格式
            }
        }).then((res1, error) => {
            console.log(res1)
            if (res1) {
                if(res1.data.code==401){
                    let url = window.location.href;
                    Tool.removeStore("token");
                    Tool.setSession("isBinding","false");
                    Tool.setStore('loginStatus', 1);
                    Tool.setSession("windowUrl",window.location.href);
                    window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe6e4e4f4cd0b25a2&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`);
                    return;
                }
                resolve(res1.data)
                console.log('%c' + res1.data.code, 'color:red;');
            } else {
                reject(error)
            }
        })
    }),
    jsonp: (url, query) => new Promise((resolve, reject) => {
        /* new Promise 是为进行在vue store里面进行异步传值 */
        /* new Promise 是为进行在vue store里面进行异步传值 */
        var path = getUrl(url)
        /* get请求 */
        axios.post(path, {
            params: query
        }).then((res1, error) => {
            if (res1) {
                resolve(res1)
            } else {
                reject(error)
            }
        })
    }),
}

export default Http
