import { NuxtConfig } from '@nuxt/types';

const header: NuxtConfig['head'] = {
  title: 'Eccheuma | Graphical & Web Design',
  meta: [
    // Charset
    { charset: 'utf-8' },

    // Viewport
    { name: 'viewport', content: 'initial-scale=1, maximum-scale=1' },

    // OpenGraph Meta
    {
      hid: 'description',
      name: 'description',
      content: 'Escape from Mordorland - Блог-портфолио ориентируемый на визуальный дизайн сайтов, логотипов, баннеров, и UI интерфейса. Предоставление услуг по работе с веб-дизайном и digital дизайном, фирменным стилем, и прочим графическим услугам'
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content: 'Дизайн сайтов, Веб-Дизайн, Графический интерфейс, Дизайн, Вёрстка, Фриланс услуги, UI Дизайн'
    },
    {
      hid: 'author',
      name: 'author',
      content: 'Алексей Рево | Revo515@yandex.ru'
    },
    {
      hid: 'og:site_nme',
      property: 'og:site_name',
      content: 'EFM | Graphical & Web Design'
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: 'Escape from Mordorland - Блог-портфолио '
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: 'Блог-портфолио ориентируемый на визуальный дизайн сайтов, логотипов, баннеров, и UI интерфейса. Предоставление услуг по работе с веб-дизайном и digital дизайном, фирменным стилем, и прочим графическим услугам '
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: 'https://firebasestorage.googleapis.com/v0/b/escapefrommordorland.appspot.com/o/OpenGraph.png?alt=media&token=90eb59b4-7bad-4e9e-8e95-ca255d449fc4'
    },
    {
      hid: 'yandex',
      name: 'yandex-verification',
      content: '2464d15cb540d658 '
    },
    {
      hid: 'google',
      name: 'google-site-verification',
      content: '-mSlKM92quGUtkE3qSxEyf2uHSU_F5qjZUSjqqKFiJs '
    }
  ],
  link: [
    {
      rel: 'preload',
      href: '/static/fonts/Montserrat-Bold.woff2',
      as: 'font',
      crossorigin: true
    },
    {
      rel: 'preload',
      href: '/static/fonts/Montserrat-Medium.woff2',
      as: 'font',
      crossorigin: true
    },
    {
      rel: 'preload',
      href: '/static/fonts/Montserrat-Regular.woff2',
      as: 'font',
      crossorigin: true
    }, 
  ]
}

export default header;
