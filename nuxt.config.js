// VARS
const ChunkSizeMultiplier = 1.25;
const IN_BUILD = process.env.NODE_ENV !== 'development';

const MODE = mode => (!(mode === 'SPA' && !IN_BUILD));

export default {
  srcDir: 'source',

  globalName: 'app',
  globals: {
    id: globalName => `${globalName}`
  },

  ssr: MODE('SSR'),
  modern: IN_BUILD,
  target: 'static',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  generate: { dir: 'application', exclude: ['/Admin'] },

  loading: false,

  head: {
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
      { rel: 'icon', href: '/Icon.svg' },
      {
        rel: 'preload',
        href: '/fonts/webfonts/fa-brands-400.woff2',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: '/fonts/webfonts/fa-solid-900.woff2',
        as: 'font',
        crossorigin: true
      },
      {
        rel: 'preload',
        href: '/static/fonts/Montserrat-SemiBold.woff2',
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
        href: '/static/fonts/Montserrat-Light.woff2',
        as: 'font',
        crossorigin: true
      }
    ]
  },

  css: [
    // Bootstrap custom variables
    '~/assets/sass/variables.sass',

    // Sass bootstrap modules
    '~/assets/sass/modules.sass',

    // Main Style Sheets file
    '~/assets/sass/main.sass'
  ],

  layoutTransition: {
    name: 'OpacityTransition',
    mode: 'out-in'
  },

  buildModules: [
    '@nuxtjs/sitemap',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@aceforth/nuxt-optimized-images',
  ],

  build: {
    analyze: IN_BUILD,
    minimaze: IN_BUILD,
    parallel: false,
    publicPath: '/static',
    filenames: {
      font: 'fonts/[name].[ext]',
      chunk: !IN_BUILD ? '[id].js' : '[id].[contenthash:6].js',
      css: !IN_BUILD ? '[name].css' : '[id].[contenthash:6].css'
    },
    extractCSS: IN_BUILD,
    optimizeCSS: {
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [require('cssnano-preset-default'), { discardComments: false }]
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 20000 * ChunkSizeMultiplier,
        maxSize: 1048576 * ChunkSizeMultiplier,
        minChunks: 1,
        enforceSizeThreshold: 50000 * ChunkSizeMultiplier
      }
    },
    extend(config) {
      config.module.rules.push({
        test: /\.(ogg|wav)$/i,
        loader: 'file-loader',
        options: {
          name: 'sounds/[name].[ext]'
        }
      });
    }
  },

  plugins: [
    { src: '~/plugins/InitState.ts' },
    // Common plugins
    { src: '~/plugins/Firebase.ts' },
    { src: '~/plugins/VuePortal.js' },
    { src: '~/plugins/VueBootstrap.js' },
    { src: '~/plugins/MobileDetection.ts' },
    // Client plugins TypeScript
    { src: '~/plugins/Pixi.ts',       mode: 'client' },
    { src: '~/plugins/Anime.ts',      mode: 'client' },
    { src: '~/plugins/Howler.ts',     mode: 'client' },
    { src: '~/plugins/Vuelidate.ts',  mode: 'client' },
    // Client plugins
    { src: '~/plugins/DragScroll.js',         mode: 'client' },
    { src: '~/plugins/YandexMetrica.js',      mode: 'client' }
  ],

  // BUILD MODULES CONFIGURATIONS

  sitemap: {
    hostname: 'https://escapefrommordorland.web.app',
    exclude: ['/Admin/*'],
    gzip: true,
    trailingSlash: true
  },

  optimizedImages: {
    defaultImageLoader: 'responsive-loader',
    responsive: {
      adapter: require('responsive-loader/sharp')
    }
  },

  styleResources: {
    sass: ['~/assets/sass/variables.sass'],
    scss: ['~/assets/sass/variables.scss']
  }
};
