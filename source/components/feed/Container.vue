<template>
  <div class="vk-container">

    <header v-once class="vk-header">
      <i />
      <span>Посты из Вконтакте</span>
    </header>

    <template v-if="Posts.length">
      <post v-for="(post, i) in Posts" :key="i" :post="post" />
    </template>

  </div>
</template>

<style lang="scss">

.vk {
  &-container {

    // display: grid;
    // row-gap: 2vh;

    > * {
      margin-bottom: 2vh;
    }

  }
  &-header {

    @include gradient-border;
    @include component-shadow;

    @extend %pattern-lines;

    padding: 2.5vh 2vw;
    border-radius: var(--border-radius);

    width: 100%;
    height: 10vh;

    display: flex;
    justify-content: space-between;
    place-items: center;

    background-color: rgb(var(--color-mono-300));
    color: rgb(var(--color-mono-900));

    font: {
      size: var(--font-size-14);
      weight: 700;
    }

    i {

      $s: 30px;

      display: block;

      width: $s;
      height: $s;

      background: {
        image: url('~assets/icons/Icon=VK.svg');
        size: contain;
        repeat: no-repeat;
      };

    }

  }
}

</style>

<script lang="ts">

  import Vue from 'vue'

  // API
  import { database } from '~/api/database';

  // UTILS
  import { utils } from '~/utils'

  // DATA
  import POSTS from '~/assets/json/vk_posts.json';

  // COMPONENTS
  import Post, { Post as IPost } from './Post.vue'

  // TYPES
  type VK_POST = typeof POSTS.items[0];

  // MODULE
  export default Vue.extend({
    components: {
      Post
    },  
    data() {
      return {
        Posts: [] as Array<IPost>,
      }
    },
    created() {

      if ( process.browser ) {
        database.get<string>('App/Cache/Vk').then((response) => {
          this.checkPosts(response);
        })
      }

    },
    methods: {

      // TODO | Использовать внутренние утилиты для работы с хранилищем.
      async checkPosts(SERVER_HASH: string) {

        const LOCAL_HASH = window.localStorage.getItem('VK_HASH');
        const LOCAL_DATA = window.localStorage.getItem('VK_POSTS');

        if ( LOCAL_HASH && LOCAL_DATA && LOCAL_HASH === SERVER_HASH ) {

          this.Posts = JSON.parse(LOCAL_DATA); 

        } else {

          this.Posts = await this.getPosts(); 

          window.localStorage.setItem('VK_POSTS', JSON.stringify(this.Posts))
          window.localStorage.setItem('VK_HASH', SERVER_HASH)

        }

      },

      async getPosts(): Promise<Array<IPost>> {

        const response = await database.get<utils.types.asIterableObject<VK_POST>>('VkPosts');

        return Array.from(Object.values(response), post => {
          return {
            thumb: post.attachments[0].photo.sizes[4].url,
            body: post.text,
            date: utils.getLocalTime(Number(`${ post.date + '000' }`)),
            link: `https://vk.com/club${ Math.abs(post.from_id) }?w=wall${ post.from_id }_${ post.id }`,
            social: {
              likes     : post.likes.count,
              comments  : post.comments.count,
              reposts   : post.reposts.count,
            }
          }
        })

      },

    }
  })

</script>
