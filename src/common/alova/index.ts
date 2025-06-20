import { createAlova } from 'alova'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import VueHook from 'alova/vue'
import axios from '../axios'
import mockAdapter from './mockAdapter'
const isDev = import.meta.env.MODE === 'development'
const alovaInstance = createAlova({
  requestAdapter: isDev
    ? mockAdapter
    : axiosRequestAdapter({
        axios: axios.axiosInstance,
      }),
  statesHook: VueHook,
})

export default alovaInstance
