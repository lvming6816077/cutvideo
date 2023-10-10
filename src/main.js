import { createApp } from 'vue'
import { createRouter } from './router'
import App from './App.vue'
import store from './store/store.js'
import './assets/reset.css'

const router = createRouter()

const app = createApp(App)

app.use(router)
app.use(store)

app.mount('#app')
