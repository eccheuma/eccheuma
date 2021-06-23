<template>
  <component :is="link ? 'a' : 'button'" ref="button" :style="`--color: ${ color }`">

    <cursor-visual />

    <span>
      <slot />
    </span>
  </component>
</template>

<style lang="scss" scoped>

button, a {

  cursor: pointer;

  display: grid;
  position: relative;

  background: transparent;

	border: 2px solid rgb(var(--color)); 
  border-radius: .7rem;

  padding: 2px;

  font-size: var(--font-size-5);
  font-weight: 700; 

  span {    
    
    width: 100%;
    height: 100%;
  
    text-align: center;
    line-height: 4vh;

    color: rgb(var(--color-2));
    background-color: rgb(var(--color));
    border-radius: calc(.7rem - 4px);

    padding: 0 2vw;

    transition-duration: .25s;

  }

  transition-duration: .25s;
	&:hover {

		text-decoration: none; 

    span {
      color: rgb(var(--color-5));
      background-color: transparent;
    }

	}

}

</style>

<script lang="ts"> 

  import Vue from 'vue'

  // MIXINS
	import EmitSound      from '~/assets/mixins/EmitSound'
  import HashGenerator  from '~/assets/mixins/HashGenerator'
  
  // MODULE
  export default Vue.extend({
    components: {
			CursorVisual: 	() => import('~/components/common/CursorFX.vue'),
		},
    mixins: [ EmitSound, HashGenerator ],
    props: {
      link: {
        type: String,
        default: null,
      },
      color: {
        type: String,
        default: 'var(--color-6)'
      }
    },
    data() {
      return {

        soundHash: ''

      }
    },
    created() {

      this.setSounds([{ file: 'Off', name: 'Button', settings: { rate: 1.25, volume: .5 } }])

    },
    mounted() {

      const ELEMENT = this.$refs.button as HTMLElement;

      if ( this.link ) {
        ELEMENT.setAttribute('href', this.link)
      }

      ELEMENT.addEventListener('mouseenter', () => this.playSound(this.Sounds.get('Button')!))

    }
  })

</script>
