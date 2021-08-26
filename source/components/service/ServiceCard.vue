<template>
	<div class="service-card" :class="{ 'service-widecard': wide }">
		<section class="service-card-header pattern_bg">
			<span>{{ payload.title }}</span>
			<span>{{ payload.subTitle }}</span>
		</section>
		<section class="service-card-description">
			<h6>Описание</h6>
			<hr>
			<span>{{ payload.description }}</span>
		</section>
		<section class="service-card-price">
			<h6>Цены</h6>
			<hr>
			<template v-for="(item, i) in Services">
				<div 
					:key="i" 
					class="service-card-line" 
					:class="{ active: ActiveSection === i }" 
					@click="ActiveSection = i"
				>
					<span>{{ item.Name }}</span>
					<span>{{ item.Cost }} ₽</span>
				</div>
			</template>
		</section>
		<section class="service-card-timeframe">
			<h6>Сроки</h6>
			<hr>
			<template v-for="(item, i) in Services">
				<div 
					:key="i" 
					class="service-card-line" 
					:class="{ active: ActiveSection === i }" 
					@click="ActiveSection = i"
				>
					<span>{{ item.Name }}</span>
					<span>{{ item.Time }}</span>
				</div>
			</template>
		</section>
		<caption-card>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Et, doloribus vel ea ipsum ratione eligendi at alias. Distinctio, voluptate id.
		</caption-card>
		<section class="service-card-footer">
			<common-button>
				Заказать
			</common-button>
		</section>
	</div>
</template>

<style lang="scss">

.service-card-line {

	cursor: pointer;

	--text: rgb(var(--color-mono-800));
	--back: rgb(var(--color-mono-200));

	display: block;
	background: var(--back);
	color: var(--text);

	font-weight: 800;

	padding: 1vh 1vw;
	display: flex;
	justify-content: space-between;
	
	border-radius: .7rem;
	margin: 1vh 0;

	line-height: 3vh;

	transition-duration: 500ms;

}

.service-card {

	display: grid;
	grid-template: {
		rows: min-content 30vh auto auto 10vh min-content;
		areas: 	'head'
						'desc'
						'cost'
						'time'
						'note'
						'foot'
	}
	row-gap: 1vh;

	hr {
		background: rgb(var(--color-mono-400));
		margin: 2vh 0;
	}

	section {

		background: rgb(var(--color-mono-300));
		border-radius: .7rem;
		padding: 2vh 1.25vw;

		h6 {
			font: {
				weight: 800;
				size: var(--font-size-24);
			}
		}

	}

	.active {
		--text: rgb(var(--color-mono-200));
		--back: rgb(var(--color-mono-800));

		// margin-inline: 5%;

	}

	&-header {

		grid-area: head;

		display: flex;
		flex-direction: column;
		place-content: center;
		text-align: center;
		gap: 1vh;

		span {
			&:nth-of-type(1) {

				font: {
					size: var(--font-size-36);
					family: var(--decor-font);
				}

				letter-spacing: .25ch;
				line-height: var(--size-36);

			}
			&:nth-child(2) {

				color: rgb(var(--color-mono-500));
				font: {
					weight: 600;
					size: var(--font-size-16);
				}

			}
		}

	}
	&-description {
		grid-area: desc;
	}
	&-price {
		grid-area: cost;
	}
	&-timeframe {
		grid-area: time;
	}
	&-notice {
		grid-area: note;
		background-color: rgb(var(--color-mono-800)) !important;
	}
	&-footer {

		grid-area: foot;

		display: flex;
		place-content: center
	}
}

.service-widecard {

	// max-width: 960px;
	grid-template: {
		columns: 1fr 2fr;
		rows: min-content auto auto min-content;
		areas: 	'head head'
						'desc cost'
						'desc time'
						'note foot'
	}

	gap: 1vw;

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
	import { mapState, mapMutations } from 'vuex'

	// COMPONENTS
	import ServiceModal from './ServiceModal.vue'
	import CaptionCard 			from '~/components/common/Caption.vue'

	// TYPES 
	import type { SERVICE, SERVICES_CARD } 	from '~/typescript/Services'
	import type { VuexModules } 						from '~/typescript/VuexModules'

	// MODULE
	export default Vue.extend({
		components: {
			CaptionCard,
			ServiceModal,
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<SERVICES_CARD>,
			wide: {
				type: Boolean,
				default: false,
			}
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
