import { createApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'
import './assets/reset.css'

const router = createRouter()

const app = createApp(App)
app.use(router)

app.mount('#app')
