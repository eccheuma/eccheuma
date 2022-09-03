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

			// !ASAP
			// !todo Remove magic number  
			height: 47.5vh;

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

	import Vue from 'vue';

	// VUEX
	import { mapActions, mapState, mapMutations } from 'vuex';

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/types/VuexMap';

	// COMPONENTS
	import CommonButton	from '~/components/buttons/CommonButton.vue';
	import Order 				from './submodules/Order.vue';

	export default Vue.extend({
		components: {
			Order,
			CommonButton
		},
		data() {
			return {

				orderModal: false,

			};
		},
		computed: {

			...mapState({
				Orders	: state => ( state as VuexMap ).User.WorkRequest.Orders,
				State		: state => ( state as VuexMap ).User.State.State,
			}),

		},
		mounted() {

			this.setRequestContent(this.State.UserID);

		},
		methods: {

			...mapMutations({
				setOrders: 'User/WorkRequest/setOrders'
			}),
			...mapActions({
				setRequestContent: 'User/WorkRequest/setRequestContent'
			}),

		},
	});

</script>
