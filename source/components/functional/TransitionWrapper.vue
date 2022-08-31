<script lang="ts">

  import Vue, { FunctionalComponentOptions } from 'vue';

  // MODULE
  export default Vue.extend<FunctionalComponentOptions>({
    functional: true, 
    render(createElement, context) {
      return createElement(
        'transition', 
        { 
          props: { 
            name: 'opacity-transition',
            mode: 'out-in'
          },
        }, 
        context?.children
      );
    }
  });

</script>
