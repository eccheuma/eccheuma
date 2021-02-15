<template>
	<div class="AdminPanel_Wrap">
		<template v-if="UserState.UserID == 'tGOrAx0PyvWmxQ64gYcUxn3roNB3' || DEV ">
			<div class="fluid-container">
				<div class="row">
					<div class="col-3 AdminPanel_Catigories">
						<div class="row">
							<span>
								Escape From Mordorland CMS 
							</span>
							<span>
								Тестовый вариант админки | v - 0.1.12
							</span>
						</div>
						<hr>
						<div class="row">
							<button @click="SwitchOn('Messages')"> Личные сообщения </button>
							<button @click="SwitchOn('LoadPost')"> Посты </button>
							<button @click="SwitchOn('LoadGalleryImage')"> Галлерея </button>
							<button> Рекомендации </button>
							<button @click="SwitchOn('LoadPortfolioCase')"> Портфолио </button>
							<button> Сервис </button>
						</div>
						<div class="row">

						</div>
					</div>
					<div class="col AdminPanel_Input">
						<div class="row AdminPanel_Input_Header">
							<span>YOU NOT SHOULD PASS!1!</span>
						</div>
						<hr>
						<div class="row AdminPanel_Input_Body justify-content-center">

							<component :is="CurentComponent" />

						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'  

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	export default Vue.extend({
		props: [

		],
		components: {
			LoadGalleryImage: () => import  ( '~/components/AdminPanel/LoadGalleryImage.vue' ),
			LoadPortfolioCase: () => import  ( '~/components/AdminPanel/LoadPortfolioCase.vue' ),
			LoadPost: () => import  ( '~/components/AdminPanel/LoadPost.vue' ),
			Messages: () => import  ( '~/components/AdminPanel/Messages.vue' ),
		},
		data() {
			return {
				
				CurentComponent: 'LoadGalleryImage',

			}
		},
		computed: {
			...mapState({
				UserState: state	=> (state as VuexModules).User.State.UserState,
			}),
			DEV(): boolean { /* global process */
				return process.env.NODE_ENV == `development`
			}
		},
		methods: {
			SwitchOn(target: string): void {

				this.CurentComponent = target

			}
		},
	})

</script>

<style lang="sass">

.AdminPanel
	&_Catigories
		background-color: $color2
		height: 100vh
		@extend %gradient_border
		span
			&:nth-of-type(1)
				display: block
				padding: 20px 0 0px
				width: 100%
				text-align: center
				font-size: 18px
				font-weight: 700
				color: $color5
			&:nth-of-type(2)
				display: block
				padding: 4px 0 0px
				width: 100%
				text-align: center
				font-size: 12px
				font-weight: 700
				color: $color4
		button
			display: block
			width: 80%
			margin: 20px 10% 10px
			font-size: 12px
			padding: 10px 0px
			@extend %button_light
	&_Input
		overflow-y: scroll
		background-color: $color1
		height: 100vh
		&_Body
			height: 700px
		>hr
			background-color: $color2
		&_Header
			height: 40px
			border-left: 1px solid $color2
			span
				&:nth-of-type(1)
					display: block
					width: 100%
					padding: 15px 40px
					text-align: center
					font-size: 18px
					font-weight: 700
					color: $color5
	&_Wrap
		width: 100vw
		h3
			color: $color5

</style>