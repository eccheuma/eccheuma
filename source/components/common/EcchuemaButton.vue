<template>
	<button :id="ID" @click="EmitSound('Out', { rate: 1.25, volume: .25 })">
		<cursor-visual />

		<slot />

	</button>
</template>

<style lang="scss" scoped>

	button {
		@include light-button;
		position: relative;
	}

</style>

<script lang="ts">

	import Vue from 'vue'

	// MIXINS
	import HashGenerator 		from '~/assets/mixins/HashGenerator.ts'
	import EmitSound 				from '~/assets/mixins/EmitSound.ts'

	// MODULE
	export default Vue.extend({
		components: {
			CursorVisual: 	() => import('~/components/common/CursorFX.vue'),
		},
		mixins: [ HashGenerator, EmitSound ],
		data() {
			return {
				ID: '',
			}
		},
		created() {
			this.ID = `EccheumaButton-${ this.HashGenerator(6) }`
		}
	})

</script>
