<template>
  <div class="message" :class="`message-type::${ getMessageType(payload.UserID) }`">
    <span class="message-header">
      <span class="message-header-from">
        {{ payload.From }}
      </span>
      <hr>
      <span class="message-header-date">
        {{ date.Day }} в {{ date.Time }}
      </span>
      <hr>
      <span v-if="payload.Read" class="message-header-read">
        <icon name="Okay" /> Прочитанно
      </span>
    </span>
    <hr>
    <span class="message-body">{{ payload.Message }}</span>
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
  color: rgb(var(--color-mono-900));
  background-color: rgb(var(--color-mono-300));

  &-header {

    display: flex;
    gap: .5vw;

    color: rgb(var(--color-mono-600));
    font: {
      size: var(--font-size-16);
      weight: 800;
    }

    hr {
      width: 1px;
      height: 100%;
    }

    &-from {
      color: rgb(var(--color-mono-800));
      font: {
        family: var(--decor-font);
        size: var(--font-size-24);
        weight: 500;
      }

      letter-spacing: .25ch;
      line-height: var(--size-24);

    }

    &-read {
      display: flex;
      justify-content: right;
      align-items: center;
      gap: .25vw;

      i {
        background-color: var(--color-accent-notice);
      }

    }

  }

  &-body {

    display: block;
    white-space: pre-line;
    width: 65ch;
    text-align: left;

    color: rgb(var(--color-mono-800));
    font: {
      size: var(--font-size-20);
      weight: 600;
    }

  }

}

</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue'

  // VUEX
  import { mapActions } from 'vuex';

  // COMPONENTS
  import Icon from '~/components/Icon.vue'

  // TYPE AND INTERFACES
  import type { FORMATED_DATE } 	from '~/store';
  import type { Message }         from '~/store/User/Messages';

  // MODULE
  export default Vue.extend({
    components: {
      Icon
    },
    props: {
      payload: {
        type: Object,
        required: true,
      } as PropOptions<Message>
    },
    data() {
      return {
        date: { Day: '1 Января 2000 г.', Time: '00:00' } as FORMATED_DATE
      }
    },
    async created() {

      this.date = await this.GetLocalTime(this.payload.Date);

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
