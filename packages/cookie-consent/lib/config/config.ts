import { CAT_NECESSARY, CAT_ANALYTICS, CAT_ADVERTISEMENT, CAT_FUNCTIONALITY, CAT_SECURITY } from './categories';
import { CookieConsentConfig } from 'vanilla-cookieconsent';

export const config: CookieConsentConfig = {
  categories: {
    [CAT_NECESSARY]: { enabled: true, readOnly: true },
    [CAT_ANALYTICS]: { enabled: true, autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }] } },
    [CAT_ADVERTISEMENT]: { enabled: true },
    [CAT_FUNCTIONALITY]: { enabled: true },
    [CAT_SECURITY]: { enabled: true },
  },
  guiOptions: {
    consentModal: {
      layout: 'cloud',
    },
  },
  language: {
    default: 'en',
    translations: {},
  },
};
