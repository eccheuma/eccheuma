import type { MetaInfo, MetaPropertyName } from 'vue-meta';

const yandexVerification: MetaPropertyName = { name: "yandex-verification", content: "cfc2699abdb958a8" }

const HEAD: MetaInfo = {
  title: 'Eccheuma',
  meta: [
    yandexVerification,
  ],
  link: [
    { rel: 'icon', href: './icon.svg' }
  ]
}

export default HEAD;
