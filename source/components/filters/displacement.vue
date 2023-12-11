<template>
  <svg xmlns="http://www.w3.org/2000/svg">
    <filter 
      :id="`filter::${ name }`" 
      :width="`${ 110 + (updatedScale / 3) }%`" 
      :height="`${ 110 + (updatedScale / 3) }%`" 
      >
      <feTurbulence 
        type="turbulence" 

        baseFrequency=".95 0" 
        numOctaves="2" 
        seed="1" 
        stitchTiles="stitch" 

        width="100%" 
        height="100%"

        x="0"
        y="0" 

        result="turbulence"
      />
      <feDisplacementMap
      
        in="SourceGraphic" 
        in2="turbulence" 
        :scale="updatedScale" 

        xChannelSelector="A" 
        yChannelSelector="A" 

        width="100%" 
        height="100%"

        x="0"
        y="0" 

        result="displacementMap"
      />
      <feOffset 
        :dx="updatedScale / -3" 
        :dy="updatedScale / -3" 

        width="100%" 
        height="100%" 

        x="0"
        y="0"

        in="displacementMap" 
        result="offset"
      />
    </filter>
  </svg>
</template>

<style lang="scss" scoped>

  svg {
    position: absolute; z-index: -1; height: 100%; width: 100%;
  }

</style>

<script lang="ts">

  import Vue from "vue";

  // TYPES
  import type { AnimeAnimParams } from "animejs";

  // MODULE
  export default Vue.extend({
    props: {
      name: {
        type: String,
        default: "000000"
      },
      status: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        updatedScale: 0,
      };
    },
    watch: {
      status: {
        handler() {
          this.animate(100 + Math.trunc(50 * Math.random()));
        }
      }
    },
    methods: {
      animate(to: number, params?: AnimeAnimParams ): Promise<void> {

        return new Promise((resolve) => {
          this.$AnimeJS({
            targets: this.$data,
            updatedScale: [0, to],
            duration: 500,
            direction: this.status ? "normal" : "reverse",
            round: 1,
            easing: "easeInOutCubic",
            complete: () => resolve(),

            ...params

          });
        });

      }
    }
  });

</script>
