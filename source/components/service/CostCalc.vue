<template>
	<section class="cost_calc-container">

		<div class="cost_calc-main">

			<section class="cost_calc-main-header">
				<h6>Выберите тип услуги</h6>
				<span>
					<i class="fas fa-info-circle mr-2" />
					Потяните для прокрутки
				</span>
			</section>

			<section v-if="!CategoryDefined">
				<span class="cost_calc-main-title">Тип услуги</span>
				<select v-model="Selected.Category" @change="GetServicesOfCategory( Selected.Category )">
					<option value="" selected>
						Ничего не выбрано
					</option>
					<option value="WebApplications">
						Сайты и Приложения
					</option>
					<option value="GraphicalDesign">
						Графический Дизайн
					</option>
					<option value="HTMLcode">
						Вёрстка
					</option>
				</select>
			</section>

			<transition name="Fading">
				<template v-if="Selected.Category">
					<section :class="{ 'NonActive': !Selected.Category }">

						<span class="cost_calc-main-title">Услуга</span>

						<select v-model="Selected.Service" @change="GetAddictionsOfService( Selected.Service.Type )">
							<option selected value="">
								Ничего не выбрано
							</option>
							<option v-for="( item, index ) in Products" :key="`SO-${ index }`" :value="item">
								{{ item.Name }}
							</option>
						</select>

						<template v-if="Selected.Service.Descriprion">
							<i>" {{ Selected.Service.Descriprion }} "</i>
						</template>

					</section>
				</template>
			</transition>

			<transition-group name="Fading">
				<template v-if="Object.keys(Selected.Service).length">

					<span key="main-title" class="cost_calc-main-title">
						Дополнения
					</span>

					<section v-for="(n, i) in AddictionSections" :key="`list-${ n }`" class="cost_calc-main-select">

						<select v-model="Selected.Addiction[i]"> 

							<option selected value="''">
Без дополнительных услуг
</option>
							<option
v-for="( item, index ) in Addictions"
								v-show="!AlreadySelectedAddiction(item.Type)" 
								:key="`AOP-${ index }`" 
								:value="item"
>{{ item.Title }}
							</option>

						</select>

						<span v-if="i != AddictionSections - 1" @click="RemoveAddiction(i)">
							<i class="fas fa-times" />
						</span>

					</section>

				</template>
			</transition-group>

			<!-- <transition name="page_transition"> -->
				<!-- <template v-if="SelectedService.ID in Addictions && TypeOfService != 0"> -->
					<!-- <div class="row" v-if="AdditionsList.length < Addictions[SelectedService.ID].length"> -->
						<!-- <button @click="AddictionQuantity++" class="mx-auto my-3 px-5 py-1">Добавить</button> -->
					<!-- </div> -->
				<!-- </template> -->
			<!-- </transition> -->

		</div>

		<div class="cost_calc-aside">

			<section class="cost_calc-aside-header">
				<h5>Итог</h5>
			</section>

			<section class="cost_calc-aside-quantity">
				<h6>Количество и цены: </h6>
				<span>
					<strong> - Количество: </strong> {{ Selected.Quantity }} шт.
				</span>
				<span>
					<strong> - Цена за услугу: </strong>{{ ServiceCost }} ₽
				</span>
				<span>
					<strong> - Цена дополнительных опций: </strong> {{ AddictionCost ? AddictionCost : 0 }} ₽
				</span>
			</section>

			<section class="cost_calc-aside-time">
				<h6>Ориентировочное время: </h6>
				<span v-if="SpendedTime">{{ TimeFilter(SpendedTime) }} {{ DataFilter(SpendedTime) }} </span>
				<span v-else>
					Не выбрана услуга
				</span>
				<hr>
				<div class="cost_calc-aside-info">
					<i class="fas fa-info-circle" />
					
					Без учёта правок и особых случаев 

				</div>
			</section>

			<section v-if="LoginStatus" class="cost_calc-aside-total">
				<h6> Итоговая цена: </h6>
				<span class="cost_calc-aside-total">{{ Cost }} ₽</span>
			</section>

			<section v-else class="cost_calc-aside-total">
				<h6>Итоговая цена c учётом комиссии фриланс биржи:</h6>
				<span>{{ Cost }} ₽</span>

				<div class="cost_calc-aside-info">
					<i class="fas fa-info-circle" />

					В зависимости от площадки, её допонительная комиссия как посредника 
					может составлять от <strong>{{ (Tax - 1) * 100 }} %</strong> и выше. 
					Через регистрацию на сайте она составит: <strong>{{ Cost * Tax }} ₽</strong>

				</div>

			</section>

		</div>

	</section>
</template>

<style lang="scss" scoped>

.cost_calc {
	&-container {

		display: grid;
		grid-template: {
			columns: 5fr 7fr;
		}

		gap: 15px;

		min-height: 40vh;

		padding: 2vh 0;

		input {
			-webkit-appearance: none;
			overflow: hidden;
			background-color: rgb(var(--color-mono-300));
			border: 1px solid rgb(var(--color-mono-400));
			border-radius: var(--border-radius);
			width: 100%;
			&:focus {
				outline: none;
			}
			&::-webkit-slider {
				runnable-track {
					width: 100%;
					height: 20px;
					cursor: pointer;
					transition-duration: .5s;
				}
				thumb {
					-webkit-appearance: none;
					height: 100%;
					width: 6px;
					border-radius: var(--border-radius);
					background-color: rgb(var(--color-mono-500));
					cursor: pointer;
					transition-duration: .5s;
					&:hover {
						transform: scale(1.5);
						background-color: rgb(var(--color-mono-900));
					}
				}
			}
		}

	}
	&-main {

		border: {
			right: 1px solid rgb(var(--color-mono-400))
		}

		&-title {
			display: block;
			padding: 2vh 0 0;
			font: {
				size: var(--font-size-14);
				weight: 700;
			}
		}

		&-select {
			display: flex;
			select {
				width: 90%;
			}
			span {
				width: 10%;
				display: flex;
				i {
					margin: auto;
				}
			}
		}

		&-header {
			@include gradient_border(bottom);
			text-align: center;
			padding: 2vh 0;
		}

		select {
			display: inline-block;
			outline: none;
			width: 90%;
			border-radius: var(--border-radius);
			background-color: rgb(var(--color-mono-200));
			border: 1px solid rgb(var(--color-mono-400));
			color: rgba(var(--color-mono-900), .75);
			font-weight: 700;
			font-size: var(--font-size-14);
			padding: 1vh 15px;
			margin: { bottom: 1vh; top: 1vh };
		}

		option {
			border: 0px solid rgb(var(--color-mono-900));
			font-size: var(--font-size-20);
			color: rgba(var(--color-mono-900), .75);
			font-weight: 700;
		}

	}
	&-aside {
		position: relative;
		border-radius: var(--border-radius);

		max-height: 65vh;
		overflow-y: scroll;

		padding: { rigth: 2vw }

		section {
			margin: 5vh 2vw;
		}

		hr {
			background-color: rgb(var(--color-mono-400));
		}

		&-info {
			color: rgb(var(--color-mono-900));
			width: 60ch;
			margin: { left: 1vw };
			font: {
				size: var(--font-size-14)
			}
			i {
				margin-right: .5ch;
			}
			strong {
				padding: 0 6px;
				margin: 0 1ch;
				line-height: 10px;
				background-color: var(--color-accent-pass);
				color: rgb(var(--color-mono-200));
				border-radius: var(--border-radius);
			}
		}

		&-header {
			@include gradient_border(bottom);
			background-color: rgb(var(--color-mono-200));
			text-align: center;
			padding: 2vh 1vw;
			margin: unset !important;
			h5 {
				font: {
					weight: 700;
				}
			}
		}

		&-quantity {
			span {
				display: block;
				margin: { left: 1vw };
				strong {
					color: rgb(var(--color-mono-900));
				}
			}
		}

		&-time {
			span {
				display: block;
				margin: { left: 1vw };
			}
		}

		&-total {
			span {
				display: block;
				margin: { left: 1vw };
				padding: 2vh 0;
				font: {
					size: var(--font-size-24);
					weight: 700;
				}
				strong {
					color: rgb(var(--color-mono-400));
				}
			}
		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

// VUEX
	import { mapState } from 'vuex'

	import firebase from 'firebase/app'; 
	import type { VuexModules } from '~/typescript/VuexModules'

// FIREBASE 
import 'firebase/database'

// TYPES 
	import type { 
		CATEGOTIES, 
		ADDICTION, 
		SERVICE, 
		WebApplications, 
		GraphicalDesign, 
		HTMLcode 
	} from '~/typescript/Services'

	export default Vue.extend({
		props: {
			CategoryDefined: { type: Boolean, default: false } as PropOptions<boolean>,
			DefaultCategory: { type: String, default: 'WebApplications' } as PropOptions<CATEGOTIES>,
		},
		data() {
			return {

				Tax: 1.25,

				Cost: 0,
				SpendedTime: 0,
				AddictionCost: 0,
				ServiceCost: 0,

				// Тип Услуги
				Category: ['WebApplications', 'GraphicalDesign', 'HTMLcode'] as CATEGOTIES[],
				Services: [] as Array< WebApplications | GraphicalDesign | HTMLcode >,

        // Выбор услуг
				AddictionQuantity: 1 as number,

				Selected: {
					Quantity:    1 as number,
					Category: 	this.CategoryDefined ? this.DefaultCategory : '' as CATEGOTIES,
					Service: 		{} as SERVICE,
					Addiction: 	[] as ADDICTION[],
				},

        Products: 	[] as SERVICE[],
				Addictions: [] as ADDICTION[],

			}
		},
		computed: {

			...mapState({
				LoginStatus: state => (state as VuexModules).Auth.Auth.LoginStatus
			}),

			AddictionSections(): number {
				return this.AddictionQuantity + Object.values( this.Selected.Addiction ).length
			},
			COMP_AddictionCost(): number {

				if ( this.Selected.Addiction.length ) {

					return this.Selected.Addiction.map( x => x.Cost ).reduce((acc, cur) => { return acc + cur }, 0)

				}  return 0 

			},
			COMP_ServiceCost(): number {
				return this.Selected.Service.Cost ? this.Selected.Service.Cost * this.Selected.Quantity : 0 
			},
			COMP_Cost(): number {

				if ( Object.keys( this.Selected.Service ).length ) {

					return  (( this.Selected.Service.Cost * this.Selected.Quantity ) + this.AddictionCost )

				}  return 0 

			},
			COMP_SpendedTime(): number {

        const TimeToWorkEquality = 150

        return this.Cost / TimeToWorkEquality

      },
		},
		watch: {

			COMP_Cost(newValue, oldValue) {
				this.AnimateState('Cost', [oldValue, newValue])
			},
			COMP_SpendedTime(newValue, oldValue) {
				this.AnimateState('SpendedTime', [oldValue, newValue])
			},
			COMP_AddictionCost(newValue, oldValue) {
				this.AnimateState('AddictionCost', [oldValue, newValue])
			},
			COMP_ServiceCost(newValue, oldValue) {
				this.AnimateState('ServiceCost', [oldValue, newValue])
			},

			Selected: {
				handler() {
					this.$emit('curent-service', this.Selected)
				},
				deep: true
			}

		},
		mounted() {

			if ( this.CategoryDefined ) {
				this.GetServicesOfCategory(this.DefaultCategory)
			}

		},
		methods: {

			AnimateState(key: string, value: [any, any]) {

				this.$AnimeJS({
					targets: this.$data,
					[key]: value,
					duration: 500,
					easing: 'linear',
					round: 1,
				})

			},

			SetProducts(_array: SERVICE[]) {

				this.Products = []

				_array.forEach((item: SERVICE) => {
					this.Products.push(item)
				})

			},

			RemoveAddiction(index: number) {

				const SA = this.Selected.Addiction.slice(0, index)
				const EA = this.Selected.Addiction.slice(index + 1)

				this.Selected.Addiction = [ ...SA, ...EA ]

			},

			AlreadySelectedAddiction(_type: ADDICTION['Type']): boolean {

				const T = this.Selected.Addiction.filter( item => item?.Type === _type)

				return Boolean(T.length)

			},

			GetServicesOfCategory(category: CATEGOTIES) {

				this.Services = []

				firebase.database()
					.ref(`Service/${ category }`)
					.once('value')
					.then( (data) => {

						const S = Object.values( data.val() ) as SERVICE[]

						this.SetProducts(S)

						S.forEach(( item: SERVICE ) => {
							
							this.Services.push( item.Type )

						}) 

					})

			},

			GetAddictionsOfService(service: WebApplications | GraphicalDesign | HTMLcode ) {

				firebase.database()
					.ref(`Service/Addictions/${ service }`)
					.once('value')
					.then( (data) => {

						this.Addictions = Object.values(data.val()) as ADDICTION[];

					});

			},

			TimeFilter(value: number = 0) {

				let V = value; if ( V > 12) { V = V / 12 }; 
				
				return V.toFixed(0)
				
			},
			
			DataFilter(value: number = 0) {

				const HOURS: {[index: number]: string} = {
					0: '',
					1: 'Час',
					4: 'Часа',
					12: 'Часов',
					18: 'День',
					54: 'Дня',
					[Number.MAX_SAFE_INTEGER]: 'Дней'
				}

				const I = Object.keys( HOURS ).filter(item => value <= Number(item) )[0]

				return HOURS[Number(I)]
				
      }

		}
	})

</script>
