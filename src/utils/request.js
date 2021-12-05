import axios from 'axios'
import {Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

const service = axios.create({
    timeout: 10000
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['authorization'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code === -1) {
            Message({
                message: res.msg || '服务器请求异常',
                type: 'error'
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else if (res.code === 3005) {
            Message({
                message: '用户不存在或账号密码错误',
                type: 'error'
            })
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },

    error => {
        if (error.response.status === 400) {
            Message({
                message: error.response.data || "参数错误, 请仔细核对",
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(error)
        }else if (error.response.status === 401) {
            Message({
                message: "用户信息已过期, 请重新登录",
                type: 'error',
                duration: 5 * 1000
            })

            // 返回401则退出
            store.dispatch('user/logout')
            return Promise.reject(error)
        } else {
            Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
            })
            return Promise.reject(error)
        }
    }
)

export default service
