<template>
	<div class="service-card" :class="{ 'service-widecard': wide }">

		<portal v-if="Modal" to="Modal">
			<service-modal @close-modal="() => Modal = false" />
		</portal>

		<section class="service-card-header">
			<span>{{ payload.name }}</span>
			<span>{{ payload.description }}</span>
		</section>
		<section class="service-card-description">
			<h6>Описание</h6>
			<hr v-once>
			<span>{{ payload.about }}</span>
		</section>
		<section class="service-card-price">
			<h6>Цены</h6>
			<hr v-once>
			<template v-for="(item, i) in Services">
				<div 
					:key="i" 
					class="service-card-line" 
					:class="{ active: ActiveSection === i }" 
					@click="ActiveSection = i"
				>
					<span>{{ item.name }}</span>
					<span>от {{ item.cost }} ₽</span>
				</div>
			</template>
		</section>
		<section class="service-card-timeframe">
			<h6>Сроки</h6>
			<hr v-once>
			<template v-for="(item, i) in Services">
				<div 
					:key="i" 
					class="service-card-line" 
					:class="{ active: ActiveSection === i }" 
					@click="ActiveSection = i"
				>
					<span>{{ item.name }}</span>
					<span>от {{ item.delivery	}}</span>					
				</div>
			</template>
		</section>
		<section class="service-card-footer">
			<common-button @click.native="() => Modal = true" :class="{ disabled: !LoginStatus }">
				Заказать
			</common-button>
		</section>
	</div>
</template>

<style lang="scss">

.service-card-line {

	cursor: pointer;

	--text: rgb(var(--color-mono-900));
	--back: rgb(var(--color-mono-200));

	display: block;
	background: var(--back);
	color: var(--text);

	font-weight: 800;

	padding: 1vh 1vw;
	display: flex;
	justify-content: space-between;
	
	border-radius: var(--border-radius);
	margin: 1vh 0;

	line-height: 3vh;

	transition-duration: 500ms;

}

.service-card {

	display: grid;
	grid-template: {
		rows: min-content 30vh auto auto minmax(10vh, min-content) min-content;
		areas: 	'head'
						'desc'
						'cost'
						'time'
						'foot'
	}
	row-gap: 1vh;

	hr {
		background: rgb(var(--color-mono-400));
		margin: 2vh 0;
	}

	section {

		background: rgb(var(--color-mono-300));
		border-radius: var(--border-radius);
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
		--back: rgb(var(--color-mono-900));

		// margin-inline: 5%;

	}

	&-header {

		@include gradient_border;

		@extend %pattern-lines;

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

				letter-spacing: .15ch;
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
	&-footer {

		@include gradient_border;

		@extend %pattern-lines;

		grid-area: foot;

		display: flex;
		place-content: center;
		place-items: center;

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
						'desc foot'
	}

	gap: 1vw;

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// VUEX
	import { mapState, mapMutations } from 'vuex';

	// API
	import { database } from '~/api/database';

	// COMPONENTS
	import ServiceModal from '~/components/service/ServiceModal.vue';
	// import CaptionCard 	from '~/components/common/Caption.vue';

	// TYPES 
	import type { Purchase } from '~/contracts/Services';
	import type { VuexMap } from '~/contracts/VuexMap';

	// MODULE
	export default Vue.extend({
		components: {
			// CaptionCard,
			ServiceModal,
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<Purchase.struct<any>>,
			wide: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {

				ActiveSection: 0,

				Services: new Array<Purchase.struct<any>>(0),

				Modal: false,

			};
		},

		async fetch() {
			this.Services = await this.getDatabaseData();
		},

		computed: {
			...mapState({
				LoginStatus: state => (state as VuexMap).Auth.Session.LoginStatus
			})
		},
		
		methods: {

			...mapMutations({
				toggleRegisterModal: 'Auth/Register/toggleRegisterModal',
			}),

			ToggleModal(value: boolean) {
				this.Modal = value;
			},

			async getDatabaseData(): Promise<Array<Purchase.struct<any>>> {

				return await database
					.get(`Service/${ this.payload.category }`)
					.then(data => Object.values(data));

			}

		},
	});

</script>
