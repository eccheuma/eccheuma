<style lang="scss">

  $size: 21px;

  .icon {

    display: block;
    margin: auto;

    width:  $size;
    height: $size;

    background: transparent !important;
    padding: 0 !important;

    svg {
      width:  100% !important;
      height: 100% !important;
      display: flex;
      transition: inherit;
      path {
        place-self: center;
        fill: var(--svg-fill, rgb(var(--color-mono-500)));
        transition: inherit;
      }
    }

  }

</style>

<script lang="ts">

  // <template>
  //   <i class="icon" :style="`-webkit-mask-image: url(${ require(`~/assets/icons/Icon=${ name }.svg`) })`" />
  // </template>

  import Vue, { PropOptions } from 'vue'

  export default Vue.extend({
    props: {
      name: {
        type: String,
        default: 'JS'
      } as PropOptions<string>
    },
    render(h) {
      return h('i', { 
        class: 'icon',
        domProps: {
          innerHTML: require(`~/assets/icons/Icon=${ this.name }.svg?include`)
        } 
      })
    },
  })

</script>
