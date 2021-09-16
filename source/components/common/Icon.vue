<style lang="scss">

  $size: 21px;

  .icon {

    display: block;
    margin: auto;

    width:  $size;
    height: $size;

    background: transparent !important;
    padding: 0 !important;
    fill: white;

    svg {
      width:  100% !important;
      height: 100% !important;
      display: flex;
      transition: inherit;
      fill: inherit;
      path {
        place-self: center;
        fill: inherit;
        stroke: inherit;
        transition: inherit;
      }
    }

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
    render(h) {
      return h('i', { 
        class: 'icon',
        domProps: {
          innerHTML: require(`~/assets/icons/Icon=${ this.name }.svg?include`)
        },
      })
    },
  })

</script>
