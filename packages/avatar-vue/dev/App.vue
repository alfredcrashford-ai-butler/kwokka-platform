<template>
  <div class="app">
    <Icons />
    <template v-if="!state">
      <button @click="state = 'avatar'">Avatar</button>
      <button @click="state = 'setup'">Setup</button>
      <button @click="state = 'simple-setup'">Simple setup</button>
      <button @click="state = 'settings'">Settings</button>
    </template>
    <KwokkaAvatar
      v-if="state === 'avatar'"
      :styles="{
        avatar: {
          maxWidth: '600px',
        },
      }"
      :accessToken="accessToken"
      :accountId="accountId"
      endpoint="http://localhost:8081/capybara"
      @ready="onReady('KwokkaAvatar')"
    />
    <KwokkaSimpleAvatar
      v-if="state === 'avatar'"
      :styles="{
        avatar: {
          maxWidth: '600px',
        },
      }"
      name="x.waffles.x"
      imageKey="carl"
      backgroundKey="asure_scroll"
      badgeKey="pwsm_badge_grandmaster"
      endpoint="http://localhost:8081/capybara"
      @ready="onReady('KwokkaSimpleAvatar')"
    />
    <KwokkaAvatarName
      class="app-avatar-name"
      v-if="state === 'avatar'"
      :accessToken="accessToken"
      :accountId="accountId"
      endpoint="http://localhost:8081/capybara"
      @ready="onReady('KwokkaAvatarName')"
    />
    <KwokkaAvatarImage
      class="app-avatar-image"
      v-if="state === 'avatar'"
      :accessToken="accessToken"
      :accountId="accountId"
      endpoint="http://localhost:8081/capybara"
      @ready="onReady('KwokkaAvatarImage')"
    />
    <KwokkaAvatarSetup
      v-if="state === 'setup'"
      locale="en"
      :styles="{}"
      :accessToken="accessToken"
      endpoint="http://localhost:8081/capybara"
      @profileCreated="onProfileCreated($event)"
      @profileDecorationsCreated="onProfileDecorationsCreated($event)"
      @completed="onCompleted($event)"
      @error="onError($event)"
    />
    <KwokkaSimpleAvatarSetup
      v-if="state === 'simple-setup'"
      locale="en"
      :styles="{}"
      :accessToken="accessToken"
      endpoint="http://localhost:8081/capybara"
      @completed="onCompleted($event)"
      @error="onError($event)"
    />
    <KwokkaAvatarSettings
      v-if="state === 'settings'"
      locale="en"
      :styles="{}"
      :accessToken="accessToken"
      endpoint="http://localhost:8081/capybara"
      @updated="onCompleted($event)"
      @error="onError($event)"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icons from './components/Icons.vue';
  import {
    KwokkaAvatarSetup,
    KwokkaAvatarSettings,
    KwokkaAvatar,
    KwokkaSimpleAvatar,
    KwokkaSimpleAvatarSetup,
    KwokkaAvatarName,
    KwokkaAvatarImage,
  } from '@kwokka/avatar-vue';

  const state = ref(null);
  const accessToken = ref(localStorage.getItem('[kwokka][access_token]'));
  const accountId = ref(1234567890);
  if (accessToken.value) {
    const tokenContent = JSON.parse(atob(accessToken.value.split('.')[1]));
    accountId.value = tokenContent.accountId;
    console.log('accountId', accountId.value);
  }

  const onCompleted = (data) => console.log('completed', data);
  const onProfileCreated = (data) => console.log('profileCreated', data);
  const onProfileDecorationsCreated = (data) => console.log('profileDecorationsCreated', data);
  const onReady = (componentName) => console.log('Ready: ', componentName);
  const onError = (data) => console.log('error', data);
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
    background: linear-gradient(#9677bf, #190039);
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .app-avatar-image {
    width: 200px !important;
    height: auto !important;
  }

  .app-avatar-name {
    color: white;
    font-size: 60px;
  }
</style>
