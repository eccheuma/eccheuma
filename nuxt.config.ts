import { writeFile }  from 'fs';
import { createHash } from 'crypto';

// TYPES
import type { NuxtConfig } from '@nuxt/types';

// TEMPLATES
import HEAD_CONFIG from './container/defaultHead';

// VARIABLES
const chunkSize     = 1.25;
const inDevelopment = process.env.NODE_ENV === 'development';
const hash          = createHash('md5').update(Math.random().toString()).digest('hex').slice(0, 8);

// HTTP CERTIFICATE
// const certificate: NuxtConfig['server']['https'] = {
//   key:  readFileSync(path.resolve(__dirname, './container/certificate/localhost.decrypted.key')),
//   cert: readFileSync(path.resolve(__dirname, './container/certificate/localhost.crt')),
// }

// WRITE A VERSION
writeFile('version.txt', hash, () => console.log(`≏ Hash build: ${ hash }`))

// CONFIG
const config: NuxtConfig = {

  srcDir: 'source',
  buildDir: 'app',

  globalName: 'app',
  globals: {
    id: globalName => `${ globalName }`,
  },

  env: {
    buildHash: hash
  },

  target: inDevelopment ? 'server' : 'static',
  // modern: !inDevelopment,

  server: {
    port: 3000,
    host: '0.0.0.0',
    // https: certificate
  },

  loading: {
    color: 'hsl(30,18%,60%)',
    height: '4px'
  },

  router: {
    prefetchLinks: false,
    linkPrefetchedClass:  'prefetched',
    linkActiveClass:      'active',
    linkExactActiveClass: 'exact',
  },

  head: HEAD_CONFIG,
  generate: {
    dir: 'app',
    cache: false,
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
    '@nuxtjs/sitemap',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@aceforth/nuxt-optimized-images',
  ],

  build: {

    // analyze: !inDevelopment,
    parallel: inDevelopment,
    publicPath: '',

    babel: {
      presets({ envName }) {

        const target = envName === 'modern' ? 'client' : envName

        const envTargets = {
          client: { browsers: ['> 0.25%, not dead'] },
          server: { node: 'current' },
        }

        return [
          [ '@nuxt/babel-preset-app', 
            { 
              targets: envTargets[target], 
              corejs: { 
                version: 3 
              },  
            }
          ]
        ]

      }
    },

    filenames: {
      font:   () => 'fonts/[name].[ext]',
      chunk:  ({ isDev }) => isDev ? '[id].js'  : `[id].${ hash }.js`,
      css:    ({ isDev }) => isDev ? '[id].css' : `[id].${ hash }.css`,
    },

    extractCSS: !inDevelopment,
    optimizeCSS: {
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [require('cssnano-preset-default'), { discardComments: false }]
      }
    },

    optimization: {

      mergeDuplicateChunks: true,
      minimize: !inDevelopment,

      splitChunks: {
        chunks: 'async',
        minSize: 20000 * chunkSize,
        maxSize: 1048576 * chunkSize,
        minChunks: 1,
      }

    },

    extend({ module }) {

      module!.rules.push({
        test: /\.(ogg|wav)$/i,
        loader: 'file-loader',
        options: {
          name: 'sounds/[name].[ext]'
        }
      });

    }

  },

  optimizedImages: {
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
    // Client plugins
    { src: '~/plugins/DragScroll.js',         mode: 'client' },
    { src: '~/plugins/YandexMetrica.js',      mode: 'client' }
  ],

  sitemap: {
    hostname: 'https://escapefrommordorland.web.app',
    exclude: ['/Admin/*'],
    trailingSlash: false
  },

  styleResources: {
    sass: ['~/assets/styles/sass/_mixins.sass'],
    scss: ['~/assets/styles/scss/_mixins.scss'],
  },

}

export default config;
