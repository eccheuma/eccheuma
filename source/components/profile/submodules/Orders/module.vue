<template>
	<section class="user_profile-component">

		<portal v-if="orderModal" to="Modal">
			<div class="user_profile-component-modal" @click.self="orderModal = false">
				<order v-for="item in Orders" :key="item.accepted" :payload="item" />
			</div>
		</portal>

		<div class="user_profile-component-orders">
			<order v-for="item in Orders" :key="item.accepted" :payload="item" />
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
		status			: Purchase.status.Process,
		accepted		: 1_645_096_000_000,
		recived			: 1_644_664_000_000,
		delivery		: 432_000_000,
		declined		: false,
		cost				: 21_000,
		category		: Product.Application,
		type				: Product.Application.Multipage,
		name				: 'Приложение на vue.js',
		about				: 'Тестовое приложение',
		single			: true,
		quantity		: 1,
	} 

	const LOGO_ORDER: Purchase.order<'Graphic'> = {
		ID					: utils.hashGenerator(),
		status			: Purchase.status.Queue,
		accepted		: 0,
		recived			: Date.now(),
		delivery		: 64_800_000,
		declined		: false,
		cost				: 5_000,
		category		: Product.Graphic,
		type				: Product.Graphic.Logo,
		name				: 'Логотип для "Рога и копыта"',
		about				: 'Лого',
		single			: true,
		quantity		: 1,
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
			this.setOrders([LOGO_ORDER, DEFAULT_ORDER])
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
