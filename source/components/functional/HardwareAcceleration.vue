<script lang="ts">

  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        GPU: true,
      };
    },  
    created() {
      
      if ( process.browser && !this.application.gpu.available() ) {
        this.GPU = false;
      }

      return this.$slots.default;

    },
    mounted() {

      if ( !this.GPU ) {
        (this.$el as Element).classList.add("utils::dead-GPU");
      }

    },
    render(): any {
      return this.$slots.default;
    }
  });

</script>

<style lang="scss">

  .utils\:\:dead-GPU {

    transition: {
      duration: 0ms !important;
      timing-function: steps(1) !important;
    };

    filter: unset !important;
    backdrop-filter: unset !important;

  }
  
</style>
