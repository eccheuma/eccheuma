import type { MetaInfo, MetaPropertyName } from 'vue-meta';

const yandexVerification: MetaPropertyName = { 
  name    : 'yandex-verification', 
  content : process.env.YANDEX_VERIFICATION || String(),
};

export default {
  title: 'Eccheuma',
  meta: [

    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    yandexVerification,
    
  ],
  link: [
    { rel: 'icon', href: './icon.svg' }
  ]
} as MetaInfo;