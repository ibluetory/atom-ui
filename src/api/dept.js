import request from '@/utils/request'

// 树查询
export function tree() {
    return request({url: '/dept/tree', method: 'get'})
}

// 列表查询
export function list(data) {
    return request({url: '/dept/list', method: 'get', data})
}

// 根据id查询
export function getById(id) {
    return request({url: '/dept/' + id, method: 'get'})
}

// 添加或者修改
export function saveOrUpdate(data) {
    return request({url: '/dept/saveOrUpdate', method: 'post', data})
}

// 删除
export function deleteById(id) {
    return request({url: '/dept/delete/' + id, method: 'get'})
}
