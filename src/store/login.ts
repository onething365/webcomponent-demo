import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/login'
import { cookiesStorage } from '@/common/cookie'
export default defineStore('login', {
  state: () => {
    return {
      isLogin: false,
      userInfo: { name: '', id: '' },
    }
  },
  actions: {
    setIsLogin(value: boolean) {
      this.isLogin = value
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },
  },
  persist: {
    // 开启持久存储
    enabled: true,
    // 指定哪些state的key需要进行持久存储
    // storage默认是 sessionStorage存储
    // paths需要持久存储的key
    strategies: [
      { storage: cookiesStorage, key: 'userInfo', paths: ['userInfo'] },
      { storage: cookiesStorage, key: 'isLogin', paths: ['isLogin'] },
    ],
  },
})
