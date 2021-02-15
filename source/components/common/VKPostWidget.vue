<template>
	<keep-alive :name="'keep-alive-component-'+PostKey">
		<div class="vk_post">
			<div :id="'vk_post_'+ID+'_'+PostKey+''" loading="lazy"></div>
		</div>
	</keep-alive>
</template>

<script>

	import '~/assets/js/openapi.min.js'

	export default {
		props: [
			'ID',
			'PostKey',
			'Hash'
		],
		data() {
			return {

				Init: false,

				LoadBefore: false,

				ElementLoad: true,
				ElementLoadComplete: true,
				LoadMessage: '',
			}
		},
		methods: {
			GetVK_Posts() { /* global VK */

				if ( process.client ) { 
					VK.Widgets.Post(`vk_post_${ this.ID }_${ +this.PostKey }`, this.ID, this.PostKey, this.Hash);
				}

			}
		},
		mounted() { /* global process */

			if( process.client ) {
				this.GetVK_Posts()
			}
			
		},
	}

</script>

<style lang="sass">

.vk_post 
	overflow: hidden
	position: relative
	background-color: $color5
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
		background-color: $color5
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
			color: $color1
			text-align: center
			font-size: $FontSize4
			font-weight: 700 
			line-height: 60px
		i 
			&:nth-child(1) 
				position: absolute
				top: 13px
				left: 15px
				padding: 10px 10px
				background-color: $color1
				color: $color5
				border-radius: 3rem 
			&:nth-child(2) 
				position: absolute
				font-size: 70px
				top: -4px
				left: -15px
				color: $color1
				opacity: .25
				transform: scale(1.75)
				z-index: -1    

</style>