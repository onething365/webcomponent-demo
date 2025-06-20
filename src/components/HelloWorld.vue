<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()
console.log('ss')
const SUCCESSTIP = '执行成功'
const count = ref(0)
const btnName = ref('点击')
const getMsg = () => {
  console.log('getMsg', SUCCESSTIP)
  return 'getMsg'
}
const btnClick = () => {
  console.log('btnClick')
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      console.log('i%2 === 0', i)
    }
  }
  if (count.value > 10) {
    count.value = 0
    console.log('count.value > 10')
    btnName.value = '重新点击'
    getMsg()
  } else {
    count.value++
  }
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" :class="['btn', 'btn-item']" @click="btnClick">
      count is {{ count }} {{ btnName }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  width: 100%;
  height: calc(100% - 10px);
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  flex-direction: column;
}
</style>
