<template>

  <intesection-component :ignite="true" @isIntersecting="setVisiableStatus">
    <div 
      class="order-container"
      :style="randomCirclePosition"
      :data-status="payload.status"
      >
      <section v-once class="order-header">
        Информация о заказе <br> «{{ payload.name }}»
      </section>
      <hr>
      <section class="order-info">
        <template v-for="item in infoList">
          <span :key="item.name" :data-type="item.type">{{ item.name }}: <strong>{{ item.value }}</strong></span>
        </template>
      </section>
      <hr>
      <section class="order-time">

        <!-- // ! Refactor status templating -->

        <span v-if="payload.status === 2">Ориентировочное рассмотрения заявки составит</span>
        <span v-if="payload.status === 3">Ориентировочное время сдачи заказа</span>
        
        <big ref="deliveryTimer" style="opacity: 0">
          <template v-if="waintingTime.days">
            {{ waintingTime.days }} {{ formatSuffix(waintingTime.days, ['день', 'дня', 'дней']) }}
          </template>
            {{ waintingTime.hours }} {{ formatSuffix(waintingTime.hours, ['час', 'часа', 'часов']) }}
            {{ waintingTime.minutes }} {{ formatSuffix(waintingTime.minutes, ['минута', 'минуты', 'минут']) }}
        </big>

      </section>
      <hr>
      <section v-once class="order-decline">
        <common-button>
          Отозвать заказ
        </common-button>
      </section>
    </div>
  </intesection-component>

</template>

<style lang="scss">
  .order {
    &-container {

      min-height: 30vh;
      height: min-content;

      background: rgb(var(--color-mono-300));

      border-radius: var(--border-radius);
      overflow: hidden;

      text-align: center;

      @extend %pattern-lines;

      &[ data-status = "0" ] {
        border: 1px solid transparent;
      }

      &[ data-status = "1" ] {
        border: 1px solid rgb(var(--color-mono-600));
      }

      &[ data-status = "2" ] {
        border: 1px solid var(--color-accent-notice);
      }

      &[ data-status = "3" ] {
        border: 1px solid var(--color-accent-warning);
      }

      &[ data-status = "4" ] {
        border: 1px solid var(--color-accent-pass);
      }

      &[ data-status = "5" ] {
        border: 1px solid var(--color-accent-edges-100);
      }

      &[ data-status = "6" ] {
        border: 1px solid var(--color-accent-error);
      }

      &::after {

        --s: 800px;

        content: '';
        pointer-events: none;

        position: absolute;
        top: calc(var(--t, 0) - (var(--s) / 2));
        left: calc(var(--l, 0) - (var(--s) / 2));

        width: var(--s);
        aspect-ratio: 1/1;

        border: 2px dashed var(--color-accent-edges-100);
        border-radius: 100%;
        z-index: -1;

        animation: rotateCircle 5s infinite;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        animation-play-state: paused;
        @keyframes rotateCircle {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(10deg);
          }
        }

      }

      transition-duration: 500ms;
      &:hover {

        transform: translate(0, 1vh);
        &:after {
          animation-play-state: running;
        }

      }

      hr {
        display: block;
        width: 66%;
        margin-inline: auto;
        background: rgb(var(--color-mono-500));
      }

      section {
        padding: 2vh 2vw;
      }

    }
    &-header {

      font: {
        size: var(--font-size-42);
        family: var(--decor-font);
      }

      letter-spacing: .15ch;

    }
    &-info {

      span {

        @include gradient-border;

        justify-content: space-between;
        display: flex;
        text-align: left;

        background-color: rgb(var(--color-mono-200));
        color: rgb(var(--color-mono-800));

        margin-block: 1vh;
        padding: 1vh 2vw;

        border-radius: var(--border-radius);

        &[data-type="id"] {
          strong {
            text-decoration: underline;
          }
        }

      }
    }
    &-time {

      span {
        
        display: block;
        font: {
          size: var(--font-size-36);
          family: var(--decor-font);
        }

        letter-spacing: .15ch;

      }

      big {

        font: {
          size: var(--font-size-42);
          weight: 900;
          // family: var(--decor-font);
        }

        // letter-spacing: .15ch;
        line-height: 10vh;

      }

    }
    &-decline {
      display: flex;
      place-content: center;

      padding-block: 2vh;

    }
  }
</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue';

  // VUEX
	import { mapState, mapMutations, mapActions } from 'vuex';
	import type { VuexMap } from '~/types/VuexMap';

  // UTILS
  import { utils } from '~/utils';
  import { work } from '~/utils/status';

  // FUNCTIONAL
    import IntesectionComponent from '~/components/functional/intersectionComponent.vue';

  // COMPONENTS
    import CommonButton	from '~/components/buttons/CommonButton.vue';

  // Namespace
  import { Purchase } from '~/types/Services';

  type WAITING_TIME_FORMAT = {
    days: number
    hours: number
    minutes: number
  }

  type ORDER_INFO_FIELD = { name: string, value: string, type?: string };

  const QUEUE_TIME = 259_200_000;

  // MODULE
  export default Vue.extend({
    components: { 
      CommonButton, 
      // FUNCTIONAL
      IntesectionComponent
    },
    props: {
      payload: {
        type: Object,
        required: true,
      } as PropOptions<Purchase.order<any>>
    },
    data() {
      return {

        visiableStatus: false,

        ticker: undefined as NodeJS.Timeout | undefined,

        waintingTime: {
          days: 0,
          hours: 0,
          minutes: 0,
        } as WAITING_TIME_FORMAT,

        infoList: [] as Array<ORDER_INFO_FIELD>,

        randomCirclePosition: {
          '--t': `${ Math.trunc(Math.random() * 100) }%`,
          '--l': `${ Math.trunc(Math.random() * 100) }%`,
        }

      };
    },
    computed: {

      ...mapState({
        Lang : state => (state as VuexMap).App.Lang
      }),

      releaseDate(): number {
        return this.payload.accepted + this.payload.delivery;
      },

      acceptDate(): number {
        return this.payload.recived + QUEUE_TIME;
      }

    },
    created() {

      if ( process.browser ) {

        const timerWatcher = this.$watch('waintingTime', () => {
  
          this.$AnimeJS({
            targets: this.$refs.deliveryTimer,
            opacity: [0, 1],
            duration: 750,
            easing: 'easeInOutQuad',
            complete: timerWatcher
          });
  
        });

      }

    },
    mounted() {

      this.infoList = this.getInfo();

      switch (this.payload.status) {

        case Purchase.status.Queue: 
          this.startTicker(this.acceptDate); break;

        case Purchase.status.Process: 
          this.startTicker(this.releaseDate); break;

      }

    },
    beforeDestroy() {

      if ( this.ticker ) {
        clearInterval(this.ticker);
      }

    },
    methods: {

      startTicker(dateType: number) {
        this.ticker = setInterval(() => {
          if ( this.visiableStatus ) {
            this.waintingTime = this.getAwaitTime(dateType);
          }
        }, 1000);
      },

      getAwaitTime(awaitDate: number): WAITING_TIME_FORMAT {

        const DAYS    = ( awaitDate - Date.now() ) / 86_400_000;
        const HOURS   = ( DAYS  % 1 ) * 24;
        const MINUTES = ( HOURS % 1 ) * 60;

        return {
          days: Math.trunc(DAYS),
          hours: Math.trunc(HOURS),
          minutes: Math.trunc(MINUTES),
        };

      },

      setVisiableStatus(status: boolean): void {
        this.visiableStatus = status;
      },

      // TODO | Refactor keys with enums
      getInfo(): Array<ORDER_INFO_FIELD> {

        const { Day, Time } = utils.getLocalTime(this.payload.recived);

        return [
          { name: 'Состояние',          value: work.defineStatus(this.payload.status, this.Lang) },
          { name: 'Цена',               value: `${ this.payload.cost } ₽` },
          { name: 'Дата заказа',        value: `${ Day } в ${ Time }` },
          { name: 'Тип Заказа',         value: this.getOrderType(this.payload.type) },
          { name: 'Индификатор заказа', value: this.payload.ID, type: 'id' },
        ];

      },

      formatSuffix(n: number, variants: Array<string>): string {

        const Remainder: number = n % 20;

        switch (Remainder) {

          case 0: return variants[2];
          case 1: return variants[0];

          default: {
            return variants[Remainder < 5 ? 1 : 2];  
          }

        }

      },

      getOrderType(type: number): string {
        return this.payload.category[type];
      }

    }
  });

</script>
