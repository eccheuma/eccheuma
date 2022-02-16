<template>
	<div class="service_modal-container">

		<!-- <Loader
			:ElementLoad="LoaderStatus.Load"
			:ElementLoadComplete="LoaderStatus.Loaded"
			>
			{{ LoaderMessage }}
		</Loader> -->

		<section class="service_modal-user">
			<template v-if="LoginStatus">
				<i :style="`background-image: url(${ State.UserImageID })`" />
				<span>{{ State.UserName }}</span>
				<span>{{ State.UserBalance }} ₽</span>
			</template>
		</section>
		<section class="service_modal-calc">
			<calculator :default-category="serviceType" :category-defined="true" @curent-service="SetSelectedService" />
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
		scroll-behavior: unset;

		padding: 5vh 3vw;

		display: grid;
		grid-template: {
			columns: 2fr 8fr;
			rows: 8fr 2fr;
			areas: 	'user calc'
							'footer footer'
		}

		column-gap: 2vw;

		width: $GLOBAL-BodySize; 
		height: 100vh;

		background: {
			color: rgba(var(--color-mono-200), .95);
		}

	}
	&-user {

		display: inline-grid;
		justify-content: center;
		align-content: center;

		border: {
			right: 1px solid rgb(var(--color-mono-400));
		}

		i {
			$s: 120px;

			display: block;

			width: $s; height: $s;

			border: 3px solid rgb(var(--color-mono-900));
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
			color: rgb(var(--color-mono-1000));
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
		overflow-y: scroll;
		color: rgb(var(--color-mono-1000));
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
	import { mapState, mapActions } from 'vuex'

// COMPONENTS
	import Calculator from '~/components/service/Calculator.vue'
	// import Loader 	from '~/components/common/Loader.vue'

// TYPES
	import type { VuexMap } from '~/typescript/VuexMap'

	import type { Purchase, Categories } from '~/typescript/Services'

// MODULE
	export default Vue.extend({
		components: { 
			Calculator, 
			// Loader 
		},
		props: {
			serviceType: {
				type: String,
				required: true
			} as PropOptions<Categories>
		},
		data() {
			return {

				selectedPurchase: {} as Purchase.struct<any>

			}
		},
		computed: {
			...mapState({

				LoginStatus: 		state => ( state as VuexMap ).Auth.Session.LoginStatus,
				State: 			state => ( state as VuexMap ).User.State.State,

			}),
		},
		methods: {

			...mapActions({
				sendWorkRequest: 'User/WorkRequest/sendWorkRequest'
			}),

			SetSelectedService(purchase: Purchase.struct<any>) {
				this.selectedPurchase = purchase 
			},

			CloseModal() {

				this.$emit('close-modal')

			},

			SendRequest() {

				this.CloseModal();

				this.sendWorkRequest(this.selectedPurchase)

			}
			
		}
	})
</script>
