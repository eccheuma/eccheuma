<template>
	<section class="user_profile-component">

		<portal v-if="orderModal" to="Modal">
			<div class="user_profile-component-modal" @click.self="orderModal = false">
				<order v-for="item in Orders" :key="item.Accepted" :payload="item" />
			</div>
		</portal>

		<div class="user_profile-component-orders">
			<order v-for="item in Orders" :key="item.Accepted" :payload="item" />
		</div>

		<hr>

		<common-button @click.native="orderModal = true">
			Открыть заказы на весь экран
		</common-button>

	</section>
</template>

<style lang="scss">

.user_profile-component {

	display: grid;
	gap: 2vh;

	&-modal {
		position: fixed;
		width: 100vw;
		height: 100vh;
		z-index: 3000;

		overflow-y: scroll;

		background: rgba(var(--color-mono-200), .85);

		display: grid;
		grid-template: {
			columns: 1fr 1fr
		};

		gap: 2vh 1vw;
		padding: 2vh 2vw;

	}

	&-orders {

		display: grid;
		overflow-y: scroll;

		gap: 2vh;

		padding-right: #{ $GLOBAL-ScrollWidth };

	}	

	button {
		width: fit-content;
		place-self: center;
	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// TYPES
  import type { ORDER } from '~/typescript/Services'

	// MIXINS
	import F_WorkStatus from '~/assets/mixins/filters/WorkStatus'

	// COMPONENTS
	import CommonButton	from '~/components/buttons/CommonButton.vue';
	import Order 				from './submodules/Order.vue'

	// DEFAULT ORDER SAMPLE 
	const DEFAULT_ORDER: ORDER = {
		ID: Math.random().toString(36).substr(2).toUpperCase(),
		Status: 	2,
		Accepted: 1_632_096_000_000,
		Recived: 	1_631_664_000_000,
		Delivery: 432_000_000,
		Declined: false,
		Cost: 		21_000,
		Type: 		'VueApplication',
		Name: 		'Тестовое приложение',
	} 

	const LOGO_ORDER: ORDER = {
		ID: Math.random().toString(36).substr(2).toUpperCase(),
		Status: 	0,
		Accepted: 0,
		Recived: 	Date.now(),
		Delivery: 64_800_000,
		Declined: false,
		Cost: 		5_000,
		Type: 		'Logo',
		Name: 		'Логотип для "Рога и копыта"',
	} 

	export default Vue.extend({
		components: {
			Order,
			CommonButton
		},
		mixins: [ F_WorkStatus ],
		data() {
			return {

				orderModal: false,

			}
		},
		computed: {

			...mapState({
				WorkRequests: state => ( state as VuexModules ).User.WorkRequest.Requests
			}),

			Orders(): Array<ORDER> {
				return [ DEFAULT_ORDER, LOGO_ORDER ]
			}

		},
		mounted() {
			this.Set_RequestContent()
		},
		methods: {
			...mapActions({
				Set_RequestContent: 'User/WorkRequest/Set_RequestContent'
			}),
		},
	})

</script>
