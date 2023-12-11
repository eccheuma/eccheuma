<template>
  <div class="vk-container">

    <header v-once class="vk-header">
      <i />
      <span>Посты из Вконтакте</span>
    </header>

    <template v-if="posts.length">
      <post v-for="(post, i) in posts" :key="i" :post="post" />
    </template>

  </div>
</template>

<style lang="scss">

.vk {
  &-container {

    top: #{ $GLOBAL-HeaderHeight + 2vh };
    position: sticky;
    height: #{ 80vh + 2vh };
    overflow-y: scroll;
    overflow-x: visible;
    display: grid;
    gap: 1vh;
    padding-inline: 10px;
    margin-bottom: 10px;

  }
  &-header {

    @include gradient-border;
    @include component-shadow;

    @extend %pattern-lines;

    position: sticky;
    top: 0;

    padding: 2vh 2vw;
    border-radius: var(--border-radius);

    z-index: 0;

    width: 100%;
    // height: 10vh;

    display: flex;
    justify-content: space-between;
    place-items: center;

    background-color: rgb(var(--color-mono-300));
    color: rgb(var(--color-mono-900));

    @media screen and ( max-width: $mobile-breakpoint ) {
			padding: 1vh 6vw;
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

  import Vue, { PropOptions } from "vue";

  // API
  import { feed } from "~/api/feed";

  // COMPONENTS
  import Post from "./Post.vue";

  // MODULE
  export default Vue.extend({
    props: {
      posts: {
        required: true,
        type: Array,
      } as PropOptions<Array<feed.IFeed>>
    },
    components: {
      Post
    },
  });

</script>