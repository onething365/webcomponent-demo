/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, Method, ResponseType, AxiosPromise, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>
// import qs from 'qs'

export const serverDefaultCfg = {
  baseURL: import.meta.env.VITE_SERVER_HOST, // 请求基础地址,可根据环境自定义
  useTokenAuthorization: true, // 是否开启 token 认证
}
// 创建 axios 请求实例
const axiosInstance: AxiosInstance = axios.create({
  baseURL: serverDefaultCfg.baseURL, // 基础请求地址
  timeout: 30000, // 请求超时设置
  withCredentials: true, // 跨域请求是否需要携带 cookie
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  validateStatus: status => {
    return status === 200 || status === 401 // 默认的
  },
})

// 创建请求拦截
axiosInstance.interceptors.request.use(
  config => {
    // 增加session头
    const inConfig = config
    if (config.method !== 'get') {
      inConfig.headers['X-CSRFToken'] = Cookies.get('csrftoken')
    }
    return inConfig
  },
  error => {
    Promise.reject(error)
  },
)
type ResponseDataType<T> = {
  code: string | null
  data: T
  msg: string | null
}
// 创建响应拦截
axiosInstance.interceptors.response.use(
  <T>(res: AxiosResponse): AxiosPromise<ResponseDataType<T>> => {
    const { data, status } = res
    // 处理登录逻辑
    if (status === 401) {
      Cookies.remove('isLogin')
      Cookies.remove('userInfo')
      window.location.href = '/login'
      return data
    }
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data
  },
  error => {
    let message = ''
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          message = '接口重定向了！'
          break
        case 400:
          message = '参数不正确！'
          break
        case 401:
          message = '您未登录，或者登录已经超时，请先登录！'
          break
        case 403:
          message = '您没有权限操作！'
          break
        case 404:
          message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          message = '请求超时！'
          break
        case 409:
          message = '系统已存在相同数据！'
          break
        case 500:
          message = '服务器内部错误！'
          break
        case 501:
          message = '服务未实现！'
          break
        case 502:
          message = '网关错误！'
          break
        case 503:
          message = '服务不可用！'
          break
        case 504:
          message = '服务暂时无法访问，请稍后再试！'
          break
        case 505:
          message = 'HTTP 版本不受支持！'
          break
        default:
          message = '异常问题，请联系管理员！'
          break
      }
    }
    return Promise.reject(message)
  },
)
/**
 * 核心函数，可通过它处理一切请求数据，并做横向扩展
 * @param {url} 请求地址
 * @param {params} 请求参数
 * @param {options} 请求配置，针对当前本次请求；
 */
function commonRequest<T>(
  url: string,
  params: any,
  method: RequestMethods,
  options = { error: true, responseType: 'json' } as any,
): Promise<T> {
  let data: any = { params }
  // post请求使用data字段
  if (method !== 'get') data = { data: params }
  return axiosInstance({
    url: url,
    method,
    ...data,
    responseType: options.responseType as ResponseType,
  })
}

// 封装GET请求
const get = async <T>(url: string, params: any, options?: any): Promise<ResponseDataType<T>> => {
  return await commonRequest<ResponseDataType<T>>(url, params, 'get', options)
}
// 封装POST请求
const post = <T>(url: string, params: any, options?: any) => {
  return commonRequest<ResponseDataType<T>>(url, params, 'post', options)
}

const put = async <T>(url: string, params: any, options?: any): Promise<ResponseDataType<T>> => {
  return await commonRequest<ResponseDataType<T>>(url, params, 'put', options)
}

const del = async <T>(url: string, params: any, options?: any): Promise<ResponseDataType<T>> => {
  return await commonRequest<ResponseDataType<T>>(url, params, 'delete', options)
}
export default { get, post, put, del, axiosInstance }
