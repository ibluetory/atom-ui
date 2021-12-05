import request from '@/utils/request'

// 树查询
export function tree() {
    return request({url: '/menu/tree', method: 'get'})
}

// 用户菜单树查询
export function userTree() {
    return request({url: '/menu/userTree', method: 'get'})
}

// 列表查询
export function list(data) {
    return request({url: '/menu/list', method: 'get', data})
}

// 根据id查询
export function getById(id) {
    return request({url: '/menu/' + id, method: 'get'})
}

// 添加或者修改
export function saveOrUpdate(data) {
    return request({url: '/menu/saveOrUpdate', method: 'post', data})
}

// 删除
export function deleteById(id) {
    return request({url: '/menu/delete/' + id, method: 'get'})
}
