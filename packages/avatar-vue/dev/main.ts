import { createApp } from 'vue';
import App from './App.vue';
import { createI18n } from 'vue-i18n';
import '@kwokka/avatar-vue/style.css';

const i18n = createI18n({
  messages: {
    'en-US': {
      avatar: {
        setup: {
          description:
            "Set up your public profile - this is how other users will see it. Don't worry, you can change it later!",
          nameLabel: 'Name',
          namePlaceholder: 'Enter your nick name',
          next: 'Next',
          avatarCaption: 'Decorate your public profile, using the arrow buttons below',
        },
        settings: {
          background: 'Background',
          image: 'Image',
          badge: 'Badge',
          confirm: 'Confirm',
          nameLabel: 'Name',
          namePlaceholder: 'Enter your nick name',
        },
      },
    },
  },
});

const app = createApp(App);
app.use(i18n);
app.mount('#app');
