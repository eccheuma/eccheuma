<template>
	<div class="service_modal">

		<Loader
			:ElementLoad="LoaderStatus.Load"
			:ElementLoadComplete="LoaderStatus.Loaded">
			{{ LoaderMessage }}
		</Loader>

		<span class="service_modal-background"></span> 

		<div class="service_modal-container">
			<div class="service_modal-body">
				<div class="container-fluid">
					<div class="row justify-content-center">

						<div class="col-auto mr-auto service_modal-body-user">
							<p v-if="!LoginStatus">Вы не зарегистрированы</p>
							<template v-else>
								<div class="col-auto service_modal-body-user-wrap">
									<span
										:style="`background-image: url(${ UserState.UserImageID })`">
									</span>
									<p>{{ UserState.UserName }}</p>
									<p>{{ UserState.UserBalance }} ₽</p>
								</div>
							</template>
						</div>

						<div class="col">
							<cost-calc @curent-service="SetSelectedService" :default-category="serviceType" :category-defined="true" />
						</div>

					</div>
				</div>
			</div>
			<div class="service_modal-footer">
				<div class="container">
					<div class="row justify-content-center">
						<div class="col-auto">
							<button 
								:class="{ NonActive: !LoginStatus }"
								@click="SendRequest">
								Отправить заявку
							</button>
						</div>
						<div class="col-auto">
							<button 
								@click="CloseModal">Отменить
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	import CostCalc from '~/components/service/CostCalc.vue'
	import Loader from '~/components/common/Loader.vue'

	import { mapState, mapActions, mapMutations } from 'vuex'
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES
	import type { SELECTED_SERVICE, CATEGOTIES } from '~/types/Services.ts'

	export default Vue.extend({
		components: { CostCalc, Loader },
		props: {
			serviceType: {
				required: true
			} as PropOptions<CATEGOTIES>
		},
		data() {
			return {

				SelectedService: {} as SELECTED_SERVICE

			}
		},
		computed: {
			...mapState({

				LoginStatus: 		state => ( state as VuexModules ).Auth.Auth.LoginStatus,
				UserState: 			state => ( state as VuexModules ).User.State.UserState,
				LoaderMessage: 	state => ( state as VuexModules ).Loader.Message,
				LoaderStatus: 	state => ( state as VuexModules ).Loader.Status,

			}),
		},
		methods: {

			...mapMutations({
				Loader_ChangeLoadMessage: 'Loader/Loader_ChangeLoadMessage',
			}),

			...mapActions({
				Loader_Load: 'Loader/Loader_Load',
				SendWorkRequest: 'User/WorkRequest/SendWorkRequest'
			}),

			SetSelectedService(_service: SELECTED_SERVICE) {
				this.SelectedService = _service 
			},

			CloseModal() {

				this.$emit('close-modal')

			},

			SendRequest() {

				this.Loader_ChangeLoadMessage('Отправка запроса'); this.Loader_Load()

				this.SendWorkRequest(this.SelectedService)

			}
			
		}
	})
</script>


<style lang="sass">

.service_modal
	position: fixed
	top: 0
	left: 0
	height: 100vh
	width: 100vw
	z-index: 3000
	color: $color5
	&-background
		position: absolute
		top: 0
		height: 100vh
		width: 100vw
		z-index: -1
		background-color: rgba($color1,.25)
	&-container
		position: absolute
		top: 5vh
		height: 90vh
		width: 90vw
		margin: 0 5vw
	&-header
		height: 40px
		width: 100%
		padding: 10px 0px 10px
		background-color: $color3
		z-index: 9999
		>span
			display: block
			width: 100%
			text-align: center
			&:nth-of-type(1)
				font-size: 18px
				font-weight: 700
			&:nth-of-type(2)
				font-size: 12px
				font-weight: 700
	&-body
		overflow: hidden
		background-color: $color1
		border: 1px solid $color3
		border-radius: .7rem
		height: 70vh
		@extend %gradient_border
		&-user
			min-width: 180px
			max-width: 270px
			padding: 20px 20px
			margin: auto
			border-right: 1px solid $color3
			span
				margin: 20px auto
				display: block
				height: 80px
				width: 80px
				border-radius: 100%
				border: 3px solid $color5
				background-position: center center
				background-size: cover
			p  
				text-align: center
				font-weight: 700
				font-size: 12px
				color: $color4
		&-input
			padding: 40px 40px 10px
			border-right: 1px solid $color3
			p  
				margin: 0px 0px 5px
				padding: 0px 10px 0px
				font-weight: 700
				font-size: 14px
				color: $color4
			select
				outline: none
				margin: 0px 0px 20px
				padding: 7px 10px
				width: 100%
				border-radius: .7rem
				background-color: $color1
				border: 1px solid $color3
				color: $color4
				font-weight: 700
				font-size: 12px
			option
				background-color: $color2
				font-size: 14px
				line-height: 20px
				padding: 20px
	&-footer
		position: absolute
		background-color: $color1
		bottom: 0px
		width: 100%
		padding: 20px
		border: 1px solid $color2
		border-radius: .7rem
		border: 1px solid $color3
		button
			display: block
			width: 200px
			font-size: 12px
			padding: 6px 20px
			margin: 5px 0px 10px
			@extend %button_light

</style>