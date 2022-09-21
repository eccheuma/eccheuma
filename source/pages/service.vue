<template>
	<main class="service-container">

		<promo-banner promo-type="Adaptation" />

		<section class="service-main">

			<section-header>
				<template #header>	
					<span>C большой вероятностью, вы пришли сюда за этим</span>
				</template>
				<!-- <template #default>
					<span></span>
				</template> -->
			</section-header>

			<service-card :payload="Products[0]" :wide="true" />

		</section>

		<section class="service-calculator">

			<section-header>
				<template #header>	
					<span>Калькулятор стоимости</span>
				</template>
				<template #default>
					<span>...</span>
				</template>
			</section-header>

			<calculator />

		</section>

		<section class="service-products">

			<section-header>
				<template #header>	
					<span>Прочие предоставляемые услуги</span>
				</template>
				<template #default>
					<span>Разбитые на категории работы, с указание цены, отзывов, и технологий</span>
				</template>
			</section-header>

			<div class="service-products-items">
				<service-card v-for="(item, i) in Products" :key="i" :payload="item" />
			</div>

		</section>

		<caption-card>
			<template #type>
				Напоминание касательно примяго предоставление услуг.
			</template>
			<template #desc>
				Большая часть услуг предоставляется посредством взаимодействия через сайта как сервис. И лишь в крайних случая минуя его, так как это мешает менеджменту заказов и вводит лишнюю сумятицу, что лишь усугубит сроки.
			</template>
		</caption-card>	

	</main>
</template>

<style lang="scss">

.service {
	&-container {

		display: grid;
		row-gap: 2vh;
		padding: 3vh 1vw;

		> section {
			@include component-shadow;
			@include gradient_border;

			border-radius: var(--border-radius);
			padding: 2vh 2vw 4vh;
		}

	}
	&-main {
		display: grid;
		justify-content: center;
	}
	&-products {

		&-items {
			display: grid;
			grid-template: {
				columns: 1fr 1fr 1fr;
			}

			column-gap: 1vw;

		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// COMPONENTS
	import PromoBanner      from '~/components/promo/PromoBanner.vue';

	import SectionHeader 		from '~/components/common/SectionHeader.vue';
	import CaptionCard 			from '~/components/common/Caption.vue';

	import ServiceCard 			from '~/components/service/ServiceCard.vue';
	import Calculator				from '~/components/service/Calculator/view.vue';

	// TYPES 
	import type { Categories, Purchase } from '~/types/Services';

	interface CardStruct extends Purchase.Description {
		category : Categories,
	}

	// 'Услуги. Перечень оказываемых услуг, калькулятор стоимости, и форма обратной связи.'

	// PAGE DESCRIPTION
	import { opengraph } from '~/utils/opengraph';

	export const PageDescription: opengraph.struct = {
		title				: 'Eccheuma | Услуги',
		description	: 'Услуги. Перечень оказываемых услуг, калькулятор стоимости, и форма обратной связи.',
		url					: '',
		image				: require('~/assets/images/NotificationBadge.png?resize&size=600').src,
	};

	// MODULE
	export default Vue.extend({
		components: {
			SectionHeader,
			ServiceCard,
			PromoBanner,
			Calculator,
			CaptionCard,
		}, 
		layout: 'Application',
		scrollToTop: false,  
		transition: 'opacity-transition',
		data() {
			return {

				Products: [
					{ 
						category: 'Application',
						name: 'Готовые решения',
						description: 'Лэндинги, сайты, CMS, web приложения',
						about: 'Включает в себя полный цикл создания приложения / сайта / лэндинга. Начиная от создания графического макета, с его последующей вёрсткой, и созданием бизнес логики на платформе "Vue & Firebase".'
					},
					{
						category: 'Graphic',
						name: 'Графический Дизайн',
						description: 'Логотипы, баннера, визитки',
						about: 'В данном бандле есть всё, начиная от оформления заказа на визитки, логотипы, и прочие услуги по графическому макетированию. Так же работа с вектором, если она необходима.'
					},
					{
						category: 'FrontEnd',
						name: 'Вёрстка',
						description: 'Вёрстка графических макетов',
						about: 'Создание HTML и CSS(Sass) разметки на основе готового графического макета, для дальнейшей работы Front-End разработчика и переноса полученной разметки на нужную для вас платформу.'
					}
				] as Array<CardStruct>,

				Categories: ['Application', 'Graphic', 'FrontEnd'] as Array<Categories>,

			};
		},
		head () {
			return {
				title: PageDescription.title,
				meta: [
					...new opengraph.Meta(PageDescription).buildMeta()
				],
			};
		},
	});

</script>
