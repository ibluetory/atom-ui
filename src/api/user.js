import request from '@/utils/request'

// 登录
export function login(data) {
    return request({url: '/user/login', method: 'post', data})
}

// 获取用户信息
export function getInfo() {
    return request({url: '/user/info', method: 'get'})
}

// 退出
export function logout() {
    return request({url: '/user/logout', method: 'post'})
}

// 分页查询
export function page(data) {
    return request({url: '/user/page', method: 'post', data})
}

// 添加或者修改
export function saveOrUpdate(data) {
    return request({url: '/user/saveOrUpdate', method: 'post', data})
}

// 删除
export function deleteById(id) {
    return request({url: '/user/delete/' + id, method: 'get'})
}
