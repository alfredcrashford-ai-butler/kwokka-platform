(function cookieConsentTranslationsEn() {
  window.KwokkaCookieConsentTranslations = {
    consentModal: {
      title: 'We use cookies',
      description:
        'This website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent.',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      showPreferencesBtn: 'Manage Individual preferences',
    },
    preferencesModal: {
      title: 'Manage cookie preferences',
      acceptAllBtn: 'Accept all',
      acceptNecessaryBtn: 'Reject all',
      savePreferencesBtn: 'Accept current selection',
      closeIconLabel: 'Close modal',
      sections: [
        {
          title: 'Cookie usage',
          description:
            'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.',
        },
        {
          title: 'Strictly necessary cookies',
          description:
            'These cookies are essential for the proper functioning of the website, for example for user authentication.',
          linkedCategory: 'necessary',
        },
        {
          title: 'Analytics',
          description:
            'Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user’s experience.',
          linkedCategory: 'analytics',
          cookieTable: {
            headers: {
              name: 'Name',
              domain: 'Service',
              description: 'Description',
              expiration: 'Expiration',
            },
            body: [
              {
                name: '_ga',
                domain: 'Google Analytics',
                description:
                  'Cookie set by <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: 'Expires after 12 days',
              },
              {
                name: '_gid',
                domain: 'Google Analytics',
                description:
                  'Cookie set by <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
                expiration: 'Session',
              },
            ],
          },
        },
        {
          title: 'Advertising',
          description:
            'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a target="_blank" href="https://g.co/adsettings">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
          linkedCategory: 'advertisement',
        },
        {
          title: 'Functionality',
          description:
            'Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user’s choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user’s session, such as the content of a shopping cart.',
          linkedCategory: 'functionality',
        },
        {
          title: 'Security',
          description:
            'Cookies used for security authenticate users, prevent fraud, and protect users as they interact with a service.',
          linkedCategory: 'security',
        },
        {
          title: 'More information',
          description:
            'For any queries in relation to the policy on cookies and your choices, please refer to out <a target="_blank" href="https://pawsome-elements.com/en/pp">privacy policy</a>.',
        },
      ],
    },
    services: {
      analytics: {
        analytics_storage: {
          label: 'Enables storage (such as cookies) related to analytics e.g. visit duration.',
        },
      },
      advertisement: {
        ad_storage: {
          label: 'Enables storage (such as cookies) related to advertising.',
        },
        ad_user_data: {
          label: 'Sets consent for sending user data related to advertising to Google.',
        },
        ad_personalization: {
          label: 'Sets consent for personalized advertising.',
        },
      },
      functionality: {
        functionality_storage: {
          label: 'Enables storage that supports the functionality of the website or app e.g. language settings.',
        },
        personalization_storage: {
          label: 'Enables storage related to personalization e.g. video recommendations.',
        },
      },
      security: {
        security_storage: {
          label:
            'Enables storage related to security such as authentication functionality, fraud prevention, and other user protection.',
        },
      },
    },
  };
})();
