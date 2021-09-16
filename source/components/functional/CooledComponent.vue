<script lang="ts">

  import Vue from 'vue'

  // MODULE
  export default Vue.extend({
    props: {
      active: {
        type: Boolean,
        default: true,
      }
    },
    render(h) {
      
      return this.$slots.default![0];

    }    
  })

</script>
