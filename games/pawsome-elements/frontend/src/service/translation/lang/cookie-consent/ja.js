export default {
  consentModal: {
    title: 'クッキーの使用について',
    description:
      'このウェブサイトは、適切な動作を保証するために必須のクッキーと、利用状況を把握するためのトラッキングクッキーを使用しています。後者は同意後にのみ設定されます。',
    acceptAllBtn: 'すべて許可',
    acceptNecessaryBtn: 'すべて拒否',
    showPreferencesBtn: '個別の設定を管理',
  },
  preferencesModal: {
    title: 'クッキー設定の管理',
    acceptAllBtn: 'すべて許可',
    acceptNecessaryBtn: 'すべて拒否',
    savePreferencesBtn: '現在の選択を許可',
    closeIconLabel: 'モーダルを閉じる',
    sections: [
      {
        title: 'クッキーの使用',
        description: '当サイトでは、基本的な機能を確保し、オンライン体験を向上させるためにクッキーを使用しています。',
      },
      {
        title: '厳密に必要なクッキー',
        description:
          'これらのクッキーは、ウェブサイトの適切な機能のために不可欠です。例えば、ユーザー認証に使用されます。',
        linkedCategory: 'necessary',
      },
      {
        title: '分析',
        description:
          '分析用クッキーは、サービスがユーザーの利用状況を理解するためのデータ収集に役立ちます。これらの情報により、サービスのコンテンツや機能を改善し、ユーザー体験を向上させることができます。',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: '名前',
            domain: 'サービス',
            description: '説明',
            expiration: '有効期限',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                '<a href="https://business.safety.google/adscookies/">Google Analytics</a> によって設定されたクッキー',
              expiration: '12日後に有効期限切れ',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                '<a href="https://business.safety.google/adscookies/">Google Analytics</a> によって設定されたクッキー',
              expiration: 'セッション',
            },
          ],
        },
      },
      {
        title: '広告',
        description:
          'Google は広告の配信、表示、パーソナライズ（<a href="https://g.co/adsettings">g.co/adsettings</a> での広告設定に基づく）、同じユーザーへの広告表示回数の制限、非表示設定した広告のミュート、広告効果の測定のためにクッキーを使用します。',
        linkedCategory: 'advertisement',
      },
      {
        title: '機能性',
        description:
          '機能性クッキーは、サービスまたはサイトでユーザーがやり取りし、そのサービスにとって基本的な機能にアクセスできるようにします。基本機能には、言語設定、サービスの最適化、ショッピングカートの中身などセッションに関連する情報の維持が含まれます。',
        linkedCategory: 'functionality',
      },
      {
        title: 'セキュリティ',
        description: 'セキュリティ用クッキーは、ユーザー認証、不正防止、サービス利用時のユーザー保護を行います。',
        linkedCategory: 'security',
      },
      {
        title: '詳細情報',
        description:
          'クッキーポリシーおよび選択に関するご質問は、<a href="https://pawsome-elements.com/en/pp">こちらからお問い合わせください</a>。',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: '分析に関連するストレージ（クッキーなど）を有効にします。例：訪問時間。',
      },
    },
    advertisement: {
      ad_storage: {
        label: '広告に関連するストレージ（クッキーなど）を有効にします。',
      },
      ad_user_data: {
        label: '広告に関連するユーザーデータをGoogleに送信するための同意を設定します。',
      },
      ad_personalization: {
        label: 'パーソナライズされた広告の同意を設定します。',
      },
    },
    functionality: {
      functionality_storage: {
        label: 'ウェブサイトやアプリの機能をサポートするストレージを有効にします。例：言語設定。',
      },
      personalization_storage: {
        label: 'パーソナライズに関連するストレージを有効にします。例：動画のおすすめ。',
      },
    },
    security: {
      security_storage: {
        label: '認証機能、不正防止、ユーザー保護など、セキュリティに関連するストレージを有効にします。',
      },
    },
  },
};
