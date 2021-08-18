// VARS
const ChunkSizeMultiplier = 1.25;
const IN_BUILD = process.env.NODE_ENV !== 'development';

const SERVER_BUILD = false;

// TYPES
export default {
  srcDir: 'source',

  globalName: 'app',
  globals: {
    id: globalName => `${globalName}`
  },

  ssr: true,

  // modern: IN_BUILD,
  
  target: SERVER_BUILD ? 'server' : 'static',

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  router: {
    linkPrefetchedClass:  'prefetched',
    linkActiveClass:      'active',
    linkExactActiveClass: 'exact',
  },
  
  generate: { 
    dir: 'app',
    exclude: ['/Admin'] 
  },

  loading: false,

  loaders: {
    vue: {
      compilerOptions: {
        whitespace: 'condense'
      }
    }
  },

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
      {
        rel: 'preload',
        href: '/static/fonts/Ebenya.woff2',
        as: 'font',
        crossorigin: true
      },
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
    ],
    // script: [
    //   { src: 'https://vk.com/js/api/xd_connection.js?2', type: 'text/javascript' }
    // ]
  },

  css: [
    // Sass bootstrap modules
    '~/assets/styles/scss/modules.scss',
    // Main Style Sheets file
    '~/assets/styles/scss/main.scss',
  ],

  layoutTransition: {
    name: 'layout-transition',
    mode: 'out-in'
  },

  buildModules: [
    // 'nuxt-vite',
    '@nuxtjs/sitemap',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@aceforth/nuxt-optimized-images',
  ],

  build: {
    babel: {
      presets({ envName }) {

        const envTargets = {
          client: { browsers: ['> 0.25%, not dead'] },
          server: { node: 'current' },
        }

        return [
          ['@nuxt/babel-preset-app', { targets: envTargets[envName], corejs: { version: 3 } }]
        ]

      }
    },
    // analyze: IN_BUILD,
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

  // vite: {
  //   css: {
  //     preprocessorOptions: {
  //       scss: {
  //         sourceMap: true,
  //         implementation: require('sass'),
  //         additionalData: '@import "~/assets/sass/_mixins.scss";',
  //       },
  //     },
  //   }, 
  // },

  sitemap: {
    hostname: 'https://escapefrommordorland.web.app',
    exclude: ['/Admin/*'],
    trailingSlash: false
  },

  optimizedImages: {
    defaultImageLoader: 'responsive-loader',
    responsive: {
      adapter: require('responsive-loader/sharp')
    }
  },

  styleResources: {
    sass: ['~/assets/styles/sass/_mixins.sass'],
    scss: ['~/assets/styles/scss/_mixins.scss'],
  }
};
