export default {
  consentModal: {
    title: 'Wir verwenden Cookies',
    description:
      'Diese Website verwendet notwendige Cookies, um ihren ordnungsgemäßen Betrieb sicherzustellen, sowie Tracking-Cookies, um zu verstehen, wie du mit der Seite interagierst. Letztere werden nur nach deiner Zustimmung aktiviert.',
    acceptAllBtn: 'Alle akzeptieren',
    acceptNecessaryBtn: 'Alle ablehnen',
    showPreferencesBtn: 'Individuelle Einstellungen verwalten',
  },
  preferencesModal: {
    title: 'Cookie-Einstellungen verwalten',
    acceptAllBtn: 'Alle akzeptieren',
    acceptNecessaryBtn: 'Alle ablehnen',
    savePreferencesBtn: 'Aktuelle Auswahl übernehmen',
    closeIconLabel: 'Fenster schließen',
    sections: [
      {
        title: 'Verwendung von Cookies',
        description:
          'Wir verwenden Cookies, um die grundlegenden Funktionen der Website sicherzustellen und dein Online-Erlebnis zu verbessern.',
      },
      {
        title: 'Unbedingt notwendige Cookies',
        description:
          'Diese Cookies sind für das korrekte Funktionieren der Website unerlässlich, zum Beispiel für die Benutzer-Authentifizierung.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analytik',
        description:
          'Cookies zur Analyse helfen dabei, Daten zu sammeln, die es den Diensten ermöglichen zu verstehen, wie Nutzer mit einem bestimmten Dienst interagieren. Diese Erkenntnisse helfen, Inhalte zu verbessern und bessere Funktionen zur Optimierung der Nutzererfahrung zu entwickeln.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Name',
            domain: 'Dienst',
            description: 'Beschreibung',
            expiration: 'Ablauf',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie gesetzt von <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Läuft nach 12 Tagen ab',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie gesetzt von <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Session',
            },
          ],
        },
      },
      {
        title: 'Werbung',
        description:
          'Google verwendet Cookies für Werbung, einschließlich der Auslieferung und Darstellung von Anzeigen, Personalisierung von Anzeigen (abhängig von deinen Einstellungen unter <a target="_blank" href="https://g.co/adsettings">g.co/adsettings</a>), Begrenzung der Anzeigefrequenz, Stummschaltung von Anzeigen, die du nicht mehr sehen möchtest, und Messung der Werbewirksamkeit.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Funktionalität',
        description:
          'Cookies für die Funktionalität ermöglichen es Nutzern, mit einem Dienst oder einer Website zu interagieren, um grundlegende Funktionen zu nutzen, wie z.B. die Sprachpräferenz, Produktoptimierungen und die Speicherung von Sitzungsinformationen, z.B. den Inhalt des Warenkorbs.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Sicherheit',
        description:
          'Cookies für die Sicherheit authentifizieren Nutzer, verhindern Betrug und schützen Nutzer während der Interaktion mit dem Dienst.',
        linkedCategory: 'security',
      },
      {
        title: 'Weitere Informationen',
        description:
          'Bei Fragen zur Cookie-Richtlinie und deinen Einstellungen findest du weitere Infos in unserer <a target="_blank" href="https://pawsome-elements.com/en/pp">Datenschutzerklärung</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Ermöglicht die Speicherung (wie Cookies), die sich auf Analysen bezieht, z. B. Besuchsdauer.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Ermöglicht die Speicherung (wie Cookies), die sich auf Werbung bezieht.',
      },
      ad_user_data: {
        label: 'Legt die Zustimmung für das Senden von nutzerbezogenen Werbedaten an Google fest.',
      },
      ad_personalization: {
        label: 'Legt die Zustimmung für personalisierte Werbung fest.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Ermöglicht die Speicherung, die die Funktionalität der Website oder App unterstützt, z. B. Spracheinstellungen.',
      },
      personalization_storage: {
        label: 'Ermöglicht die Speicherung in Bezug auf Personalisierung, z. B. Videoempfehlungen.',
      },
    },
    security: {
      security_storage: {
        label:
          'Ermöglicht die Speicherung im Zusammenhang mit Sicherheit, wie z. B. Authentifizierungsfunktionen, Betrugsprävention und anderem Nutzerschutz.',
      },
    },
  },
};
