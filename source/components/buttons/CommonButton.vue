<template>
  <component 
    :is="link ? 'a' : 'button'" 
    ref="button" 
    :class="[
      { 'action': indicator },
      { 'scheme::dark': scheme === 'dark' },
    ]"
  >

    <cursor-visual />

    <span class="pattern_bg">
      <slot />
    </span>

  </component>
</template>

<style lang="scss" scoped>

.scheme\:\:dark {
  --eccheuma-button-text: rgb(var(--color-mono-800));
  --eccheuma-button-color: rgb(var(--color-mono-300));
}

.action {

  animation: eccheuma-button-action 1s alternate infinite;
  @keyframes eccheuma-button-action {
    from {
      border-color: var(--eccheuma-button-text);
      // filter: drop-shadow(0 0 4px var(--eccheuma-button-color));
    }
    to {
      border-color: var(--eccheuma-button-color);
      // filter: drop-shadow(0 0 0 var(--eccheuma-button-color));
    }
  }

}

button, a {

  --eccheuma-button-text: rgb(var(--color-mono-300));
  --eccheuma-button-color: rgb(var(--color-mono-800));

  cursor: pointer;

  display: grid;
  position: relative;

  background: transparent;

	border: 2px solid var(--eccheuma-button-color); 
  border-radius: .7rem;

  padding: 2px;
  min-width: 180px;

  font-size: var(--font-size-14);
  font-weight: 800; 

  span {    
    
    width: 100%;
    height: 100%;
  
    text-align: center;
    line-height: 4vh;

    display: flex;
    justify-content: space-evenly;
    gap: 1vw;

    color: var(--eccheuma-button-text);
    background-color: var(--eccheuma-button-color);
    border-radius: calc(.7rem - 4px);

    padding: 0 2vw;

    transition-duration: .25s;

  }

  transition-duration: .25s;

	&:hover {
		text-decoration: none; 
    background-color: var(--eccheuma-button-color);
	}

}

</style>

<script lang="ts"> 

  import Vue, { PropOptions } from 'vue'

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
      scheme: {
        type: String,
        default: 'light'
      } as PropOptions<'light' | 'dark'>,
      indicator: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {

        soundHash: ''

      }
    },
    created() {

      this.setSounds([
        { file: 'Off',  name: 'ButtonHover', settings: { rate: 1.00, volume: .5 } },
        { file: 'Off',  name: 'ButtonClick', settings: { rate: 1.25, volume: .5 } },
      ])

    },
    mounted() {

      const ELEMENT = this.$refs.button as HTMLElement;

      if ( this.link ) {
        ELEMENT.setAttribute('href', this.link)
      }

      ELEMENT.addEventListener('mouseenter',  () => this.playSound(this.Sounds.get('ButtonHover')!));
      ELEMENT.addEventListener('click',       () => this.playSound(this.Sounds.get('ButtonClick')!))

    }
  })

</script>
