<template>
  <div class="caption-container" :data-status="status">
    <span class="caption-icon">
      <icon name="Info" /> 
    </span>
    <hr v-once>
    <div class="caption-content">
      <span class="caption-content-type">
        <slot name="type" />
      </span>
      <hr v-once>
      <span class="caption-content-desc">
        <slot name="desc" />
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.caption {
  &-icon {
    display: flex;
    place-content: center;
    width: min-content;
    margin: auto;
    aspect-ratio: 1/1;
    border: 2px solid var(--caption-card-color);
    border-radius: 100%;
    padding: .5vh;
    i {
      @include icon-size(4vh);
      fill: var(--caption-card-color);
    }
  }
  &-container {

    --caption-card-bg: rgb(var(--color-mono-900));
    --caption-card-color: rgb(var(--color-mono-200));

    display: grid;
    grid-template: {
      columns: auto 1px 1fr;
    };

    padding-right: 15%;

    column-gap: 1vw;
    align-items: center;

    border-radius: var(--border-radius);
    background-color: var(--caption-card-bg);
    color: var(--caption-card-color);
    padding: 1vw;

    @media screen and ( max-width: $mobile-breakpoint ) {
			padding: 2vw 3vw;
      column-gap: min(8px, 4vw);
		};

    hr {
      width: 1px;
      height: 100%;
      background-color: var(--caption-card-color);
      margin: 0;
    }

    // &:last-child {
    //   display: block;
    //   width: 100%;
    // }

    &[data-status="error"] {
      --caption-card-bg: var(--color-accent-error);
      --caption-card-color: rgb(var(--color-mono-300));
    }

    &[data-status="warning"] {
      --caption-card-bg: var(--color-accent-warning);
      --caption-card-color: rgb(var(--color-mono-200));
    }

    &[data-status="notice"] {
      --caption-card-bg: var(--color-accent-notice);
      --caption-card-color: rgb(var(--color-mono-200));
    }

    &[data-status="missunderstood"] {
      --caption-card-bg: var(--color-accent-edges-100);
      --caption-card-color: rgb(var(--color-mono-800));
    }

  }
  &-content {

    &-type {
      width: 45ch;
      color: var(--caption-card-color) !important;
      line-height: var(--size-14);
      font: {
        size: var(--font-size-16);
        weight: 800;
      }
    }

    hr {
      width: 100%;
      background: var(--caption-card-color);
      margin: 1vh 0;
      opacity: .25;
      @media screen and ( max-width: $mobile-breakpoint ) {
        margin: min(4px, 1vh) 0;
      }; 
    }

    &-desc {
      display: flex;
      color: var(--caption-card-color) !important;
      width: calc(min(100%, 75ch));
      font: {
        size: var(--font-size-14);
        weight: 700;
      }
    }

  }
}

</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue';

// COMPONENTS
  import Icon from '~/components/common/Icon.vue';

// TYPES
  type CAPTION_STATUS = 'error' | 'warning' | 'notice' | 'missunderstood' | 'default'

// MODULE
  export default Vue.extend({
    components: {
      Icon
    },
    props: {
      status: {
        type: String,
        default: 'default'
      } as PropOptions<CAPTION_STATUS>,
    },
  });

</script>
