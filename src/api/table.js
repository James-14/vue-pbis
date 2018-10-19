import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/user/userList',
    method: 'get',
    params
  })
}