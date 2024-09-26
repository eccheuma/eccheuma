<template>
  <svg class="filter" style="display: none" xmlns="http://www.w3.org/2000/svg">

    <filter 
      id="noiseFilter" 
      x="-20%" 
      y="-20%" 
      width="140%" 
      height="140%" 
      filterUnits="objectBoundingBox" 
      primitiveUnits="userSpaceOnUse" 
      color-interpolation-filters="linearRGB"
      >
      <feTurbulence 
        type="turbulence" 
        baseFrequency=".75 .75" 
        numOctaves="1" 
        :seed="seed" 
        x="0%" 
        y="0%" 
        width="100%" 
        height="100%" 
        result="turbulence"
      />
      <feColorMatrix 
        type="saturate" 
        values="0" 
        x="0%" 
        y="0%" 
        width="100%" 
        height="100%" 
        in="turbulence" 
        result="colormatrix"
      />
      <feBlend 
        mode="soft-light" 
        x="0%" 
        y="0%" 
        width="100%" 
        height="100%" 
        in="colormatrix" 
        in2="SourceGraphic" 
        result="blend"
      />
    </filter>

  </svg>
</template>

<script lang="ts">

  import Vue from "vue";

  export default Vue.extend({
    props: {
      hash: {
        type: String,
        default: "000000"
      },
    },
    data() {
      return {
        seed: 1,
      };
    },
    mounted() {
      // this.updateSeed(); 
    },
    methods: {
      updateSeed() {
        requestAnimationFrame(() => {
          this.seed = Math.trunc(Math.random() * 100); this.updateSeed();
        });
      }
    }
  });

</script>
