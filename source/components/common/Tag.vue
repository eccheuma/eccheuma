<template>
  <span :class="[{ 'utils::glassy': transparent && !$isMobile }, { 'transparent::false': !transparent }]">
    <slot />
  </span>
</template>

<style lang="scss" scoped>

  .transparent\:\:false {
    background-color: rgba(var(--color-def-1), 1) !important;
  }

  span {

    padding: 1vh 2vw;
    color: rgb(var(--color-def-5));

    width: max-content;

    font: {
      size: var(--font-size-5);
      weight: 700;
    }

    background-color: rgba(var(--color-def-1), .75);
    border-radius: .7rem;

  }

</style>

<script lang="ts">

  import Vue from 'vue'

  // MODULE
  export default Vue.extend({
    props: {
      transparent: {
        type: Boolean,
        default: true,
      }
    }
  })

</script>
