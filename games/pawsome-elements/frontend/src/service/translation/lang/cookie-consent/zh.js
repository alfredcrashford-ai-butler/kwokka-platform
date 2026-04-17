export default {
  consentModal: {
    title: '我们使用 Cookie',
    description:
      '本网站使用必要的 Cookie 以确保其正常运行，并使用追踪 Cookie 以了解您如何与网站互动。后者仅在获得同意后设置。',
    acceptAllBtn: '全部接受',
    acceptNecessaryBtn: '全部拒绝',
    showPreferencesBtn: '管理个别偏好',
  },
  preferencesModal: {
    title: '管理 Cookie 偏好',
    acceptAllBtn: '全部接受',
    acceptNecessaryBtn: '全部拒绝',
    savePreferencesBtn: '接受当前选择',
    closeIconLabel: '关闭弹窗',
    sections: [
      {
        title: 'Cookie 使用情况',
        description: '我们使用 Cookie 来确保网站的基本功能，并提升您的在线体验。',
      },
      {
        title: '严格必要的 Cookie',
        description: '这些 Cookie 对网站的正常运行至关重要，例如用户身份验证。',
        linkedCategory: 'necessary',
      },
      {
        title: '分析',
        description:
          '用于分析的 Cookie 帮助收集数据，使服务了解用户如何与特定服务互动。这些洞察帮助服务改进内容并构建更好的功能，从而提升用户体验。',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: '名称',
            domain: '服务',
            description: '描述',
            expiration: '有效期',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description: '<a href="https://business.safety.google/adscookies/">Google Analytics</a> 设置的 Cookie',
              expiration: '12 天后过期',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description: '<a href="https://business.safety.google/adscookies/">Google Analytics</a> 设置的 Cookie',
              expiration: '会话',
            },
          ],
        },
      },
      {
        title: '广告',
        description:
          'Google 使用 Cookie 来投放和呈现广告，个性化广告（根据您在<a href="https://g.co/adsettings">g.co/adsettings</a>的广告设置），限制广告显示次数，静音您选择不再观看的广告，并衡量广告效果。',
        linkedCategory: 'advertisement',
      },
      {
        title: '功能性',
        description:
          '用于功能性的 Cookie 允许用户与服务或网站互动，访问该服务的基本功能。基本功能包括用户的语言偏好、帮助维护和改进服务的产品优化，以及维护用户会话相关的信息，例如购物车内容。',
        linkedCategory: 'functionality',
      },
      {
        title: '安全',
        description: '用于安全的 Cookie 用于验证用户身份、防止欺诈，并在用户与服务互动时保护用户安全。',
        linkedCategory: 'security',
      },
      {
        title: '更多信息',
        description:
          '如有关于 Cookie 政策及您的选择的任何疑问，请<a href="https://pawsome-elements.com/en/pp">联系我们</a>。',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: '启用与分析相关的存储（例如 Cookies)，例如访问时长。',
      },
    },
    advertisement: {
      ad_storage: {
        label: '启用与广告相关的存储（例如 Cookies) 。',
      },
      ad_user_data: {
        label: '设置发送与广告相关的用户数据给谷歌的同意。',
      },
      ad_personalization: {
        label: '设置个性化广告的同意。',
      },
    },
    functionality: {
      functionality_storage: {
        label: '启用支持网站或应用功能的存储，例如语言设置。',
      },
      personalization_storage: {
        label: '启用与个性化相关的存储，例如视频推荐。',
      },
    },
    security: {
      security_storage: {
        label: '启用与安全相关的存储，如身份验证功能、防欺诈和用户保护。',
      },
    },
  },
};
