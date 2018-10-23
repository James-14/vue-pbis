import request from '@/utils/request'

export function getDictionary(params) {
  return request({
    url: '/api/dictionary/getList',
    method: 'get',
    params: { type: params}
  })
}