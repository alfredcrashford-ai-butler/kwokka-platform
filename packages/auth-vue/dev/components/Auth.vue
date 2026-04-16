<template>
  <KwokkaAuth
    v-model:state="state"
    hcaptchakey="52d35ed3-08de-439e-b276-2529630f6b53"
    :styles="{
      card: {
        maxWidth: state !== states.Initial ? '480px' : '400px',
        minHeight:
          state === states.Initial
            ? '414px'
            : state === states.SignInAnonymous
            ? '238px'
            : state === states.SignInEmailPassword
            ? '552px'
            : state === states.ResetPasswordRequest
            ? '316px'
            : state === states.ResetPassword
            ? '474px'
            : 'auto',
        maxHeight: 'var(--kwk-auth--min-height)',
      },
    }"
    endpoint="http://localhost:8081/owl"
    :resetPasswordToken="resetPasswordToken"
    googleClientId="88629253856-igq29svdpqam744u2mchm1ruacp0e4tv.apps.googleusercontent.com"
    discordClientId="1109571176860229693"
    discordRedirectUri="http://local.kwokka.co:8080/auth?callback=discord"
    @signin="onSignin($event)"
    @ppclick="onPpclick($event)"
    @error="onError($event)"
    @resetRequested="onResetRequested($event)"
    @resetCompleted="onResetCompleted($event)"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { KwokkaAuth, KwokkaAuthState } from '@kwokka/auth-vue';

  const state = ref(window.location.search.includes('callback=') ? KwokkaAuthState.Callback : KwokkaAuthState.Initial);
  const resetPasswordToken = ref(null);
  const states = ref(KwokkaAuthState);
  const onSignin = (data) => console.log('signIn', data);
  const onPpclick = (data) => console.log('ppClick', data);
  const onResetCompleted = (data) => console.log('resetCompleted', data);
  const onError = (error) => {
    console.log(`Got error\n\nMessage: ${error.message}\nCode: ${error.code}\nData: ${error.data}`);
  };
  const onResetRequested = (data) => {
    console.log('resetRequested', data);
    state.value = KwokkaAuthState.ResetPassword;
    resetPasswordToken.value = (Math.random() * 10000).toFixed(0);
  };
</script>
