import './styles.css';
import type { VueI18n } from 'vue-i18n';
import KwokkaAuth from '@/auth/KwokkaAuth.vue';
import KwokkaAuthAddCredential from '@/add-credential/KwokkaAuthAddCredential.vue';
import type { KwokkaAuthStyles } from '@/styles/kwokka-auth-styles';
import { KwokkaAuthState } from '@/auth/auth-state';
import { AuthService } from '@/service/auth.service';
import { KwokkaAuthAddCredentialState } from '@/add-credential/auth-add-credential-state';
import { KwokkaAuthError } from '@/errors';

export {
  KwokkaAuth,
  KwokkaAuthState,
  type KwokkaAuthStyles,
  AuthService as KwokkaAuthService,
  KwokkaAuthAddCredential,
  KwokkaAuthAddCredentialState,
  KwokkaAuthError,
};
