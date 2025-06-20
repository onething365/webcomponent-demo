import { defineMock } from '@alova/mock'
const SuccessRes = {
  code: 1000,
  data: null,
  msg: '请求成功!',
}
export default defineMock({
  // get
  '/test': () => {
    return { ...SuccessRes, data: '请求求数据' }
  },
  '[PSOT]/test': ({ query, data }) => {
    console.log(query, data)
    return { ...SuccessRes, data: { id: 1, content: 'test' } }
  },
})
