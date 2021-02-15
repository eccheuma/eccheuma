<template>
	<main class="service-container">

		<promo-banner promo-type="Works" />

		<section class="service-section_title">
			<span>1</span>
			<h5>Типы услуг</h5>
			<p>Хороший способ заранее уточнить цену на разные виды услуг, получить ориенировачное время на выполнения, и узнать об оптимизации цены.</p>
		</section>

		<section class="service-products">

			<service-item v-for="(item, i) in Products" :key="`card-${ i }`" :payload="item" />

		</section>

		<section class="service-section_title">
			<span>2</span>
			<h5>Калькулятор цены для разного вида услуг.</h5>
			<p>Хороший способ заранее уточнить цену на разные виды услуг, получить ориенировачное время на выполнения, и узнать об оптимизации цены.</p>
		</section>

		<section class="service-calc_wrapper">
			<cost-calc default-category="" :category-defined="false"/>
		</section>

	</main>
</template>

<script lang="ts">

	import Vue from 'vue'

	// MIXINS
	import TransitionSound from '~/assets/mixins/TransitionSound';

	// COMPONENTS
	import ServiceItem from '~/components/service/ServiceItem.vue'

	// TYPES 
	import type { CATEGOTIES, SERVICES_CARD } from '~/types/Services.ts'

	// MODULE
	export default Vue.extend({
		layout: 'Application',
		scrollToTop: false,  
		transition: 'OpacityTransition', 
		mixins: [ TransitionSound ],
		head () {
			return {
				title: `Eccheuma | Портфолио`,
				meta: [
					{ 
						name: 'description', 
						content: `Услуги. Перечень оказываемых услуг, калькулятор стоимости, и форма обратной связи.`
					}
				]
			}
		},
		data() {
			return {

				Products: [
					{ 
						path: 'WebApplications',
						title: 'Готовые решения',
						subTitle: 'Лэндинги, сайты, CMS, web приложения',
						description: 'Включает в себя полный цикл создания приложения / сайта / лэндинга. Начиная от создания графического макета, с его последующей вёрсткой, и созданием бизнес логики на платформе \'Vue & Firebase\'.'
					},
					{
						path: 'GraphicalDesign',
						title: 'Графический Дизайн',
						subTitle: 'Логотипы, баннера, визитки',
						description: 'В данном бандле есть всё, начиная от оформления заказа на визитки, логотипы, и прочие услуги по графическому макетированию. Так же работа с вектором, если она необходима.'
					},
					{
						path: 'HTMLcode',
						title: 'Вёрстка',
						subTitle: 'Вёрстка графических макетов',
						description: 'Создание HTML и CSS(Sass) разметки на основе готового графического макета, для дальнейшей работы Front-End разработчика и переноса полученной разметки на нужную для вас платформу.'
					}
				] as SERVICES_CARD[],

				Categories: ['WebApplications', 'GraphicalDesign', 'HTMLcode'] as CATEGOTIES[]
			}
		},
		components: {
			ServiceItem,
			// Async components ========================================= //
			PromoBanner: () => import  ( '~/components/promo/PromoBanner.vue' ),
			CostCalc: () => import  ( '~/components/service/CostCalc.vue' ),
		},
	})

</script>


<style lang="scss">

.service {
	&-container {

	}
	&-products {
		
		display: grid;
		grid-template: {
			columns: repeat(3, 1fr)
		}

		gap: 15px;

		padding: 0 3vw;

	}

	&-calc_wrapper {
		width: 75%;
		margin: auto;
	}

	&-section_title {
		@include gradient_border(both);
		position: relative;
		padding: 3vh 5vw;
		margin: 3vh 0;
		span {
			position: absolute; top: 0; left: 0;
			font-size: 5vh;
			font-weight: 700;
			color: $color3;
			text-align: center;
			display: block;
			height: 100%;
			width: 5vw;
			line-height: 100px;
		}
		p {
			margin: 0px;
			font-size: 12px;
			color: $color4;
		}
	}
}

// .service
// 	&_annota // Шапка
// 		padding: 0px 0px
// 		&_wrap
// 			padding: 20px 0
// 			display: inline-block
// 		hr
// 			width: 100%
// 			background-color: $color2
// 		span
// 			// background-color: red
// 			font-size: 36px
// 			font-weight: 700
// 			color: $color3
// 			text-align: center
// 			display: inline-block
// 			height: 100%
// 			width: 100px
// 		p
// 			margin: 0px
// 			font-size: 12px
// 			color: $color4

</style>
