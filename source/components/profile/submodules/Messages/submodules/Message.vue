<template>
  <div class="message" :data-status="author.status">
    <span class="message-header">
      <span class="message-header-from">
        {{ author.name || payload.from }}
      </span>
      <hr v-once>
      <span class="message-header-date">
        {{ date.Day }} в {{ date.Time }}
      </span>
      <template v-if="payload.readed">
        <hr>
        <span class="message-header-read">
          <icon name="Okay" /> Прочитанно
        </span>
      </template>
    </span>
    <hr v-once>
    <span v-once class="message-body">{{ payload.message }}</span>
  </div>
</template>

<style lang="scss" scoped>

  .message {

    --border-color: rgb(var(--color-mono-400));

    &[data-status="0"] {
      --border-color: var(--color-accent-edges-200) !important;
    }

    &[data-status="1"] {
      --border-color: var(--color-accent-warning) !important;
    }

    &[data-status="2"] {
      --border-color: var(--color-accent-notice) !important;
    }

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

      &-date {
        height: min-content;
        line-height: normal;
        align-self: center;
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

  import Vue, { PropOptions } from "vue";

  // API
  import { database } from "~/api/database";

  // UTILS
  import { utils } from "~/utils";

  // COMPONENTS
  import Icon from "~/components/common/Icon.vue";

  // TYPE | INTERFACES | NAMESPACES
  import { Message }  from "~/contracts/Message";
  import { User }     from "~/contracts/User";

  // MODULE
  export default Vue.extend({
    components: {
      Icon
    },
    props: {
      payload: {
        type: Object,
        required: true,
      } as PropOptions<Message.struct>
    },
    data() {
      return {

        author: {
          name: String("Placeholdy"),
          status: User.status.User,
        },

        date: utils.getLocalTime(0)

      };
    },
    created() {
      this.date = utils.getLocalTime(this.payload.date);
    },
    mounted() {

      switch (this.payload.from) {

        case "SUPPORT": this.author = {
          name: "Eccheuma Support",
          status: User.status.Support,
        }; break;

        case "ADMIN": this.author = {
          name: "Eccheuma Administration",
          status: User.status.Admin,
        }; break;
      
        default: this.getUser(); break;

      }

    },
    methods: {
      async getUser() {

        const { name, status } = await database.get<User.struct>(`users/${ this.payload.uid }/state`);

        this.author = {
          name: name,
          status: status
        };

      }
    }
  });

</script>
