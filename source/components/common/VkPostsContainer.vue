<template>
  <div class="vk-container">

    <header class="vk-header pattern_bg">
      <i />
      <span>Посты из Вконтакте</span>
    </header>

    <template v-if="Posts">
      <article v-for="(post, i) in Posts" :key="i" class="vk-post pattern_bg">
        <img :src="post.thumb" alt="">
        <hr>
        <section class="vk-post-body">
          <span>{{ post.date.Day }} в {{ post.date.Time }}</span>
          <p>
            {{ post.body }}
          </p>
        </section>
        <hr>
        <common-button :link="post.link" target="_blank">
          Перейти к посту
        </common-button>
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

    padding: 2.5vh 2vw;
    border-radius: .7rem;

    width: 100%;

    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    background-color: rgb(var(--color-2));

    font: {
      size: var(--font-size-5);
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
  &-post {

    display: grid;
    padding: 2vh 1vw 10vh;

    row-gap: 2vh;

    overflow: hidden;
    border-radius: .7rem;

    font: {
      size: var(--font-size-4)
    }

    background-color: rgb(var(--color-2));

    img {
      object-fit: cover;
      width: 100%;
      border-radius: .7rem;
    }

    hr {
      width: 100%;
      background: rgb(var(--color-3));
      margin: 0;
    }

    &-body {

      span {
        
        display: block;
        margin-bottom: 2vh;
  
        font: {
          size: var(--font-size-4);
          weight: 800;
        }
  
      }

      p {
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 13;
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
    }

  }
}

</style>

<script lang="ts">

  import Vue from 'vue'

  // VUEX
  import { mapActions } from 'vuex';

  // DATA
  import POSTS from '~/assets/json/vk_posts.json';

  // COMPONENTS
	import Icon	          from '~/components/Icon.vue'
  import CommonButton   from '~/components/buttons/CommonButton.vue'

  // TYPES
  import type { FORMATED_DATE } from '~/store'

  type POST = {
    thumb: string,
    body: string,
    date: FORMATED_DATE,
    link: string
    social: {
      likes: number,
      comments: number,
      reposts: number
    }
  }

  // MODULE
  export default Vue.extend({
    components: {
      Icon, CommonButton
    },  
    data() {
      return {
        Posts: [] as POST[],
      }
    },
    created() {

      const PROMISES = POSTS.items.map(async (item): Promise<POST> => {

        return {
          thumb: item.attachments[0].photo.sizes[4].url,
          body: item.text,
          date: await this.GetLocalTime(Number(`${ item.date + '000' }`)) as FORMATED_DATE,
          link: `https://vk.com/club${ Math.abs(item.from_id) }?w=wall${ item.from_id }_${ item.id }`,
          social: {
            likes: item.likes.count,
            comments: item.comments.count,
            reposts: item.reposts.count,
          }
        }

      })

      Promise.all(PROMISES).then((data) => {
        this.Posts = data;
      })

    },
    methods: {
      ...mapActions({
        GetLocalTime: 'GetLocalTime',
      })
    }
  })

</script>
