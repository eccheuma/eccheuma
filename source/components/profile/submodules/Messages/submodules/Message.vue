<template>
  <div class="message" :class="`message-type::${ getMessageType(payload.UserID) }`">
    <span class="message-header">
      <span class="message-header-from">
        {{ authorName || payload.From }}
      </span>
      <hr v-once>
      <span class="message-header-date">
        {{ date.Day }} в {{ date.Time }}
      </span>
      <hr v-once>
      <span v-if="payload.Read" class="message-header-read">
        <icon name="Okay" /> Прочитанно
      </span>
    </span>
    <hr v-once>
    <span v-once class="message-body">{{ payload.Message }}</span>
  </div>
</template>

<style lang="scss" scoped>

.message-type\:\:notification {
  --border-color: var(--color-accent-notice) !important;
}

.message-type\:\:response {
  --border-color: var(--color-accent-pass) !important;
}

.message {

  --border-color: rgb(var(--color-mono-400));

  display: grid;
  row-gap: 1vh;

  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  padding: 2vh 1vw 4vh;
  color: rgb(var(--color-mono-1000));
  background-color: rgb(var(--color-mono-300));

  &-header {

    display: flex;
    gap: .5vw;

    color: rgb(var(--color-mono-800));
    font: {
      size: var(--font-size-16);
      weight: 800;
    }

    hr {
      width: 1px;
      height: 100%;
    }

    line-height: 3vh;

    &-from {
      color: rgb(var(--color-mono-900));
      font: {
        family: var(--decor-font);
        size: var(--font-size-24);
        weight: 500;
      }

      letter-spacing: .15ch;
      line-height: 2.25vh;

    }

    &-read {
      display: flex;
      justify-content: right;
      align-items: center;
      gap: .25vw;

      i {

        fill: var(--color-accent-notice);
      }

    }

  }

  &-body {

    display: block;
    white-space: pre-line;
    width: 65ch;
    text-align: left;

    color: rgb(var(--color-mono-900));
    font: {
      size: var(--font-size-20);
      // family: var(--read-font);
      weight: 600;
    }

  }

}

</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue'

  import firebase from 'firebase/app';
  import 'firebase/database';

  // VUEX
  import { mapActions } from 'vuex';

  // COMPONENTS
  import Icon from '~/components/common/Icon.vue'

  // TYPE AND INTERFACES
  import type { FORMATED_DATE } 	from '~/store';
  import type { MESSAGE }         from '~/typescript/Message'

  // MODULE
  export default Vue.extend({
    components: {
      Icon
    },
    props: {
      payload: {
        type: Object,
        required: true,
      } as PropOptions<MESSAGE>
    },
    data() {
      return {

        authorName: undefined,

        date: { Day: '1 Января 2000 г.', Time: '00:00' } as FORMATED_DATE

      }
    },
    async created() {

      this.date = await this.GetLocalTime(this.payload.Date);

    },
    mounted() {

      if ( this.payload.From ) {
        firebase.database()
          .ref(`Users/${ this.payload.UserID }/state/UserName`)
          .on('value', (snapshot) => {
            this.authorName = snapshot.val();
          })
      }

    },
    methods: {
      ...mapActions({
        GetLocalTime: 'GetLocalTime',
      }),

      getMessageType(ID: string) {
        switch (ID) {

          case 'ADMIN': 
            return 'response';
          case 'SUPPORT': 
            return 'notification';
      
          default: return 'common';

        }
      }

    }
  })

</script>
