<template>
  <nav class="navigation-container">
    <span>
      <icon name="Menu" />
      Навигация
    </span>
  </nav>
</template>

<style lang="scss">

.navigation {
  &-container {

    @include gradient_border;

    position: sticky;
    top: -1px;
    left: 0;

    background-color: rgb(var(--color-mono-200));
    height: $GLOBAL-HeaderHeight;
    display: flex;
    place-content: center;

    z-index: 1010;

    span {
      display: grid;
      font: {
        family: var(--decor-font);
        size: var(--font-size-24);
        weight: 500;
      }

      letter-spacing: .25ch;
      line-height: var(--font-size-24);
    }

    i {
      @include icon-size(6vh);
      fill: var(--color-accent-edges-300);
    }

  }
}

</style>

<script lang="ts">

  import Vue from 'vue'

// COMPONETS
	import Popover 							from '~/components/common/Popover.vue'
	import Icon									from '~/components/common/Icon.vue'

// MODULE
  export default Vue.extend({
    components: {
      Icon
    }
  })

</script>
