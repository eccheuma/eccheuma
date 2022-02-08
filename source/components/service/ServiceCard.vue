<template>
	<div class="service-card" :class="{ 'service-widecard': wide }">
		<section class="service-card-header">
			<span>{{ payload.title }}</span>
			<span>{{ payload.subTitle }}</span>
		</section>
		<section class="service-card-description">
			<h6>Описание</h6>
			<hr v-once>
			<span>{{ payload.description }}</span>
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
					<span>{{ item.Name }}</span>
					<span>от {{ item.Cost }} ₽</span>
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
					<span>{{ item.Name }}</span>
					<span>от {{ item.Time }}</span>
				</div>
			</template>
		</section>
		<caption-card>
			<template #type>
				Lorem ipsum.
			</template>
			<template #desc>
				Dreary disaster ghastly whispered nepenthe lore, echo word my on there soul. And the sainted air from, and into once.
			</template>
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
	&-notice {
		grid-area: note;
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
						'note foot'
	}

	gap: 1vw;

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// API
	import { database } from '~/api/database';

	// VUEX
	import { mapState, mapMutations } from 'vuex'

	// COMPONENTS
	import ServiceModal from '~/components/service/ServiceModal.vue'
	import CaptionCard 	from '~/components/common/Caption.vue'

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
				LoginStatus: state => (state as VuexModules).Auth.Session.LoginStatus
			})
		},
		async fetch() {

			this.Services = await this.getDatabaseData();

		},
		methods: {

			...mapMutations({
				ToggleRegisterModal: 'Auth/Register/ToggleRegisterModal',
			}),

			ToggleModal(value: boolean) {
				this.Modal = value
			},

			async getDatabaseData(): Promise<Array<SERVICE>> {

				return await database
					.get(`Service/${ this.payload.path }`)
					.then(data => Object.values(data));

			}

		},
	})

</script>
