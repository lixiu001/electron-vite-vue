<script setup lang="ts">
import { onMounted, ref } from 'vue';
const username = ref('');
const password = ref('');

const login = async () => {
   // 登录验证逻辑
   // 登录成功通知主进程
   window.ipcRenderer.send('login-success'); // 
};

const logout = () => {
  username.value = '';
  password.value = '';
};

onMounted(async () => {
  // const autoLoginResult = await window.electronAPI.autoLogin();
  // if (autoLoginResult.success) {
  //   username.value = autoLoginResult.credentials.username;
  //   password.value = autoLoginResult.credentials.password;
  // }
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
