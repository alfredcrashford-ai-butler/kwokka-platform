export default {
  consentModal: {
    title: 'Usamos cookies',
    description:
      'Este sitio web utiliza cookies esenciales para asegurar su correcto funcionamiento y cookies de seguimiento para entender cómo interactúas con él. Estas últimas se activarán solo con tu consentimiento.',
    acceptAllBtn: 'Aceptar todas',
    acceptNecessaryBtn: 'Rechazar todas',
    showPreferencesBtn: 'Gestionar preferencias individuales',
  },
  preferencesModal: {
    title: 'Gestionar preferencias de cookies',
    acceptAllBtn: 'Aceptar todas',
    acceptNecessaryBtn: 'Rechazar todas',
    savePreferencesBtn: 'Aceptar selección actual',
    closeIconLabel: 'Cerrar ventana',
    sections: [
      {
        title: 'Uso de cookies',
        description:
          'Usamos cookies para asegurar las funcionalidades básicas del sitio web y mejorar tu experiencia en línea.',
      },
      {
        title: 'Cookies estrictamente necesarias',
        description:
          'Estas cookies son esenciales para el correcto funcionamiento del sitio, por ejemplo, para la autenticación de usuarios.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analíticas',
        description:
          'Las cookies usadas para analíticas ayudan a recopilar datos que permiten a los servicios entender cómo los usuarios interactúan con un servicio específico. Esto ayuda a mejorar el contenido y crear mejores funciones para mejorar la experiencia del usuario.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Nombre',
            domain: 'Servicio',
            description: 'Descripción',
            expiration: 'Expiración',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie establecida por <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Expira después de 12 días',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie establecida por <a target="_blank" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Sesión',
            },
          ],
        },
      },
      {
        title: 'Publicidad',
        description:
          'Google utiliza cookies para publicidad, incluyendo mostrar y renderizar anuncios, personalizar anuncios (según tus ajustes en <a target="_blank" href="https://g.co/adsettings">g.co/adsettings</a>), limitar la cantidad de veces que un anuncio se muestra, silenciar anuncios que has elegido dejar de ver y medir la efectividad de los anuncios.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Funcionalidad',
        description:
          'Las cookies de funcionalidad permiten a los usuarios interactuar con un servicio o sitio para acceder a funciones fundamentales, como la preferencia de idioma, optimizaciones del producto y mantener información de la sesión, como el contenido del carrito de compras.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Seguridad',
        description:
          'Las cookies usadas para seguridad autentican usuarios, previenen fraudes y protegen a los usuarios durante su interacción con el servicio.',
        linkedCategory: 'security',
      },
      {
        title: 'Más información',
        description:
          'Para cualquier consulta relacionada con la política de cookies y tus elecciones, por favor consulta nuestra <a target="_blank" href="https://pawsome-elements.com/en/pp">política de privacidad</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label:
          'Permite el almacenamiento (como cookies) relacionado con analíticas, por ejemplo, duración de la visita.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Permite el almacenamiento (como cookies) relacionado con publicidad.',
      },
      ad_user_data: {
        label: 'Establece el consentimiento para enviar datos de usuario relacionados con publicidad a Google.',
      },
      ad_personalization: {
        label: 'Establece el consentimiento para publicidad personalizada.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Permite el almacenamiento que soporta la funcionalidad del sitio o app, por ejemplo, configuraciones de idioma.',
      },
      personalization_storage: {
        label: 'Permite el almacenamiento relacionado con personalización, por ejemplo, recomendaciones de vídeo.',
      },
    },
    security: {
      security_storage: {
        label:
          'Permite el almacenamiento relacionado con la seguridad, como funcionalidades de autenticación, prevención de fraudes y protección del usuario.',
      },
    },
  },
};
