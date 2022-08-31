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

    top: #{ $GLOBAL-HeaderHeight + 2vh };
    position: sticky;
    height: #{ 80vh + 2vh };
    padding-right: .5vw;
    overflow-y: scroll;
    overflow-x: visible;
    display: grid;
    gap: 1vh;

  }
  &-header {

    @include gradient-border;
    @include component-shadow;

    @extend %pattern-lines;

    position: sticky;
    top: 0;

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

  import Vue from 'vue';

  // API
  import { database } from '~/api/database';
  import { feed } from '~/api/feed';

  // COMPONENTS
  import Post from './Post.vue';

  // MODULE
  export default Vue.extend({
    components: {
      Post
    },  
    data() {
      return {
        Posts: Array<feed.IFeed>(),
      };
    },
    created() {
      if ( process.browser ) {
        // database.get<string>('App/Cache/Vk').then((response) => {
        //   this.checkPosts(response);
        // })
      }
    },
    async mounted() {
      if ( process.browser ) {
        this.Posts = await feed.get();
      }
    },
    methods: {

      // TODO | Использовать внутренние утилиты для работы с хранилищем.
      async checkPosts(SERVER_HASH: string) {

        // const LOCAL_HASH = window.localStorage.getItem('VK_HASH');
        // const LOCAL_DATA = window.localStorage.getItem('VK_POSTS');

        // if ( LOCAL_HASH && LOCAL_DATA && LOCAL_HASH === SERVER_HASH ) {

        //   this.Posts = JSON.parse(LOCAL_DATA); 

        // } else {

        //   this.Posts = await feed.get();

        //   window.localStorage.setItem('VK_POSTS', JSON.stringify(this.Posts))
        //   window.localStorage.setItem('VK_HASH', SERVER_HASH)

        // }

      },

    }
  });

</script>
