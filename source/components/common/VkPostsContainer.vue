<template>
  <div class="vk-container">

    <header class="vk-header pattern_bg">
      <i />
      <span>Посты из Вконтакте</span>
    </header>

    <template v-if="Posts.length">
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

    <template v-else>
      <article v-for="item in 3" :key="item" class="vk-post pattern_bg" />
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

    @include component-shadow;

    padding: 2.5vh 2vw;
    border-radius: .7rem;

    width: 100%;

    display: inline-flex;
    justify-content: space-between;
    align-items: center;

    background-color: rgb(var(--color-mono-300));
    color: rgb(var(--color-mono-800));

    font: {
      size: var(--font-size-4);
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

    @include component-shadow;

    display: grid;
    padding: 2vh 1vw 3vh;

    row-gap: 2vh;

    min-height: 40vh;

    overflow: hidden;
    border-radius: .7rem;

    font: {
      size: var(--font-size-3);
    }

    background-color: rgb(var(--color-mono-300));

    img {
      object-fit: cover;
      width: 100%;
      border-radius: .7rem;
    }

    p {

      color: rgb(var(--color-mono-700));

      font: {
        size: var(--font-size-3);
        family: var(--read-font);
      }
    }

    hr {
      width: 100%;
      background: rgb(var(--color-mono-400));
      margin: 0;
    }

    &:empty {
      opacity: .5;
    }

    &-body {

      span {
        
        display: block;
        margin-bottom: 2vh;
  
        font: {
          size: var(--font-size-5);
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

  // FIREBASE
  import firebase from 'firebase/app';
  import 'firebase/database'

  // VUEX
  import { mapActions } from 'vuex';

  // DATA
  import POSTS from '~/assets/json/vk_posts.json';

  // COMPONENTS
	import Icon	          from '~/components/Icon.vue'
  import CommonButton   from '~/components/buttons/CommonButton.vue'

  // TYPES
  import type { FORMATED_DATE } from '~/store'

  type VK_POST = typeof POSTS.items[0];

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

      this.checkPosts();

    },
    methods: {
      ...mapActions({
        GetLocalTime: 'GetLocalTime',
      }),

      async checkPosts() {

        const SERVER_HASH = await firebase.database().ref('App/Cache/Vk').once('value').then(data => data.val());

        if ( process.client ) {

          const LOCAL_HASH = window.localStorage.getItem('VK_HASH');
          const LOCAL_DATA = window.localStorage.getItem('VK_POSTS');

          if ( LOCAL_HASH && LOCAL_DATA && LOCAL_HASH === SERVER_HASH ) {

            this.Posts = JSON.parse(LOCAL_DATA); console.log('Get VK posts from cache')

          } else {

            this.Posts = await this.getPosts(); console.log('Get VK posts from server')

            window.localStorage.setItem('VK_POSTS', JSON.stringify(this.Posts))
            window.localStorage.setItem('VK_HASH', SERVER_HASH)

          }

        }

      },

      async getPosts() {

        return await new Promise<POST[]>((resolve) => {

          firebase.database().ref('VkPosts').on('value', async (data) => {
  
            const PROMISES = (Object.values(data.val()) as VK_POST[]).map(async (item: VK_POST): Promise<POST> => {
  
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
  
            resolve(await Promise.all(PROMISES))
  
          })

        })

      }

    }
  })

</script>
