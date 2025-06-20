/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie'
export const cookiesStorage: any = {
  setItem(key: string, state: any): any {
    if (state === undefined) {
      return
    }
    const myState = JSON.parse(state)
    if (myState[key] instanceof Object) {
      return Cookies.set(key, JSON.stringify(myState[key]))
    }

    return Cookies.set(key, myState[key])
  },
  getItem(key: string): string {
    if (Cookies.get(key) === undefined) {
      return ''
    }
    return JSON.stringify({
      [key]: JSON.parse(Cookies.get(key) as string),
    })
  },
  removeItem(key: string) {
    Cookies.remove(key)
  },
  // clear() {},
}
