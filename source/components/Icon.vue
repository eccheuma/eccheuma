<template>
  <i class="icon" :style="`-webkit-mask-image: url(${ require(`~/assets/icons/Icon=${ name }.svg`) })`" />
</template>

<style lang="scss">

  $size: 21px;

  .icon {

    display: block;
    margin: auto;

    width:  $size;
    height: $size;

    background-color: rgb(var(--color-5));

    mask: {
      size: contain;
      repeat: no-repeat;
    };

  }

</style>

<script lang="ts">

  import Vue, { PropOptions } from 'vue'

  export default Vue.extend({
    props: {
      name: {
        type: String,
        default: 'JS'
      } as PropOptions<string>
    },
  })

</script>
