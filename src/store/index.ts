import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
import useLoginStore from './login'
const pinia = createPinia()
pinia?.use(piniaPersist)
export { useLoginStore }
export default pinia
