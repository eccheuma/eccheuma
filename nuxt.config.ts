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
  target: 'server',

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  render: {
    ssrLog: true,
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

    ['nuxt-esbuild', {
      loader: 'ts',
      minify: false,
      keepNames: true,
    }],

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
      },
    }],

  ],

  build: {

    analyze     : inDevelopment === false,
    parallel    : inDevelopment,
    cache       : true,
    hardSource 	: true,
    postcss     : false,
    publicPath  : 'resources',

    filenames: {
      font: () => 'fonts/[name].[ext]',
      chunk: context => context.isDev ? '[name].js' : `[name].${hash}.js`,
      css: context => context.isDev ? '[name].css' : `[name].${hash}.css`,
    },

    extractCSS: !inDevelopment,

    loaders: {
      scss: {
        implementation: require('sass'),
      },
      vue: {
        prettify: false,
        optimizeSSR: !inDevelopment,
      },
    },

    html: {
      minify: {
        minifyJS: false,
        minifyCSS: false,
      }
    },

    optimization: {
      minimize: !inDevelopment,
      splitChunks: {
        maxSize: 524_288
      }
    },

    transpile: [/pixi.js/],
    babel: {
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@babel/plugin-transform-nullish-coalescing-operator',
        '@babel/plugin-transform-optional-chaining',
      ]
    },

    extend(config) {

      if ( !config.module ) return;

      config.module.rules.push({
        test    : /\.mjs$/,
        include : /node_modules/,
        type    : 'javascript/auto',
      });

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
