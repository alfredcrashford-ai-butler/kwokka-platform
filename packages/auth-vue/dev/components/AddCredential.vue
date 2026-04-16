<template>
  <KwokkaAuthAddCredential
    v-model:state="state"
    :styles="{
      card: {
        maxWidth: state !== states.Initial ? '480px' : '400px',
        minHeight: state === states.Initial ? '220px' : state === states.EmailPassword ? '450px' : 'auto',
        maxHeight: 'var(--kwk-auth--min-height)',
      },
    }"
    accessToken="1234567890"
    googleClientId="88629253856-igq29svdpqam744u2mchm1ruacp0e4tv.apps.googleusercontent.com"
    endpoint="http://localhost:8081/owl"
    discordClientId="1109571176860229693"
    discordRedirectUri="http://local.kwokka.co:8080/add_credential?callback=discord"
    @created="onCreated($event)"
    @error="onError($event)"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { KwokkaAuthAddCredential, KwokkaAuthAddCredentialState } from '@kwokka/auth-vue';

  const state = ref(
    location.search.includes('callback=discord')
      ? KwokkaAuthAddCredentialState.Callback
      : KwokkaAuthAddCredentialState.Initial,
  );
  const states = ref(KwokkaAuthAddCredentialState);
  const onError = (data) => console.log('error', data);
  const onCreated = (data) => console.log('created', data);
</script>
