<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const login = async () => {
  console.log('login');
   // 登录验证逻辑
   // ...使用登录API等处理登录逻辑
   // 登录成功通知主进程
  //  window.ipcRenderer.send('login-success'); // 
   // 登录成功后，更改路由
  router.push({ name: 'robotIcon' });
};

const logout = () => {
  username.value = '';
  password.value = '';
};

onMounted(async () => {
});

</script>

<template>
  <div id="app">
    <form @submit.prevent="login">
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>

</template>

<style>

</style>
