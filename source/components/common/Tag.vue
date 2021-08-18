<template>
  <span 
  :class="[
    { 'utils::glassy': transparent && !$isMobile }, 
    { 'transparent::false': !transparent },
    { 'scheme::light': light }
  ]"
  >
    <slot />
  </span>
</template>

<style lang="scss" scoped>

  .transparent\:\:false {
    background-color: rgba(var(--mono-200), 1);
  }

  .scheme\:\:light {
    color: rgb(var(--mono-200));
    background-color: rgb(var(--mono-800));
  }

  span {

    padding: .5vh 2vw 1vh;
    color: rgb(var(--mono-800));

    width: max-content;
    height: max-content;

    cursor: pointer;

    font: {
      size: var(--font-size-2);
      weight: 500;
			family: var(--decor-font);
    }

    letter-spacing: .1ch;

    background-color: rgba(var(--mono-200), .75);
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
      },
      light: {
        type: Boolean,
        default: false
      }
    }
  })

</script>
