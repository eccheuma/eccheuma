// ENV
import { environment } from './packages/utils/configEnvironment';

// TYPES
import { NuxtConfig } from '@nuxt/types';

// TEMPLATES
import HEAD_CONFIG from './mocks/defaultHead';
import { utils } from './source/utils';

// VARIABLES
const inDevelopment = process.env.NODE_ENV === environment.node.development;
const hash = utils.randHashGenerator(12);

// CONFIG
const config: NuxtConfig = {

  srcDir: 'source',

  globalName: 'eccheuma',
  globals: {
    id: globalName => `${globalName}-app`
  },

  vue: {
    config: {
      performance: inDevelopment
    }
  },

  env: {

    buildHash: hash,

    ...environment.config([

      'SUPABASE_API_URL',
      'SUPABASE_API_KEY',

      'FIREBASE_API_APP',
      'FIREBASE_API_KEY',
      'FIREBASE_DOMEN',

      'CLOUD_FUNCTION_HOSTING_URL',

      'CURRENCY_API_URL',
      'CURRENCY_API_KEY',

      'VK_API_URL',
      'VK_API_DEV_TOKEN',
      'VK_API_GROUP_ID',
      'VK_API_VERSION',

    ]),

  },

  ssr: true,
  target: 'static',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  loading: {
    color: 'hsl(30,18%,60%)',
    height: '4px'
  },

  router: {
    prefetchLinks: false,
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact',
  },

  head: HEAD_CONFIG,

  hooks: {
    generate: {
      async done() {

        const { deleteActiveInstances } = await import('./source/plugins/Firebase');

        setTimeout(deleteActiveInstances, 3000);

      },

    }
  },

  generate: {
    dir: 'app',
    routes: ['/post/0'],
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

    ['@nuxtjs/sitemap', {
      hostname: 'https://escapefrommordorland.web.app',
      exclude: ['/Admin/*'],
      trailingSlash: false,
    }],

  ],

  modules: [

    '@nuxt/typescript-build',

    ['@nuxtjs/style-resources', {
      scss: [
        '~/assets/styles/scss/libraries.scss',
        '~/assets/styles/scss/_mixins.scss',
        '~/assets/styles/scss/_variables.scss',
      ]
    }],

    // Nuxt types fucked up as always...
    ['@aceforth/nuxt-optimized-images', {
      defaultImageLoader: 'responsive-loader',
      responsive: {
        adapter: require('responsive-loader/sharp')
      },
      svgo: {
        plugins: [
          { name: 'removeUselessDefs' },
          { name: 'cleanupAttrs' },
        ]
      }
    }] as any,

  ],

  hardSource: inDevelopment,
  cache: inDevelopment,

  build: {

    // analyze: !inDevelopment,
    parallel: inDevelopment,
    publicPath: 'resources',

    filenames: {
      font: () => 'fonts/[name].[ext]',
      chunk: (context: any) => context.isDev ? '[name].js' : `[name].${hash}.js`,
      css: (context: any) => context.isDev ? '[name].css' : `[name].${hash}.css`,
    },

    babel: {
      presets: [
        ['@babel/preset-env', {
          useBuiltIns: false,
          exclude: [
            // ! Из-за того что бабель пытается настырно пережевать все асинхронные методы в генераторы, 
            // ! часть асинхронных методов внезапно прерывается другими вызовами. Ошибка ли это Nuxt, Vue, или других прослоек - Я не знаю.
            // ! Но я как-то не собираюсь ебать себе голову на счёт этого. И сделаю всё это крайне нахально...
            '@babel/plugin-transform-async-to-generator'
          ]
        }]
      ],
      plugins: [
        ['@babel/plugin-transform-runtime', {
          regenerator: true
        }]
      ]
    },

    extractCSS: !inDevelopment,

    optimization: {
      minimize: !inDevelopment,
      splitChunks: {
        maxSize: 524_288
      }
    },

  },

  plugins: [
    { src: '~/plugins/InitState.ts' },
    // Common plugins
    { src: '~/plugins/Firebase.ts' },
    { src: '~/plugins/Supabase.ts' },
    { src: '~/plugins/VuePortal.js' },
    { src: '~/plugins/MobileDetection.ts' },
    { src: '~/plugins/Anime.ts' },
    // Client plugins TypeScript
    { src: '~/plugins/Pixi.ts', mode: 'client' },
    { src: '~/plugins/Howler.ts', mode: 'client' },
    { src: '~/plugins/Cursor.ts', mode: 'client' },
    // Client plugins
    { src: '~/plugins/DragScroll.js', mode: 'client' },
    { src: '~/plugins/YandexMetrica.js', mode: 'client' },
  ],
};

export default config;
