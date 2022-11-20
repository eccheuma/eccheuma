<script lang="ts">

  import Vue from 'vue';

  export default Vue.extend({
  });

</script>

<template>
  <section class="notion">
    <slot />
  </section>
</template>

<style lang="scss">

  .notion {
    font-weight: 700;
    font-size: var(--font-size-14);
    width: calc(min(75%, 130ch));
    color: rgb(var(--color-mono-400));
    line-height: var(--size-24);
    margin: 0;
    place-self: center;
    text-align: center;

    a {
      color: var(--color-accent-edges-200)
    }

  }

</style>