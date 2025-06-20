import { createAlovaMockAdapter, MockRequestInit } from '@alova/mock'
import {
  axiosRequestAdapter,
  axiosMockResponse,
  AlovaAxiosRequestConfig,
} from '@alova/adapter-axios'
import type { AxiosResponse, AxiosResponseHeaders, AxiosHeaders } from 'axios'
import testGroup from '@/mock/test'
import axios from '../axios'

const mockAdapter = createAlovaMockAdapter([testGroup], {
  // 全局控制是否启用mock接口，默认为true
  enable: true,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: axiosRequestAdapter({
    axios: axios.axiosInstance,
  }),
  // mock接口响应延迟，单位毫秒
  delay: 1000,
  // 是否打印mock接口请求信息
  mockRequestLogger: true,
  // axiosMockResponse中包含了onMockResponse和onMockError
  // 用于将模拟数据转换为AxiosResponse和AxiosError兼容的格式
  ...(axiosMockResponse as MockRequestInit<
    AlovaAxiosRequestConfig,
    AxiosResponse<any, any>,
    AxiosResponseHeaders
  >),
  onMockResponse(response) {
    return {
      response: response.body,
      headers: {} as AxiosHeaders,
    }
  },
})
export default mockAdapter
