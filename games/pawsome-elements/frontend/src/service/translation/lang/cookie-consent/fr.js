export default {
  consentModal: {
    title: 'Nous utilisons des cookies',
    description:
      "Ce site utilise des cookies essentiels pour garantir son bon fonctionnement et des cookies de suivi pour comprendre comment vous interagissez avec lui. Ces derniers ne seront activés qu'après votre consentement.",
    acceptAllBtn: 'Tout accepter',
    acceptNecessaryBtn: 'Tout refuser',
    showPreferencesBtn: 'Gérer les préférences individuelles',
  },
  preferencesModal: {
    title: 'Gérer les préférences de cookies',
    acceptAllBtn: 'Tout accepter',
    acceptNecessaryBtn: 'Tout refuser',
    savePreferencesBtn: 'Accepter la sélection actuelle',
    closeIconLabel: 'Fermer la fenêtre modale',
    sections: [
      {
        title: 'Utilisation des cookies',
        description:
          'Nous utilisons des cookies pour assurer les fonctionnalités de base du site et améliorer votre expérience en ligne.',
      },
      {
        title: 'Cookies strictement nécessaires',
        description:
          'Ces cookies sont essentiels au bon fonctionnement du site, par exemple pour l’authentification des utilisateurs.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analyse',
        description:
          'Les cookies utilisés à des fins d’analyse aident à collecter des données permettant aux services de comprendre comment les utilisateurs interagissent avec un service particulier. Ces informations permettent d’améliorer le contenu et de développer de meilleures fonctionnalités qui améliorent l’expérience utilisateur.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Nom',
            domain: 'Service',
            description: 'Description',
            expiration: 'Expiration',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie défini par <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Expire après 12 jours',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie défini par <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Session',
            },
          ],
        },
      },
      {
        title: 'Publicité',
        description:
          'Google utilise des cookies à des fins publicitaires, notamment pour diffuser et afficher des annonces, personnaliser les annonces (en fonction de vos paramètres publicitaires sur <a href="https://g.co/adsettings">g.co/adsettings</a>), limiter le nombre de fois qu\'une annonce est affichée à un utilisateur, masquer les annonces que vous avez choisi de ne plus voir et mesurer l\'efficacité des annonces.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Fonctionnalité',
        description:
          "Les cookies utilisés pour la fonctionnalité permettent aux utilisateurs d’interagir avec un service ou un site pour accéder à des fonctionnalités fondamentales de ce service. Ces éléments incluent les préférences telles que le choix de la langue de l’utilisateur, les optimisations du produit qui aident à maintenir et à améliorer un service, et la conservation des informations relatives à la session de l’utilisateur, telles que le contenu d'un panier.",
        linkedCategory: 'functionality',
      },
      {
        title: 'Sécurité',
        description:
          "Les cookies utilisés pour la sécurité authentifient les utilisateurs, préviennent la fraude et protègent les utilisateurs lorsqu'ils interagissent avec un service.",
        linkedCategory: 'security',
      },
      {
        title: "Plus d'informations",
        description:
          'Pour toute question concernant la politique sur les cookies et vos choix, veuillez <a href="https://pawsome-elements.com/en/pp">nous contacter</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Permet le stockage (comme les cookies) lié à l’analytique, par exemple la durée de visite.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Permet le stockage (comme les cookies) lié à la publicité.',
      },
      ad_user_data: {
        label: 'Permet de définir le consentement pour l’envoi des données utilisateur liées à la publicité à Google.',
      },
      ad_personalization: {
        label: 'Permet de définir le consentement pour la publicité personnalisée.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Permet le stockage supportant la fonctionnalité du site ou de l’application, par exemple les réglages de langue.',
      },
      personalization_storage: {
        label: 'Permet le stockage lié à la personnalisation, par exemple les recommandations vidéo.',
      },
    },
    security: {
      security_storage: {
        label:
          'Permet le stockage lié à la sécurité, comme l’authentification, la prévention de la fraude et la protection des utilisateurs.',
      },
    },
  },
};
