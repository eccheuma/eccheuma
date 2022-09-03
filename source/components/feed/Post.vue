<template>
  <article class="vk-post">
    <header class="vk-post-header">
      <section>
        <span>Eccheuma</span>
        <span>{{ post.date.Day }} в {{ post.date.Time }}</span>
      </section>
      <hr v-once>
      <a href="https://vk.com/eccheuma" :style="`background-image: url(${ SourceIcon })`" />
    </header>
    <section class="vk-post-body">
      <template v-if="post.thumb">
        <img :src="post.thumb" alt="">
        <hr v-once>
      </template>
      <p>
        {{ textPreview }}
      </p>
      <hr v-once>
      <common-button :link="post.link" target="_blank" type="a">
        Перейти к посту
      </common-button>
    </section>
    <footer class="vk-post-footer">
      <span>
        <icon name="Fire" />
        {{ post.social.likes }}
      </span>
      <span>
        <icon name="Comment" />
        {{ post.social.comments }}
      </span>
      <span>
        <icon name="Mute" />
        {{ post.social.reposts }}
      </span>
    </footer>
  </article>
</template>

<style lang="scss">

.vk-post {

  @include component-shadow;
  @include gradient-border;

  @extend %pattern-lines;

  display: grid;
  padding-bottom: 3vh;

  row-gap: 2vh;

  min-height: 40vh;
  height: max-content;

  overflow: hidden;
  border-radius: var(--border-radius);

  font: {
    size: var(--font-size-20);
  }

  background-color: rgb(var(--color-mono-300));

  img {
    object-fit: cover;
    width: 100%;
    border-radius: var(--border-radius);
  }

  p {

    color: rgb(var(--color-mono-900));

    font: {
      size: var(--font-size-18);
      family: var(--read-font);
    }

    letter-spacing: .1ch;

  }

  hr {
    width: 100%;
    background: rgb(var(--color-mono-400));
    margin: 0;
  }

  &:empty {
    opacity: .5;
  }

  &-header {

    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;

    padding: 2vh 1vw;

    background-color: rgb(var(--color-mono-200));

    gap: max(1vw, 10px);

    hr {
      height: 66%;
      width: 1px;
      background-color: var(--color-accent-edges-100);
    }

    a {

      height: clamp(60px, 4vw, 120px);
      aspect-ratio: 1/1;

      background: {
        size: 150%;
        position: center;
        repeat: no-repeat;
      }

      border: {
        radius: 100%;
        width: 2px;
        style: solid;
        color: var(--color-accent-edges-100);
      }

    }

    section {
      span {

        display: block;
        text-align: right;

        &:nth-child(1) {
          font: {
            family: var(--decor-font);
            size: var(--font-size-32);
          }
  
          letter-spacing: .15ch;
          line-height: calc(var(--font-size-32) * 1.25);
        }

        &:nth-child(2) {
          font: {
            size: var(--font-size-14);
          }
        }

      }
    }

  }

  &-body {

    padding: 1vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 2vh;

    p {
      display: -webkit-box;
      overflow: hidden;

      @media screen and ( max-width: $mobile-breakpoint ) {
        padding: 2vh 4vw;
      }

      padding: 2vh 1vw;

      font: {
        size: var(--font-size-18);
      }

      -webkit-box-orient: vertical;

    }

  }

  &-footer {

    display: inline-grid;
    grid-template: {
      columns: repeat(3, 1fr);
    };

    width: 70%;
    margin: auto;
    justify-items: center;

    span {
      display: inline-grid;
      grid-template-columns: 1fr 1fr;
      justify-items: end;

      font: {
        weight: 700;
      }

    }

    i {
      fill: rgb(var(--color-mono-900));
    }

  }

}

</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue';

  // API
  import { feed } from '~/api/feed';

  // UTILS
  import { utils } from '~/utils';

  // CONST
  const BODY_WORD_LENGTH  = 75;
  const DEFAULT_AVATAR    = require('~/assets/images/GroupAvatar.jpg').src as string;

  // COMPONENTS
	import Icon	          from '~/components/common/Icon.vue';
  import CommonButton   from '~/components/buttons/CommonButton.vue';

  // MODULE
  export default Vue.extend({
    props: {
      post: {
        type: Object,
        required: true,
      } as PropOptions<feed.IFeed>
    },
    components: {
      Icon, CommonButton
    }, 
    data() {
      return {

        SourceIcon: DEFAULT_AVATAR,

      };
    },
    computed: {

      textPreview(): string {
        return utils.cutText(this.post.body, BODY_WORD_LENGTH);
      }

    }
  });

</script>