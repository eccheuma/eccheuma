// NODE LIBRARIES
  import { writeFile }  from 'fs';
  import { createHash } from 'crypto';

// TYPES
  import { defineNuxtConfig } from '@nuxt/bridge';

// TEMPLATES
  import HEAD_CONFIG    from './properties/defaultHead';
  import genearateName  from './properties/nameGenerator';

// VARIABLES

  const BRIDGE_USE    = false

  const chunkSize     = 1.25;
  const inDevelopment = process.env.NODE_ENV === 'development';
  const hash          = createHash('md5').update(Math.random().toString()).digest('hex').slice(0, 8);

// HTTP CERTIFICATE
// const certificate: NuxtConfig['server']['https'] = {
//   key:  readFileSync(path.resolve(__dirname, './container/certificate/localhost.decrypted.key')),
//   cert: readFileSync(path.resolve(__dirname, './container/certificate/localhost.crt')),
// }

// WRITE A VERSION
  writeFile('.version', hash, () => console.log(`≏ Hash build: ${ genearateName(4) }:${ hash }`))

// CONFIG
  export default defineNuxtConfig({

    bridge: BRIDGE_USE,

    srcDir: 'source',
    vue: {
      config: {
        performance: inDevelopment
      }
    },

    alias: {
      tslib: 'tslib/tslib.es6.js'
    },

    env: {
      buildHash: hash
    },

    target: inDevelopment ? 'server' : 'static',

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
      linkActiveClass:      'active',
      linkExactActiveClass: 'exact',
    },

    head: HEAD_CONFIG,
    
    generate: {
      dir: 'app',
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

    modules: [

      '@nuxt/typescript-build',

      ['@nuxtjs/style-resources', {
        scss: [
          '~/assets/styles/scss/_uses.scss',
          '~/assets/styles/scss/_mixins.scss',
          '~/assets/styles/scss/_variables.scss',
        ]
      }],

      ['@nuxtjs/sitemap', {
        hostname: 'https://escapefrommordorland.web.app',
        exclude: ['/Admin/*'],
        trailingSlash: false,
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

    build: {

      // analyze: !inDevelopment,
      parallel: inDevelopment,
      publicPath: 'resources',

      standalone: BRIDGE_USE,

      filenames: {
        font:   () => 'fonts/[name].[ext]',
        chunk:  (context: any) => context.isDev ? '[name].js'  : `[name].${ hash }.js`,
        css:    (context: any) => context.isDev ? '[name].css' : `[name].${ hash }.css`,
      },

      babel: {
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: false,
          }]
        ],
        plugins: [
          '@babel/plugin-transform-runtime'
        ]
      },

      extractCSS: !inDevelopment,

      optimization: {
        minimize: !inDevelopment,
        splitChunks: {
          chunks: 'async',
        }
      },

    },

    plugins: [
      { src: '~/plugins/InitState.ts' },
      // Common plugins
      { src: '~/plugins/Firebase.ts' },
      { src: '~/plugins/VuePortal.js' },
      { src: '~/plugins/MobileDetection.ts' },
      { src: '~/plugins/Anime.ts' },
      // Client plugins TypeScript
      { src: '~/plugins/Pixi.ts',       mode: 'client' },
      { src: '~/plugins/Howler.ts',     mode: 'client' },
      { src: '~/plugins/Vuelidate.ts',  mode: 'client' },
      { src: '~/plugins/Cursor.ts',     mode: 'client' },
      // Client plugins
      { src: '~/plugins/DragScroll.js',         mode: 'client' },
      { src: '~/plugins/YandexMetrica.js',      mode: 'client' }
    ],

  })