<template>
  <div class="vk-container">

    <header v-once class="vk-header">
      <i />
      <span>Посты из Вконтакте</span>
    </header>

    <template v-if="Posts.length">
      <article v-for="(post, i) in Posts" v-once :key="i" class="vk-post">
        <header class="vk-post-header">
          <section>
            <span>Eccheuma</span>
            <span>{{ post.date.Day }} в {{ post.date.Time }}</span>
          </section>
          <hr v-once>
          <a href="https://vk.com/eccheuma" :style="`background-image: url(${ EccheumaAvatar })`" />
        </header>
        <section class="vk-post-body">
          <img :src="post.thumb" alt="">
          <hr v-once>
          <p>
            {{ post.body }}
          </p>
          <hr v-once>
          <common-button :link="post.link" target="_blank">
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

    <template v-else>
      <article v-for="item in 3" :key="item" class="vk-post" />
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
  &-post {

    @include component-shadow;
    @include gradient-border;

    @extend %pattern-lines;

    display: grid;
    padding-bottom: 3vh;

    row-gap: 2vh;

    min-height: 40vh;

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

      gap: 1vw;

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
    
            letter-spacing: .25ch;
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

      i {
        fill: rgb(var(--color-mono-900));
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
	import Icon	          from '~/components/common/Icon.vue'
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

        EccheumaAvatar: require('~/assets/images/GroupAvatar.jpg').src as string,

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

            this.Posts = JSON.parse(LOCAL_DATA); 
            // console.log('Get VK posts from cache')

          } else {

            this.Posts = await this.getPosts(); 
            // console.log('Get VK posts from server')

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
