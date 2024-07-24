import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import './style.css'
// import './demos/ipc'
// import './demos/node'

createApp(App)
  .use(router)
  .mount('#app')

