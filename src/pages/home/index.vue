<template>
  <div class="home-container">
    <my-button id="myBtn" v-if="showBtn" color="blue" @btn-click="btnClick">
      <span>按钮</span>
    </my-button>
    <p v-if="showBtn">5秒后消失，显示组件被移除状态</p>
    <div ref="container"></div>
    <!-- <span @click="handleTestClick">test</span>
    <span @click="handleLoginClick">login</span>
    <span @click="handleGetPageClick">{{ loading ? '加载中' : '' }}page</span>
    <HelloWorld msg="22"></HelloWorld> -->
  </div>
</template>
<script lang="ts" setup>
const showBtn = ref(true)
const container = ref(null)
const btnClick = v => {
  console.log('btnClick', v)
}
onMounted(() => {
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  iframe.contentDocument.body.appendChild(document.getElementById('myBtn'))
  setTimeout(() => {
    showBtn.value = false
  }, 5000)
})
// import { useRequest } from 'alova/client'
// import { testMockGetApi, login, getFeedList } from '@/api/testalova'
// const handleTestClick = async () => {
//   const d = await testMockGetApi()
//   console.log(d, 'test')
// }
// const handleLoginClick = async () => {
//   const d = await login({ username: 'test', password: 'test@123' })
//   console.log(d, 'login')
// }
// const {
//   data: feedList,
//   loading,
//   send: getList,
// } = useRequest(getFeedList, {
//   initialData: [],
//   immediate: false,
// })
// const handleGetPageClick = async () => {
//   await getList()
//   console.log(feedList, 'feedList')
// }
</script>
<style lang="scss" scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  .home-content {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>
