<template>
	<div class="vk_post">
		<div :id="`vk_post_${ payload.ID }_${ payload.PostKey }`" />
	</div>
</template>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// TYPES
	type VK_POST = {
		ID: string
		PostKey: number,
		Hash: string,
	}

	interface VK {
		Widgets: {
			Post: (link: string, id: string, key: number, hash: string) => void
		}
	}

	// MODULE
	export default Vue.extend({
		props: {
			payload: {
				type: Object,
				required: true,
			} as PropOptions<VK_POST>
		},
		data() {
			return {

				Init: false,

				LoadBefore: false,

				ElementLoad: true,
				ElementLoadComplete: true,
				LoadMessage: '',
			}
		},
		mounted() {

			if ( this.CLIENT_RENDER_CHECK ) { this.getAPI() }
			
		},
		methods: {  

			/* global VK */ 

			getAPI() { 
				
				// import('~/assets/js/openapi.min.js').then(this.getPosts)

				require('~/assets/js/openapi.min.js'); this.getPosts()

			},

			getPosts() {

				if ( process.client ) { 
					(VK as unknown as VK).Widgets.Post(
						`vk_post_${ this.payload.ID }_${ this.payload.PostKey }`,
						this.payload.ID,
						this.payload.PostKey,
						this.payload.Hash
					);
				}

			}

		},
	})

</script>

<style lang="sass">

.vk_post 
	overflow: hidden
	position: relative
	background-color: rgb(var(--color-6))
	margin-bottom: 10px
	border-radius: .7rem
	&_container
		padding: 4px
	&_wrapper
		margin-top: 10px
		padding-right: 5px
		height: 70vh
		overflow-y: scroll
		border-radius: .7rem
	&_header 
		background-color: rgb(var(--color-6))
		border-radius: .7rem
		position: sticky
		overflow: hidden
		top: 5px
		height: 60px
		width: 100%
		z-index: 10
		span 
			// background-color: green
			display: block
			color: rgb(var(--color-1))
			text-align: center
			font-size: var(--font-size-4)
			font-weight: 700 
			line-height: 60px
		i 
			&:nth-child(1) 
				position: absolute
				top: 13px
				left: 15px
				padding: 10px 10px
				background-color: rgb(var(--color-1))
				color: rgb(var(--color-6))
				border-radius: 3rem 
			&:nth-child(2) 
				position: absolute
				font-size: 70px
				top: -4px
				left: -15px
				color: rgb(var(--color-1))
				opacity: .25
				transform: scale(1.75)
				z-index: -1    

</style>