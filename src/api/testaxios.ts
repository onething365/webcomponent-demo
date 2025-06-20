import { UserInfo, loginParam } from '@/types/login'
import axios from '../common/axios'
// 登录
export const login = (data: loginParam) => {
  return axios.post<UserInfo>('/account/login', data)
}
