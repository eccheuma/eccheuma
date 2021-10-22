import { writeFile }  from 'fs';
import { createHash } from 'crypto';

// TYPES
import type { NuxtConfig } from '@nuxt/types';

// TEMPLATES
import HEAD_CONFIG    from './container/defaultHead';
import genearateName  from './container/nameGenerator';

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
writeFile('version.txt', hash, () => console.log(`≏ Hash build: ${ genearateName(4) }:${ hash }`))

// CONFIG
const config: NuxtConfig = {

  srcDir: 'source',

  globalName: 'app',
  globals: {
    id: globalName => `${ globalName }`,
  },

  vue: {
    config: {
      performance: inDevelopment
    }
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
    publicPath: 'resources',

    postcss: {
      preset: {
        stage: 2,
        autoprefixer: {
          grid: false,
          supports: true,
        },
        browsers: 'last 2 versions',
      }
    },

    babel: {
      presets({ envName }) {

        const target = envName === 'modern' ? 'client' : envName

        const envTargets = {
          client: { browsers: 'defaults' },
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
      chunk:  ({ isDev }) => isDev ? '[name].js'  : `[name].${ hash }.js`,
      css:    ({ isDev }) => isDev ? '[name].css' : `[name].${ hash }.css`,
    },

    extractCSS: !inDevelopment,
    optimizeCSS: {
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          require('cssnano-preset-default'), 
          { 
            mergeIdents: true,
          }
        ]
      }
    },

    optimization: {

      mergeDuplicateChunks: true,
      minimize: !inDevelopment,

      namedChunks: true,
      namedModules: true,

      splitChunks: {
        chunks: 'async',
        minChunks: 2,
        name: genearateName(4),
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
    { src: '~/plugins/Cursor.ts',     mode: 'client' },
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
    scss: [
      '~/assets/styles/scss/_mixins.scss',
      '~/assets/styles/scss/_variables.scss',
    ],
  },

}

export default config;
