import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue'; 
import Robot from '../views/Robot.vue'; 

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/robot',
    name: 'robot',
    component: Robot,
  },
  // ...其他路由
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
