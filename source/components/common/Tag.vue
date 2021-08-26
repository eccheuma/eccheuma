<template>
  <hardware-acceleration-decorator>
    <span 
    :class="[
      { 'transparent::false': !transparent },
      { 'scheme::light': light },
      { 'utils::glassy': transparent }, 
    ]"
    >
      <slot />
    </span>
  </hardware-acceleration-decorator>
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
      size: var(--font-size-24);
      weight: 500;
			family: var(--decor-font);
    }

    letter-spacing: .1ch;

    background-color: rgba(var(--mono-200), .75);
    border-radius: .7rem;

  }

</style>

<script lang="ts">

  import Vue from 'vue';

  // COMPONENTS
  import HardwareAccelerationDecorator from '~/components/functional/HardwareAcceleration.vue'

  // MODULE
  export default Vue.extend({
    components: {
      HardwareAccelerationDecorator
    },
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
