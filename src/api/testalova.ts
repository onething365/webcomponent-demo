import { UserInfo, loginParam } from '@/types/login'
import alova from '../common/alova/index'
// 登录
export const login = (data: loginParam) => {
  return alova.Post<UserInfo>('/account/login', data)
}
export const testMockGetApi = () => {
  return alova.Get('/test')
}
export const getFeedList = (params = { page: 1, page_size: 10 }) => {
  return alova.Get('/feed/list', { params })
}
