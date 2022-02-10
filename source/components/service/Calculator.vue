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
					<select v-model="form.type" name="type">
						<option value="">
							Тип услуги не выбран
						</option>
						<template v-for="( item, index ) in serviceTypes">
							<option :key="index" :value="index">
								{{ item.title }}
							</option>
						</template>
					</select>
				</div>

				<!-- Type of service  -->
				<transition name="opacity-transition">
					<div v-if="form.type" class="calculator-main-input-service">
						<span>Услуга</span>
						<hr>
						<select v-model="form.service" name="service">
							<option value="">
								Услуга не выбрана
							</option>
							<template v-for="item in services">
								<option :key="item.Type" :value="item">
									{{ item.Name }}
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
						<template v-if="form.addictions">
							<template v-for="index in 3">
								<div v-if="form.addictions && (index - 1) <= form.addictions.length " :key="index" class="calculator-main-input-options-item">
									<select v-model="form.addictions[index - 1]" name="service">
										<option value="">
											Услуга не выбрана
										</option>
										<template v-for="item in PurchaseAdditions">
											<option :key="item.Type" :value="item">
												{{ item.Title }}
											</option>
										</template>
									</select>
									<!-- <span v-if="form.addictions[0]">
										Количество: {{ form.addictions[0].Quantity || 0 }}
										<input v-model="form.addictions[0].Quantity" type="range" step="1" max="10" min="1">
									</span> -->
								</div>
							</template>
						</template>
					</div>
				</transition>

			</section>

			<section v-if="form.service" class="calculator-main-description">
				<big>Описание услуги</big>
				<hr>
				<span>
					{{ form.service.Description }}
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
				<ul v-if="_cost !== 0">

					<template v-if="form.service">
						<li>{{ form.service.Name }}: <strong> {{ locateCost(form.service.Cost) }} ₽ ( {{ quantity }} шт. )</strong></li>	
					</template>

					<template v-if="form.addictions && form.addictions.length">
						<li v-for="(item, index) in form.addictions" :key="index">
							{{ item.Title }}: <strong>{{ locateCost(item.Cost) }} ₽ - {{ quantity }} шт.</strong>
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
				<span>{{ _delivery }} часов</span>
			</section>

			<section class="calculator-aside-cost">
				<strong>Итоговая цена</strong>
				<hr>
				<caption-card>
					<template #type>
						Цена учитывается с НДС в размере {{ Math.round((tax - 1) * 100) }} %
					</template>
					<template #desc>
						Если заказ идёт через фриланс площадку, то цена будет {{ locateCost(cost * tax) }} ₽ за счёт их средних комиссии в 15-20%.
					</template>
				</caption-card>
				<span>{{ locateCost(cost) }} ₽</span>
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

	import Vue from 'vue'

// API
	import { database } from '~/api/database'

// UTILS
	import { utils } from '~/utils'

// TYPES
	import type { CATEGORY, SERVICE, ADDICTION } from '~/typescript/Services'

// COMPONENTS 
	import CaptionCard from '~/components/common/Caption.vue'

	type SERVICE_TYPE_SELECT = {
		[K in CATEGORY]: {
			title: string
		}
	};

	type FORM = {
		type: CATEGORY
		service: SERVICE
		quantity: number,
		addictions: Array<ADDICTION>
	};

	export default Vue.extend({
		components: {
			CaptionCard
		},
		data() {
			return {

				quantity: 1,

				form: {
					type: undefined,
					service: undefined,
					addictions: [],
				} as Partial<FORM>,

				tax: 1.21,

				services: 	[] as Array<SERVICE>,
				PurchaseAdditions: 	[] as Array<ADDICTION>,

				cost: 0,

			}
		},
		computed: {

			serviceTypes(): Readonly<SERVICE_TYPE_SELECT> {
				return {

					WebApplications: {
						title: 'Готовые решения'
					},

					GraphicalDesign: {
						title: 'Графический дизайн'
					},

					HTMLcode: {
						title: 'Вёрстка'
					}

				}
			},

			_cost(): Readonly<number> {
				
				const PurchaseAdditionsCost = this.form.addictions?.map(add => add.Cost).reduce((prev, cur) => prev + cur, 0) || 0;
				const ServiceCost		= this.form.service?.Cost || 0

				return (( PurchaseAdditionsCost + ServiceCost ) * this.quantity ) * this.tax;

			},

			_delivery(): Readonly<number>  {
				return Math.round( this._cost / 300 )
			}

		},
		watch: {
			_cost: {
				handler(cur, prev) {
					
					this.$AnimeJS({
						targets: this.$data,
						cost: [prev, cur],
						round: 1,
						easing: 'easeInOutQuad',
						duration: 500,
					})

				}
			},
			'form.type': {
				async handler(category) {

					this.form.service = undefined;

					type Response = utils.asJSONArray<SERVICE>;

					this.services = await database.get<Response>(`Service/${ category }`).then(data => Object.values(data));

				}
			},
			'form.service': {
				async handler(service) {

					this.form.addictions = [];

					type Response = utils.asJSONArray<ADDICTION>;

					this.PurchaseAdditions = await database.get<Response>(`Service/Addictions/${ service.Type }`).then(data => Object.values(data));

				}
			},
		},
		methods: {
			locateCost(n: number): string {
				return n?.toLocaleString('de-DE') || n.toString(); 
			}
		}
	})

</script>
