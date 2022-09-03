import type { MetaInfo, MetaPropertyName } from 'vue-meta';

const yandexVerification: MetaPropertyName = { name: 'yandex-verification', content: 'cfc2699abdb958a8' };

// <meta name="viewport" content="width=device-width, initial-scale=1">

const HEAD: MetaInfo = {
  title: 'Eccheuma',
  meta: [

    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    yandexVerification,
    
  ],
  link: [
    { rel: 'icon', href: './icon.svg' }
  ]
};

export default HEAD;
