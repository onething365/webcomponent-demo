import { createApp } from 'vue'
import './style.scss'
import MyButton from '@/webcomponents/my-button'
import App from './App.vue'
import { router } from './router/index'
import pinia from './store'
customElements.define('my-button', MyButton)

const app = createApp(App)
app.use(pinia).use(router)
app.mount('#app')
