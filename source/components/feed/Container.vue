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

    @media screen and ( max-width: $mobile-breakpoint ) {
			padding: 2.5vh 6vw;
      justify-content: center;
		}

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

      @media screen and ( max-width: $mobile-breakpoint ) {
        display: none;
      }

    }

  }
}

</style>

<script lang="ts">

  import Vue from 'vue';

  // API
  import { feed, vk } from '~/api/feed';
  import { database } from '~/api/database';

  // COMPONENTS
  import Post from './Post.vue';
import { utils } from '~/utils';

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
    async mounted() {
      if ( process.browser ) {

        const response = await database.get<Array<any>>('VkPosts');

        this.Posts = response.map(post => {
          return {
            thumb : vk.pickThumbnail(post.attachments),
            body  : String(post.text),
            date  : utils.getLocalTime(Number(post.date) * 1000),
            link  : `https://vk.com/club${ Math.abs(post.from_id || 0) }?w=wall${ post.from_id }_${ post.id }`,
            social: {
              likes    : Number(post.likes.count || Number()),
              comments : Number(post.comments.count || Number()),
              reposts  : Number(post.reposts.count || Number()),
            }
          };
        });

      }
    },
  });

</script>