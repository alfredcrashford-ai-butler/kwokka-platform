import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import '@kwokka/auth-vue/style.css'

const i18n = createI18n({
  messages: {
    'en-US': {
      auth: {
        heading: 'Sign In',
        back: 'Go back',
        or: 'OR',
        successHeading: 'Success!',
        successCaption: 'You are going to be redirected to main page now...',
        email: {
          addCredentialName: 'E-Mail',
          name: 'With E-Mail',
          emailPlaceholder: 'Enter your email',
          passwordPlaceholder: 'Enter your password',
          signIn: 'Sign in',
          forgotPassword: 'Forgot password?',
        },
        anon: {
          name: 'Enter as a guest',
          retry: 'Retry',
        },
        google: {
          name: 'With Google',
          addCredentialName: 'Google',
        },
        discord: {
          name: 'With Discord',
          addCredentialName: 'Discord',
        },
        resetPasswordRequest: {
          heading: 'Reset password',
          description: 'Please, provide your email address in the field above and we will send you the recovery instructions.',
          inputPlaceholder: 'Enter your email',
          submit: 'Submit',
        },
        resetPassword: {
          heading: 'Reset password',
          description: 'Please, provide a new reliable password in the input field below.',
          inputPlaceholder: 'Enter your password',
          submit: 'Submit',
        },
        suggestions: {
          emailValid: 'Email is valid',
          passwordLengthValid: 'Password has 6 to 30 characters',
          passwordHasUppercaseLetter: 'Password has at least one uppercase letter',
          passwordHasLowercaseLetter: 'Password has at least one lowercase letter',
          passwordHasNumber: 'Password has at least one number',
          passwordHasOnlyAllowedCharacters: 'Password has only allowed special characters (!$%&?).',
        },
        addCredentialSubmit: 'Submit',
        conditions: 'By signing in you accept our {0}.',
        conditionsPP: 'Privacy Policy',
      },
    },
  },
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
