import './styles.css';
import type { VueI18n } from 'vue-i18n';
import { defineCustomElement } from 'vue';
import KwokkaAvatarSetup from '@/avatar-setup/KwokkaAvatarSetup.vue';
import KwokkaSimpleAvatarSetup from '@/avatar-setup/KwokkaSimpleAvatarSetup.vue';
import KwokkaAvatar from '@/avatar/KwokkaAvatar.vue';
import KwokkaSimpleAvatar from '@/avatar/KwokkaSimpleAvatar.vue';
import KwokkaSimpleAvatarImage from './avatar/KwokkaSimpleAvatarImage.vue';
import KwokkaAvatarImage from './avatar/KwokkaAvatarImage.vue';
import KwokkaAvatarName from './avatar/KwokkaAvatarName.vue';
import KwokkaAvatarSettings from './avatar-settings/KwokkaAvatarSettings.vue';
import type { KwokkaAvatarStyles } from '@/styles/kwokka-avatar-styles';
import { ErrorCode, KwokkaAvatarError } from '@/errors';

export const WebComponents = {
  KwokkaSimpleAvatar: defineCustomElement(KwokkaSimpleAvatar),
  KwokkaAvatar: defineCustomElement(KwokkaAvatar),
  KwokkaSimpleAvatarImage: defineCustomElement(KwokkaSimpleAvatarImage),
};

export {
  KwokkaAvatarSetup,
  KwokkaSimpleAvatarSetup,
  KwokkaAvatar,
  KwokkaAvatarName,
  KwokkaAvatarImage,
  KwokkaSimpleAvatar,
  KwokkaSimpleAvatarImage,
  KwokkaAvatarSettings,
  type KwokkaAvatarStyles,
  KwokkaAvatarError,
  ErrorCode,
};
