export default {
  consentModal: {
    title: 'Używamy plików cookie',
    description:
      'Ta strona internetowa używa niezbędnych plików cookie, aby zapewnić jej prawidłowe działanie, oraz plików cookie śledzących, aby zrozumieć, w jaki sposób z niej korzystasz. Te drugie zostaną ustawione dopiero po wyrażeniu zgody.',
    acceptAllBtn: 'Akceptuj wszystkie',
    acceptNecessaryBtn: 'Odrzuć wszystkie',
    showPreferencesBtn: 'Zarządzaj indywidualnymi preferencjami',
  },
  preferencesModal: {
    title: 'Zarządzaj preferencjami plików cookie',
    acceptAllBtn: 'Akceptuj wszystkie',
    acceptNecessaryBtn: 'Odrzuć wszystkie',
    savePreferencesBtn: 'Akceptuj bieżący wybór',
    closeIconLabel: 'Zamknij okno',
    sections: [
      {
        title: 'Użycie plików cookie',
        description:
          'Używamy plików cookie, aby zapewnić podstawowe funkcje strony internetowej i poprawić Twoje doświadczenia online.',
      },
      {
        title: 'Ściśle niezbędne pliki cookie',
        description:
          'Te pliki cookie są niezbędne do prawidłowego funkcjonowania strony, na przykład do uwierzytelniania użytkownika.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analityka',
        description:
          'Pliki cookie używane do analityki pomagają zbierać dane, które umożliwiają usługom zrozumienie, jak użytkownicy wchodzą w interakcję z daną usługą. Te informacje pozwalają ulepszać treści i tworzyć lepsze funkcje poprawiające doświadczenia użytkownika.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Nazwa',
            domain: 'Usługa',
            description: 'Opis',
            expiration: 'Wygaśnięcie',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Plik cookie ustawiony przez <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Wygasa po 12 dniach',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Plik cookie ustawiony przez <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Sesja',
            },
          ],
        },
      },
      {
        title: 'Reklama',
        description:
          'Google używa plików cookie do celów reklamowych, w tym do wyświetlania i renderowania reklam, personalizacji reklam (w zależności od Twoich ustawień reklam na <a href="https://g.co/adsettings">g.co/adsettings</a>), ograniczania liczby wyświetleń reklamy danemu użytkownikowi, wyciszania reklam, których nie chcesz już widzieć, oraz pomiaru skuteczności reklam.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Funkcjonalność',
        description:
          'Pliki cookie używane do funkcjonalności umożliwiają użytkownikom interakcję z usługą lub witryną w celu uzyskania dostępu do funkcji podstawowych dla tej usługi. Do funkcji podstawowych zalicza się preferencje, takie jak wybór języka przez użytkownika, optymalizacje produktu pomagające utrzymać i ulepszyć usługę oraz przechowywanie informacji dotyczących sesji użytkownika, takich jak zawartość koszyka.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Bezpieczeństwo',
        description:
          'Pliki cookie używane do celów bezpieczeństwa uwierzytelniają użytkowników, zapobiegają oszustwom i chronią użytkowników podczas interakcji z usługą.',
        linkedCategory: 'security',
      },
      {
        title: 'Więcej informacji',
        description:
          'W przypadku jakichkolwiek pytań dotyczących polityki plików cookie i Twoich wyborów prosimy o <a href="https://pawsome-elements.com/en/pp">kontakt z nami</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Umożliwia przechowywanie (np. pliki cookie) związane z analityką, np. czas trwania wizyty.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Umożliwia przechowywanie (np. pliki cookie) związane z reklamą.',
      },
      ad_user_data: {
        label: 'Ustawia zgodę na przesyłanie danych użytkownika związanych z reklamą do Google.',
      },
      ad_personalization: {
        label: 'Ustawia zgodę na reklamy personalizowane.',
      },
    },
    functionality: {
      functionality_storage: {
        label: 'Umożliwia przechowywanie wspierające funkcjonalność strony lub aplikacji, np. ustawienia języka.',
      },
      personalization_storage: {
        label: 'Umożliwia przechowywanie związane z personalizacją, np. rekomendacje wideo.',
      },
    },
    security: {
      security_storage: {
        label:
          'Umożliwia przechowywanie związane z bezpieczeństwem, takie jak uwierzytelnianie, zapobieganie oszustwom i ochrona użytkowników.',
      },
    },
  },
};
