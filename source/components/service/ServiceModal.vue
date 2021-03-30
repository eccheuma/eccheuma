<template>
	<div class="service_modal-container">

		<Loader
			:ElementLoad="LoaderStatus.Load"
			:ElementLoadComplete="LoaderStatus.Loaded">
			{{ LoaderMessage }}
		</Loader>

		<section class="service_modal-user">
			<i :style="`background-image: url(${ UserState.UserImageID })`" />
			<span>{{ UserState.UserName }}</span>
			<span>{{ UserState.UserBalance }} ₽</span>
		</section>
		<section class="service_modal-calc">
			<cost-calc :default-category="serviceType" :category-defined="true" @curent-service="SetSelectedService" />
		</section>
		<section class="service_modal-footer">
			<button @click="SendRequest">
				Отправить заявку
			</button>
			<button @click="CloseModal">
				Отменить
			</button>
		</section>

	</div>
</template>

<style lang="scss">

.service_modal {
	&-container {

		position: fixed; top: 0; left: 0; z-index: 9999;

		padding: 5vh 3vw;

		display: grid;
		grid-template: {
			columns: 2fr 8fr;
			rows: 8fr 2fr;
			areas: 	'user calc'
							'footer footer'
		}

		column-gap: 2vw;

		width: 100vw; height: 100vh;

		background: {
			color: rgba(var(--color-1), .95);
		}

	}
	&-user {

		display: inline-grid;
		justify-content: center;
		align-content: center;

		border: {
			right: 1px solid rgb(var(--color-3));
		}

		i {
			$s: 120px;

			display: block;

			width: $s; height: $s;

			border: 3px solid rgb(var(--color-5));
			border: {
				radius: 100%;
			}

			background: {
				size: cover;
				position: center;
				repeat: no-repeat;
			}

			margin: {
				bottom: 2vh;
			}

		}

		span {
			color: rgb(var(--color-6));
			display: block;

			text: {
				align: center;
			}

			font: {
				weight: 600;
			}
		}
	}
	&-calc {
		color: rgb(var(--color-6));
	}
	&-footer {

		display: inline-grid;
		justify-content: center;
		align-content: center;

		grid: {
			column: footer;
			row: 		footer;
		}

		row-gap: 2vh;

		button {
			@include light-button;
		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

// VUEX
	import { mapState, mapActions, mapMutations } from 'vuex'

// COMPONENTS
	import CostCalc from '~/components/service/CostCalc.vue'
	import Loader 	from '~/components/common/Loader.vue'

// TYPES
	import type { VuexModules } from '~/types/VuexModules'

	import type { SELECTED_SERVICE, CATEGOTIES } from '~/types/Services.ts'

// MODULE
	export default Vue.extend({
		components: { CostCalc, Loader },
		props: {
			serviceType: {
				type: String,
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

				this.Loader_ChangeLoadMessage('Отправка запроса'); this.Loader_Load(); this.CloseModal()

				this.SendWorkRequest(this.SelectedService)

			}
			
		}
	})
</script>