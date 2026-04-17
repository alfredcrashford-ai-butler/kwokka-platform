export default {
  consentModal: {
    title: 'Çerez Kullanıyoruz',
    description:
      'Bu web sitesi, düzgün çalışmasını sağlamak için gerekli çerezleri ve sizinle nasıl etkileşimde bulunduğumuzu anlamak için izleme çerezlerini kullanır. İzleme çerezleri yalnızca onay verdikten sonra ayarlanacaktır.',
    acceptAllBtn: 'Hepsini kabul et',
    acceptNecessaryBtn: 'Hepsini reddet',
    showPreferencesBtn: 'Bireysel tercihleri yönet',
  },
  preferencesModal: {
    title: 'Çerez tercihlerini yönet',
    acceptAllBtn: 'Hepsini kabul et',
    acceptNecessaryBtn: 'Hepsini reddet',
    savePreferencesBtn: 'Mevcut seçimi kabul et',
    closeIconLabel: 'Modali kapat',
    sections: [
      {
        title: 'Çerez kullanımı',
        description:
          'Web sitesinin temel işlevselliğini sağlamak ve çevrimiçi deneyiminizi geliştirmek için çerezler kullanıyoruz.',
      },
      {
        title: 'Kesinlikle gerekli çerezler',
        description:
          'Bu çerezler, web sitesinin düzgün çalışması için gereklidir, örneğin kullanıcı kimlik doğrulaması gibi.',
        linkedCategory: 'necessary',
      },
      {
        title: 'Analitik',
        description:
          'Analitik için kullanılan çerezler, hizmetlerin kullanıcıların belirli bir hizmetle nasıl etkileşimde bulunduğunu anlamasını sağlayan verileri toplamasına yardımcı olur. Bu içgörüler, hizmetlerin içeriği geliştirmesine ve kullanıcı deneyimini iyileştiren daha iyi özellikler oluşturmasına olanak tanır.',
        linkedCategory: 'analytics',
        cookieTable: {
          headers: {
            name: 'Adı',
            domain: 'Hizmet',
            description: 'Açıklama',
            expiration: 'Süresi',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                '<a href="https://business.safety.google/adscookies/">Google Analytics</a> tarafından ayarlanan çerez',
              expiration: '12 gün sonra sona erer',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                '<a href="https://business.safety.google/adscookies/">Google Analytics</a> tarafından ayarlanan çerez',
              expiration: 'Oturum',
            },
          ],
        },
      },
      {
        title: 'Reklam',
        description:
          'Google, reklam sunma ve gösterme, reklamları kişiselleştirme (<a href="https://g.co/adsettings">g.co/adsettings</a> adresindeki reklam ayarlarınıza bağlı olarak), bir reklamın bir kullanıcıya gösterilme sayısını sınırlama, görmek istemediğiniz reklamları susturma ve reklamların etkinliğini ölçme gibi amaçlarla çerez kullanır.',
        linkedCategory: 'advertisement',
      },
      {
        title: 'İşlevsellik',
        description:
          'İşlevsellik için kullanılan çerezler, kullanıcıların bir hizmet veya site ile etkileşime geçmesine ve o hizmet için temel olan özelliklere erişmesine olanak tanır. Temel kabul edilen özellikler arasında kullanıcının dil seçimi gibi tercihler, bir hizmeti sürdürmeye ve iyileştirmeye yardımcı olan ürün optimizasyonları ve alışveriş sepetinin içeriği gibi bir kullanıcının oturumuyla ilgili bilgilerin korunması yer alır.',
        linkedCategory: 'functionality',
      },
      {
        title: 'Güvenlik',
        description:
          'Güvenlik için kullanılan çerezler, kullanıcıları kimlik doğrulama, dolandırıcılığı önleme ve bir hizmetle etkileşim kurarken kullanıcıları koruma amaçlıdır.',
        linkedCategory: 'security',
      },
      {
        title: 'Daha fazla bilgi',
        description:
          'Çerez politikası ve tercihlerinize ilişkin her türlü sorunuz için lütfen <a href="https://pawsome-elements.com/en/pp">bizimle iletişime geçin</a>.',
      },
    ],
  },
  services: {
    analytics: {
      analytics_storage: {
        label: 'Analitikle ilgili depolamayı (örneğin çerezleri) etkinleştirir, örn. ziyaret süresi.',
      },
    },
    advertisement: {
      ad_storage: {
        label: 'Reklamlarla ilgili depolamayı (örneğin çerezleri) etkinleştirir.',
      },
      ad_user_data: {
        label: 'Reklamla ilgili kullanıcı verilerinin Google’a gönderilmesi için onay belirler.',
      },
      ad_personalization: {
        label: 'Kişiselleştirilmiş reklamlar için onay belirler.',
      },
    },
    functionality: {
      functionality_storage: {
        label: 'Web sitesi veya uygulamanın işlevselliğini destekleyen depolamayı etkinleştirir, örn. dil ayarları.',
      },
      personalization_storage: {
        label: 'Kişiselleştirmeyle ilgili depolamayı etkinleştirir, örn. video önerileri.',
      },
    },
    security: {
      security_storage: {
        label:
          'Güvenlikle ilgili depolamayı etkinleştirir; kimlik doğrulama, dolandırıcılığı önleme ve kullanıcı koruması gibi.',
      },
    },
  },
};
