import request from '@/utils/request'

// 添加或者修改
export function saveOrUpdate(data) {
    return request({url: '/role/saveOrUpdate', method: 'post', data})
}

// 分页查询
export function page(data) {
    return request({url: '/role/page', method: 'post', data})
}

// 列表查询
export function list(data) {
    return request({url: '/role/list', method: 'get', data})
}

// 删除
export function deleteById(id) {
    return request({url: '/role/delete/' + id, method: 'get'})
}

// 根据角色id查询已配置菜单
export function menuTree(roleId) {
    return request({url: '/role/menuTree/' + roleId, method: 'get'})
}

// 角色菜单设置
export function setMenu(data) {
    return request({url: '/role/setMenuTree', method: 'post', data})
}

