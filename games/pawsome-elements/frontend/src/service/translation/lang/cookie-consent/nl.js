export default {
  consentModal: {
    title: 'Wij gebruiken cookies',
    description:
      'Deze website gebruikt essentiële cookies om de goede werking te garanderen en trackingcookies om te begrijpen hoe je ermee omgaat. De laatstgenoemde worden alleen geplaatst na toestemming.',
    acceptAllBtn: 'Alles accepteren',
    acceptNecessaryBtn: 'Alles weigeren',
    showPreferencesBtn: 'Individuele voorkeuren beheren',
  },
  preferencesModal: {
    title: 'Cookievoorkeuren beheren',
    acceptAllBtn: 'Alles accepteren',
    acceptNecessaryBtn: 'Alles weigeren',
    savePreferencesBtn: 'Huidige selectie accepteren',
    closeIconLabel: 'Venster sluiten',
    sections: [
      {
        title: 'Gebruik van cookies',
        description:
          'Wij gebruiken cookies om de basisfunctionaliteiten van de website te waarborgen en om je online ervaring te verbeteren.',
      },
      {
        title: 'Strikt noodzakelijke cookies',
        description:
          'Deze cookies zijn essentieel voor de juiste werking van de website, bijvoorbeeld voor gebruikersauthenticatie.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analytics',
        description:
          'Cookies die voor analytics worden gebruikt helpen bij het verzamelen van gegevens waarmee diensten kunnen begrijpen hoe gebruikers met een bepaalde dienst omgaan. Deze inzichten stellen diensten in staat om zowel de inhoud te verbeteren als betere functies te ontwikkelen die de gebruikerservaring verbeteren.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Naam',
            domain: 'Dienst',
            description: 'Beschrijving',
            expiration: 'Verloopdatum',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie ingesteld door <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Verloopt na 12 dagen',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie ingesteld door <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Sessie',
            },
          ],
        },
      },
      {
        title: 'Advertenties',
        description:
          'Google gebruikt cookies voor advertenties, waaronder het tonen en weergeven van advertenties, personaliseren van advertenties (afhankelijk van je advertentie-instellingen op <a href="https://g.co/adsettings">g.co/adsettings</a>), beperken van het aantal keren dat een advertentie aan een gebruiker wordt getoond, dempen van advertenties die je niet meer wilt zien, en meten van de effectiviteit van advertenties.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Functionaliteit',
        description:
          'Cookies die voor functionaliteit worden gebruikt, stellen gebruikers in staat om te communiceren met een dienst of site om toegang te krijgen tot functies die fundamenteel zijn voor die dienst. Dingen die als fundamenteel worden beschouwd, zijn onder andere voorkeuren zoals de taalkeuze van de gebruiker, productoptimalisaties die helpen om een dienst te onderhouden en te verbeteren, en het behouden van informatie met betrekking tot de sessie van een gebruiker, zoals de inhoud van een winkelwagen.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Beveiliging',
        description:
          'Cookies die voor beveiliging worden gebruikt, authenticeren gebruikers, voorkomen fraude en beschermen gebruikers terwijl ze interactie hebben met een dienst.',
        linkedCategory: 'security',
      },
      {
        title: 'Meer informatie',
        description:
          'Voor vragen met betrekking tot het cookiebeleid en je keuzes, neem dan <a href="https://pawsome-elements.com/en/pp">contact met ons op</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Maakt opslag mogelijk die verband houdt met analyse, zoals cookies, bijv. bezoektijd.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Maakt opslag mogelijk die verband houdt met reclame, zoals cookies.',
      },
      ad_user_data: {
        label:
          'Stelt toestemming in voor het verzenden van gebruikersgegevens die verband houden met reclame naar Google.',
      },
      ad_personalization: {
        label: 'Stelt toestemming in voor gepersonaliseerde reclame.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Maakt opslag mogelijk die de functionaliteit van de website of app ondersteunt, bijv. taalinstellingen.',
      },
      personalization_storage: {
        label: 'Maakt opslag mogelijk die verband houdt met personalisatie, bijv. video-aanbevelingen.',
      },
    },
    security: {
      security_storage: {
        label:
          'Maakt opslag mogelijk die verband houdt met beveiliging, zoals authenticatiefuncties, fraudepreventie en gebruikersbescherming.',
      },
    },
  },
};
