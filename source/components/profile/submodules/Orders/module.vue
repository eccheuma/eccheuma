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
	import { mapActions, mapState, mapMutations } from 'vuex'

	// UTILS
	import { utils } from '~/utils'

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/typescript/VuexMap'

	// TYPES
  import { Purchase, Product } from '~/typescript/Services'

	// COMPONENTS
	import CommonButton	from '~/components/buttons/CommonButton.vue';
	// eslint-disable-next-line import/order
	import Order 				from './submodules/Order.vue'

	// DEFAULT ORDER SAMPLE 
	const DEFAULT_ORDER: Purchase.order<'Application'> = {
		ID					: utils.hashGenerator(),
		Status			: Purchase.status.Review,
		Accepted		: 1_632_096_000_000,
		Recived			: 1_631_664_000_000,
		Delivery		: 432_000_000,
		Declined		: false,
		Cost				: 21_000,
		Category		: Product.Application,
		Type				: Product.Application.Multipage,
		Name				: 'Приложение на vue.js',
		Description	: 'Тестовое приложение',
	} 

	const LOGO_ORDER: Purchase.order<'Graphic'> = {
		ID					: utils.hashGenerator(),
		Status			: Purchase.status.Queue,
		Accepted		: 0,
		Recived			: Date.now(),
		Delivery		: 64_800_000,
		Declined		: false,
		Cost				: 5_000,
		Category		: Product.Graphic,
		Type				: Product.Graphic.Logo,
		Name				: 'Логотип для "Рога и копыта"',
		Description	: 'Лого',
	} 

	export default Vue.extend({
		components: {
			Order,
			CommonButton
		},
		data() {
			return {
				orderModal: false,
			}
		},
		computed: {

			...mapState({
				Orders		: state => ( state as VuexMap ).User.WorkRequest.Orders,
				UserState	: state => ( state as VuexMap ).User.State.UserState,
			}),

		},
		created() {
			// ! This is default orders. Not for production release
			this.setOrders([DEFAULT_ORDER, LOGO_ORDER])
		},
		mounted() {
			this.setRequestContent(this.UserState.UserID)
		},
		methods: {

			...mapMutations({
				setOrders: 'User/WorkRequest/setOrders'
			}),
			...mapActions({
				setRequestContent: 'User/WorkRequest/setRequestContent'
			}),

		},
	})

</script>
