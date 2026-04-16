<template>
  <div class="app">
    <Icons />
    <div>
      <button @click="state = 'auth'">Auth</button>
      <button @click="state = 'add_credential'">Add credential</button>
    </div>
    <Auth v-if="state === 'auth'" />
    <AddCredential v-if="state === 'add_credential'" />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icons from './components/Icons.vue';
  import Auth from './components/Auth.vue';
  import AddCredential from './components/AddCredential.vue';

  const state = ref(window.location.pathname === '/auth' ? 'auth' : window.location.pathname === '/add_credential' ? 'add_credential' : '');
</script>

<style>
  body {
    box-sizing: border-box;
    margin: 0;
    height: 100vh;
    width: 100vw;
  }
  #app {
    height: 100vh;
    width: 100vw;
  }
  .app {
    background-color: #190039;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
