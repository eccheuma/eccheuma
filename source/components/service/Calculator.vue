<template>
	<div class="calculator-container">

		<div class="calculator-main">
			
			<section class="calculator-main-header">
				<big>Выберите Услугу</big>
				<small>Пройдите несколько этапов, и сможем продолжить наши с вами интересные дела</small>
			</section>

			<section class="calculator-main-input">

				<!-- Type of service  -->
				<div class="calculator-main-input-type">
					<span>Тип услуги</span>
					<hr>
					<select v-model="form.category" name="category">
						<option value="">
							Тип услуги не выбран
						</option>
						<template v-for="item in SERVICE_TYPES">
							<option :key="item" :value="item">
								{{ item }}
							</option>
						</template>
					</select>
				</div>

				<!-- Type of service  -->
				<transition name="opacity-transition">
					<div v-if="form.category" class="calculator-main-input-service">
						<span>Услуга</span>
						<hr>
						<select v-model="form.service" name="service">
							<option value="NONE">
								Услуга не выбрана
							</option>
							<template v-for="item in services">
								<option :key="item.type" :value="item">
									{{ item.name }}
								</option>
							</template>
						</select>
					</div>
				</transition>

				<!-- Type of service  -->
				<transition name="opacity-transition">
					<div v-if="form.service" class="calculator-main-input-options">
						<span>Дополнения</span>
						<hr>
						<template v-for="field in additions.length">
							<div class="calculator-main-input-options-item" :key="field">
								<select v-model="form.additions[field - 1]" name="service">
									<option value="NONE">
										Услуга не выбрана
									</option>
									<template v-for="(item, index) in additions">
										<option :value="item.type" :key="index">
											{{ item.name }}
										</option>
									</template>
								</select>
							</div>
						</template>
					</div>
				</transition>

			</section>

			<section v-if="form.service" class="calculator-main-description">
				<big>Описание услуги</big>
				<hr>
				<span>
					{{ form.service.description }}
				</span>
			</section>

		</div>

		<div class="calculator-aside">

			<section class="calculator-aside-header">
				<big>Итоги</big>
				<small>Пройдите несколько этапов, и сможем продолжить наши с вами интересные дела</small>
			</section>

			<section class="calculator-aside-info">
				<strong>Итоги</strong>
				<hr>
				<ul v-if="cost.view !== 0">

					<template v-if="form.service">
						<li>{{ form.service.name }}: <strong> {{ form.service.cost }} ₽ ( {{ quantity.service }} шт. )</strong></li>	
					</template>

					<template v-if="form.additions">
						<li v-for="addition in filledAdditions" :key="addition.type">
							{{ addition.name }}: <strong>{{ addition.cost }} ₽ - {{ quantity.additions[addition.ID] || 1 }} шт.</strong>
						</li>	
					</template>

				</ul>
				<template v-else>
					Список пуст 
				</template>
			</section>

			<section class="calculator-aside-time">
				<strong>Ориентировочное время</strong>
				<hr>
				<caption-card>
					<template #type>
						Это не более чем ориентировочные сроки, и они могут меняться в зависимости от внешних условий.
					</template>
					<template #desc>
						В основном это связанно либо с правками, или же с пересмотром технического задания.
					</template>
				</caption-card>
				<span>{{ deliveryTime }} часов</span>
			</section>

			<section class="calculator-aside-cost">
				<strong>Итоговая цена</strong>
				<hr>
				<caption-card>
					<template #type>
						Цена учитывается с НДС в размере {{ Math.round((taxes.GLOBAL_TAX_INDEX - 1) * 100) }} %
					</template>
					<template #desc>
						Если заказ идёт через фриланс площадку, то цена будет {{ resultCost }} ₽ за счёт их средних комиссии в 15-20%.
					</template>
				</caption-card>
				<span>{{ cost.view }} ₽</span>
			</section>
		</div>

	</div>
</template>

<style lang="scss">

	%calculator-header {

		text-align: center;
		padding: 2vh 2vw;

		@extend %pattern-lines;

		big {

			display: block;
			
			font: {
				size: var(--font-size-42);
				family: var(--decor-font);
			}

			letter-spacing: .15ch;

		}

		small {
			display: block;

			color: rgb(var(--color-mono-500));
			font: {
				size: var(--font-size-16);
				weight: 800;
			}

			width: 45ch;
			margin: auto;

		}

	}

	.calculator {

		&-container {

			display: grid;
			grid-template: {
				columns: 2fr 3fr;
			};

			column-gap: 1vw;

			section {

				@extend %card-container;
				background-color: rgb(var(--color-mono-300));

			}

			hr {
				margin: 1vh 0;
				background: rgb(var(--color-mono-400));
			}

		}

		&-main {

			display: grid;
			row-gap: 1vh;

			grid-template: {
				rows: min-content auto
			};

			&-header {

				@extend %calculator-header;

			}

			&-input {

				min-height: 50vh;

				padding: 2vh 2vw;
				display: grid;
				align-content: flex-start;
				gap: 2vh 0;

				span {
					font: {
						size: var(--font-size-18);
						weight: 800;
					}
				}

				select {

					width: 100%;
					color: rgb(var(--color-mono-800));
					background-color: rgb(var(--color-mono-200));
					border: 1px solid rgb(var(--color-mono-400));
					padding: 1vh 2vw 1vh .5vw;
					border-radius: var(--border-radius);
					outline: 0px solid transparent;

				}

				&-options {

					display: grid;
					align-content: flex-start;
					gap: 1vh;

				}

			}

			&-description {
				padding: 3vh 2vw;

				hr {
					margin: 1vh 0;
					background: rgb(var(--color-mono-400));
				}

			}

		}

		&-aside {

			display: grid;
			row-gap: 1vh;

			grid-template: {
				rows: min-content auto
			};

			&-header {
				@extend %calculator-header;
			}

			&-info {

				ul {
					padding: 1vh 1vw;
					margin: 0;
				}

			}

			section {

				padding: 2vh 2vw;
				display: flex;
				flex-direction: column;

				> strong {
					display: block;
					color: rgb(var(--color-mono-800));
					font: {
						size: var(--font-size-24);
						weight: 800;
					}
				}

				> span {

					padding: 1vh 1vw;

					font: {
						size: var(--font-size-42);
						weight: 800;
					}
				}

			}

		}

	}

</style>

<script lang="ts">

	import Vue from 'vue';

// API
	import { database } from '~/api/database';

// Utils
	import type { Result } from '~/utils';
	import { cache } from '~/utils/cache';

// TYPES
	import type { Hash, Second } from '~/types/Nominals';
	import type { Categories, Purchase, Additions } from '~/types/Services';

// Helpers
	function toHours(secs: Second): number {
		return parseFloat(Number((secs / 60) / 60).toPrecision(3));
	}

// Components 
	import CaptionCard from '~/components/common/Caption.vue';

// Constants
	// TODO #20 : Подключить API ЦБРФ для сбора индексов для конечных поборов. @Scarlatum
	const GLOBAL_TAX_INDEX = 1.24;

	const COMMON_DELIVERY_TIME = 864_000 as Second;

	const SERVICE_TYPES: Array<Categories> = ['Application', 'Graphic', 'FrontEnd'];

// Errors
	const enum ERRORS {
		SERVICES_EMPTY 	= 'Services category is empty',
		ADDITIONS_EMPTY	= 'Addition for this service is not available',
	}

// Models
	interface IPurchaseForm {
		category	: Categories 
		service		: Purchase.struct,
		additions	: Array<Additions.struct['type']>
	}

	interface ICost {
		raw		: number
		view	: number
	}

	interface IQuantity {
		service		: number,
		additions	: Record<Hash, number>,
	}
	
	namespace CacheContainer {

		export interface IService {
			category	: Categories,
			services	: Array<Purchase.struct>,
		}
	
		export interface IAddition {
			serviceID	: Purchase.struct['ID'],
			additions	: Array<Additions.struct>,
		}

	}

// Module
	export default Vue.extend({
		components: {
			CaptionCard
		},
		data() {
			return {

				alerts: undefined,

				taxes: {
					GLOBAL_TAX_INDEX
				},

				SERVICE_TYPES,

				services	: Array<Purchase.struct>(),
				additions	: Array<Additions.struct>(),

				form: {
					category	: String(),
					service		: Object(),
					additions	: Array(),
				} as IPurchaseForm,

				quantity: {
					service		: 1,
					additions	: Object(),
				} as IQuantity,

				cost: {
					raw		: Number(),
					view	: Number(),
				} as ICost,

			};
		},
		computed: {

			filledAdditions(): Array<Additions.struct> {
				return this.additions.filter(x => this.form.additions.some(y => y === x.type));
			},

			// TODO #21 : Пока будет высчитываться лишь глобальный НДС налог. Уточнить остальное, и реализовать по частям. @Scarlatum
			resultCost(): number {

				const additionsCost = this.filledAdditions.reduce((prev, { cost }) => prev + cost, 0);

				const rawCost = this.form.service.cost + additionsCost;

				// ? | Тут желательно вообще использовать адекватные библиотеки а не простой floor.
				return Math.floor(rawCost * GLOBAL_TAX_INDEX);

			},

			deliveryTime(): number {

				const serviceTime 	= Number(this.form.service.delivery) || COMMON_DELIVERY_TIME;
				const additionsTime = this.filledAdditions.reduce((acc, addition) => {
					return acc + addition.delivery || COMMON_DELIVERY_TIME;
				}, 0);

				return toHours((serviceTime + additionsTime) as Second);

			},

		},
		watch: {
			'form.category': {
				async handler(category: IPurchaseForm['category']) {

					console.debug('form.category handler');

					await this.setServices(category);
				}
			},
			'form.service': {
				async handler(service: IPurchaseForm['service']) {

					console.debug('form.service handler');

					await this.setAdditions(service);
				}
			},
			resultCost: {
				handler(newVal, oldVal) {
					this.animateCostCounter([ oldVal, newVal ]);
				}
			}
		},
		methods: {

			// Getters
			async getSerives(category: Categories): Promise<Result<Array<Purchase.struct>, Error>> {

				const response: Array<IPurchaseForm['service']> = await database.get(`Service/${ category }`);

				console.debug(response);

				cache.set<CacheContainer.IService>(`services::${ category }`, {
					category,
					services: response,
				});

				return response.length
					? response
					: Error(ERRORS.SERVICES_EMPTY);

			},
			async getAdditions(type: string, ID: Hash): Promise<Result<Array<Additions.struct>, Error>> {

				const response: Array<Additions.struct> = await database.get(`Service/Addictions/${ type }`);

				console.debug(response, type, ID);

				cache.set<CacheContainer.IAddition>(`additions::${ type }`, {
					serviceID: ID,
					additions: response
				});

				return response?.length
					? response
					: Error(ERRORS.ADDITIONS_EMPTY);

			},

			// Setters
			async setServices(category: Categories) {

				const cachedData = cache.get<CacheContainer.IService>(`services::${ category }`);
 
				if ( cachedData instanceof Error ) {

					const responseResult = await this.getSerives(category);

					console.debug('setServices::responseResult:', responseResult);

					this.services = responseResult instanceof Error
						? []
						: responseResult;

				} else {

					console.debug('setServices::cachedData:', cachedData);

					this.services = cachedData.data.services;	

				}

			},
			async setAdditions({ type, ID }: Purchase.struct) {

				const cachedData = cache.get<CacheContainer.IAddition>(`additions::${ type }`);

				if ( cachedData instanceof Error ) {

					const responseResult = await this.getAdditions(type, ID);

					console.debug('setAdditions::responseResult:', responseResult);

					this.additions = responseResult instanceof Error
						? []
						: responseResult;

				} else {

					console.debug('setAdditions::cachedData:', cachedData);

					this.additions = ID === cachedData.data.serviceID
						? cachedData.data.additions
						: await this.getAdditions(type, ID).then(data => {
								return data instanceof Error
									? []
									: data;
							});

				}

			},

			// Helpers
			animateCostCounter([ from, to ]: [ number, number ]) {

				const innerCounter = {
					data: from
				};

				this.$AnimeJS({
					targets: innerCounter,
					data: [ innerCounter.data, to ],
					round: 1,
					easing: 'easeInOutQuad',
					duration: 500,
					update: () => {
						this.cost.view = innerCounter.data;
					}
				});

			},
			
		}
	});

</script>
