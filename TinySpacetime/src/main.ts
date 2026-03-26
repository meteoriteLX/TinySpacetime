import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 导入页面
import CharacterCreation from './views/CharacterCreation.vue'
import MainView from './views/MainView.vue'
import GameView from './views/GameView.vue'

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'CharacterCreation',
      component: CharacterCreation
    },
    {
      path: '/main',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/game',
      name: 'GameView',
      component: GameView
    }
  ]
})

// 创建Pinia
const pinia = createPinia()

// 创建应用
const app = createApp(App)

// 使用插件
app.use(router)
app.use(pinia)

// 挂载应用
app.mount('#app')
