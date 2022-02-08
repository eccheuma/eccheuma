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
    backdrop-filter: unset !important;
  }

  .scheme\:\:light {
    color: rgb(var(--mono-200));
    background-color: rgb(var(--mono-800));
  }

  span {

    cursor: pointer;
    display: flex;

    width: max-content;
    padding: .75vh 4ch 1vh;

    place-items: center;

    color: rgb(var(--mono-800));
    font: {
      size: var(--font-size-24);
      weight: 500;
			family: var(--decor-font);
    }

    background-color: rgba(var(--mono-200), .75);
    border-radius: var(--border-radius);

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
