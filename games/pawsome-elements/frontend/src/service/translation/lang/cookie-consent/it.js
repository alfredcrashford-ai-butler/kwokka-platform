export default {
  consentModal: {
    title: 'Usiamo i cookie',
    description:
      'Questo sito web utilizza cookie essenziali per garantirne il corretto funzionamento e cookie di tracciamento per comprendere come interagisci con esso. Questi ultimi verranno impostati solo dopo il consenso.',
    acceptAllBtn: 'Accetta tutti',
    acceptNecessaryBtn: 'Rifiuta tutti',
    showPreferencesBtn: 'Gestisci preferenze individuali',
  },
  preferencesModal: {
    title: 'Gestisci le preferenze sui cookie',
    acceptAllBtn: 'Accetta tutti',
    acceptNecessaryBtn: 'Rifiuta tutti',
    savePreferencesBtn: 'Accetta selezione attuale',
    closeIconLabel: 'Chiudi finestra',
    sections: [
      {
        title: 'Uso dei cookie',
        description:
          'Utilizziamo i cookie per garantire le funzionalità di base del sito web e migliorare la tua esperienza online.',
      },
      {
        title: 'Cookie strettamente necessari',
        description:
          'Questi cookie sono essenziali per il corretto funzionamento del sito, ad esempio per l’autenticazione degli utenti.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analisi',
        description:
          'I cookie utilizzati per l’analisi aiutano a raccogliere dati che permettono ai servizi di comprendere come gli utenti interagiscono con un determinato servizio. Queste informazioni consentono di migliorare i contenuti e di sviluppare funzionalità migliori che migliorano l’esperienza dell’utente.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Nome',
            domain: 'Servizio',
            description: 'Descrizione',
            expiration: 'Scadenza',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie impostato da <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Scade dopo 12 giorni',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie impostato da <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Sessione',
            },
          ],
        },
      },
      {
        title: 'Pubblicità',
        description:
          'Google utilizza i cookie per la pubblicità, inclusa la pubblicazione e la visualizzazione degli annunci, la personalizzazione degli annunci (a seconda delle tue impostazioni su <a href="https://g.co/adsettings">g.co/adsettings</a>), il limite del numero di volte in cui un annuncio viene mostrato a un utente, la disattivazione degli annunci che hai scelto di non vedere più e la misurazione dell’efficacia degli annunci.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Funzionalità',
        description:
          'I cookie utilizzati per la funzionalità consentono agli utenti di interagire con un servizio o sito per accedere a funzionalità fondamentali. Gli elementi considerati fondamentali includono preferenze come la scelta della lingua da parte dell’utente, ottimizzazioni del prodotto che aiutano a mantenere e migliorare un servizio, e la conservazione di informazioni relative alla sessione dell’utente, come il contenuto di un carrello.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Sicurezza',
        description:
          'I cookie utilizzati per la sicurezza autenticano gli utenti, prevengono le frodi e proteggono gli utenti mentre interagiscono con un servizio.',
        linkedCategory: 'security',
      },
      {
        title: 'Ulteriori informazioni',
        description:
          'Per qualsiasi domanda relativa alla politica sui cookie e alle tue scelte, ti preghiamo di <a href="https://pawsome-elements.com/en/pp">contattarci</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Abilita la memorizzazione (come i cookie) relativa all’analisi, ad esempio la durata della visita.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Abilita la memorizzazione (come i cookie) relativa alla pubblicità.',
      },
      ad_user_data: {
        label: 'Imposta il consenso per l’invio di dati utente relativi alla pubblicità a Google.',
      },
      ad_personalization: {
        label: 'Imposta il consenso per la pubblicità personalizzata.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Abilita la memorizzazione che supporta la funzionalità del sito o app, ad esempio le impostazioni della lingua.',
      },
      personalization_storage: {
        label: 'Abilita la memorizzazione relativa alla personalizzazione, ad esempio le raccomandazioni video.',
      },
    },
    security: {
      security_storage: {
        label:
          'Abilita la memorizzazione relativa alla sicurezza, come funzionalità di autenticazione, prevenzione delle frodi e protezione degli utenti.',
      },
    },
  },
};
