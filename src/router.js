
import home from './pages/home/home.vue'

import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
  // createWebHashHistory
} from 'vue-router'

export function createRouter() {
  return _createRouter({
    history: createWebHistory('/'),
    routes:[
      { path: '/', redirect: '/home' },// 配置默认路由，重定向到/home
      { path: '/home', component: home },
    ]
  })
}