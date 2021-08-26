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
    // render(h): any {

    //   const slotDef     = this.$slots.default![0];
    //   const activeClass = this.active ? 'utils::cooled' : null;

    //   try {

    //     slotDef.data?.class = activeClass;
        
    //   } catch (error) {
    //     console.debug(error);
    //   }
      
    //   return slotDef;

    // }    
  })

</script>
