<template>
	<section class="service_item-container">

		<portal v-if="Modal" to="Modal">
			<service-modal :service-type="payload.path" @close-modal="ToggleModal(false)" />
		</portal>

		<div class="service_item-header">
			<h5>{{ payload.title }}</h5>
			<span>{{ payload.subTitle }}</span>
		</div>
		<div class="service_item-body">
			<section class="service_item-body-description">
				{{ payload.description }}
			</section>
			<section class="service_item-body-types">

				<h6>Цены</h6>
				<hr>

				<div class="service_item-body-container">
					<section 
						v-for="( item, i ) in Services" 
						:key="`cost-${i}`"
						:class="{ active: ActiveSection === i }"
						@click="ActiveSection = i">

						<span>{{ item.Name }}</span>
						<span>от {{ item.Cost }} ₽</span>

					</section>
				</div>

			</section>
			<section class="service_item-body-prices">

				<h6>Срок исполнения</h6>
				<hr>

				<div class="service_item-body-container">
					<section 
						v-for="( item, i ) in Services" 
						:key="`cost-${i}`"
						:class="{ active: ActiveSection === i }"
						@click="ActiveSection = i">

						<span>{{ item.Name }}</span>
						<span>от {{ item.Time }}</span>

					</section>
				</div>

			</section>
		</div>
		<div class="service_item-footer">

			<template v-if="!LoginStatus">

				<span>
					" Euren die lebt lied vom naht schwebet verschwand euch lebens. Schmerz wie auf dem besitze. Lebens herauf und tränen fühl.. "
				</span>

				<common-button @click.native="ToggleRegisterModal">
					Зарегистрироваться
				</common-button>

				<hr>

			</template>

			<common-button :class="{ disabled: !LoginStatus }" @click.native="ToggleModal(true)">
				Заказать
			</common-button>

		</div>
	</section>
</template>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
	import { mapState, mapMutations } from 'vuex'

	// COMPONENTS
	import ServiceModal from './ServiceModal.vue'

	// TYPES 
	import type { SERVICE, SERVICES_CARD } 	from '~/typescript/Services'
	import type { VuexModules } 						from '~/typescript/VuexModules'

	// MODULE
	export default Vue.extend({
		components: {
			ServiceModal,
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<SERVICES_CARD>
		},
		data() {
			return {

				ActiveSection: 0,

				Services: [] as SERVICE[],

				Modal: false,

			}
		},
		computed: {
			...mapState({
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus
			})
		},
		created() {

			firebase.database()
				.ref(`Service/${ this.payload.path }`)
				.on('value', (data) => {

					this.Services = Object.values(data.val()) as SERVICE[]

				})

		},
		methods: {

			...mapMutations({
				ToggleRegisterModal: 'Auth/Register/ToggleRegisterModal',
			}),

			ToggleModal(value: boolean) {
				this.Modal = value
			}

		},
	})

</script>

<style lang="scss">

.service_item {
	&-container {
		width: 100%;
		border-radius: .7rem;
		margin: 2vh 0;
		background-color: rgb(var(--color-2));
		color: rgb(var(--color-6));
		font-size: var(--font-size-4);
	}
	&-header {
		@include gradient_border(bottom);
		background-color: rgb(var(--color-2));
		border-radius: .7rem;
		box-shadow: 0px 3px 0px 0px rgba(var(--color-1),.25);
		padding: 4vh 0;
		text-align: center;
		span {
			font-weight: 700;
			font-size: 12px;
			color: rgb(var(--color-4));
		}
	}
	&-body {
		background-color: rgb(var(--color-1));
		padding: 2vh 2vw;

		>section {
			margin: 2vh 0 4vh;
		}

		h6 {
			text-align: center;
			font: {
				weight: 700;
			}
		}

		hr {
			background-color: rgb(var(--color-3));
		}

		&-container {

			height: 25vh;
			overflow-y: scroll;

			padding: 0 1vw;

			font-weight: 600;

			.active {
				background-color: rgb(var(--color-3));
			}

			section {

				transition: background-color 250ms ease-in-out;

				cursor: pointer;
				display: inline-flex;
				width: 100%;
				background-color: rgb(var(--color-2));
				border-radius: .7rem;
				padding: 1vh 1vw;
				margin: 1vh 0;
				span {
					&:nth-of-type(1) {
						text-align: left;
						width: 70%
					}
					&:nth-of-type(2) {
						text-align: right;
						width: 30%;
					}
				}
			}
		}

		&-description {
		}

		&-types {
		}

		&-prices {
		}

	}
	&-footer {
		@include gradient_border(top);

		padding: 2vh 0;

		.disabled {
			pointer-events: none;
			opacity: .25;
		}

		hr {
			background-color: rgb(var(--color-1));
		}

		span {
			display: block;
			color: rgb(var(--color-4));
			text-align: center;
			width: 75%;
			margin: 0 auto;
			font: {
				weight: 700;
			}
		}

		button {
			@include light-button {
				width: 50%;
				display: block;
				margin: 3vh auto;
			}
		}
	}
}

</style>
