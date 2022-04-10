import { createApp } from 'vue'
import App from './App.vue'
import ElementUI from 'element-plus'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)

app.config.productionTip = false
app.use(ElementUI)

app.mount('#app')
