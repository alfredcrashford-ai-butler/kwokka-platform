export default {
  consentModal: {
    title: 'Nós usamos cookies',
    description:
      'Este site utiliza cookies essenciais para garantir seu funcionamento adequado e cookies de rastreamento para entender como você interage com ele. Estes últimos só serão definidos após o seu consentimento.',
    acceptAllBtn: 'Aceitar todos',
    acceptNecessaryBtn: 'Rejeitar todos',
    showPreferencesBtn: 'Gerenciar preferências individuais',
  },
  preferencesModal: {
    title: 'Gerenciar preferências de cookies',
    acceptAllBtn: 'Aceitar todos',
    acceptNecessaryBtn: 'Rejeitar todos',
    savePreferencesBtn: 'Aceitar seleção atual',
    closeIconLabel: 'Fechar modal',
    sections: [
      {
        title: 'Uso de cookies',
        description:
          'Utilizamos cookies para garantir as funcionalidades básicas do site e para aprimorar sua experiência online.',
      },
      {
        title: 'Cookies estritamente necessários',
        description:
          'Esses cookies são essenciais para o funcionamento adequado do site, por exemplo, para autenticação do usuário.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Análise',
        description:
          'Os cookies usados para análise ajudam a coletar dados que permitem que os serviços entendam como os usuários interagem com um determinado serviço. Essas informações permitem melhorar o conteúdo e criar melhores funcionalidades que aprimoram a experiência do usuário.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Nome',
            domain: 'Serviço',
            description: 'Descrição',
            expiration: 'Expiração',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie definido por <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Expira após 12 dias',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie definido por <a href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Sessão',
            },
          ],
        },
      },
      {
        title: 'Publicidade',
        description:
          'O Google usa cookies para publicidade, incluindo veiculação e exibição de anúncios, personalização de anúncios (dependendo das suas configurações de anúncios em <a href="https://g.co/adsettings">g.co/adsettings</a>), limitação do número de vezes que um anúncio é exibido para um usuário, silenciamento de anúncios que você optou por não ver mais e medição da eficácia dos anúncios.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'Funcionalidade',
        description:
          'Os cookies usados para funcionalidade permitem que os usuários interajam com um serviço ou site para acessar recursos que são fundamentais para esse serviço. Isso inclui preferências como a escolha de idioma do usuário, otimizações de produto que ajudam a manter e melhorar um serviço, e manutenção de informações relacionadas à sessão do usuário, como o conteúdo de um carrinho de compras.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Segurança',
        description:
          'Os cookies usados para segurança autenticam usuários, previnem fraudes e protegem os usuários enquanto interagem com um serviço.',
        linkedCategory: 'security',
      },
      {
        title: 'Mais informações',
        description:
          'Para quaisquer dúvidas relacionadas à política de cookies e suas escolhas, por favor <a href="https://pawsome-elements.com/en/pp">entre em contato conosco</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Permite o armazenamento (como cookies) relacionado à análise, por exemplo, duração da visita.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Permite o armazenamento (como cookies) relacionado à publicidade.',
      },
      ad_user_data: {
        label: 'Define o consentimento para envio de dados do usuário relacionados à publicidade para o Google.',
      },
      ad_personalization: {
        label: 'Define o consentimento para publicidade personalizada.',
      },
    },
    functionality: {
      functionality_storage: {
        label:
          'Permite o armazenamento que suporta a funcionalidade do site ou app, por exemplo, configurações de idioma.',
      },
      personalization_storage: {
        label: 'Permite o armazenamento relacionado à personalização, por exemplo, recomendações de vídeo.',
      },
    },
    security: {
      security_storage: {
        label:
          'Permite o armazenamento relacionado à segurança, como funcionalidades de autenticação, prevenção de fraudes e proteção do usuário.',
      },
    },
  },
};
