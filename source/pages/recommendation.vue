<template>
	<main class="recomendation-container">
		<h1>Скоро тут что-то да будет</h1>
		<span>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. 
			Impedit ab vel cupiditate at est, ipsum a doloribus consequuntur, debitis nostrum aliquid exercitationem deserunt asperiores. 
			Soluta aliquam quas quo possimus. Id?
		</span>
	</main>
</template>

<style lang="scss">

.recomendation {
	&-container {
		display: grid;
		place-items: center;
		place-content: center;

		h1 {
			font-size: var(--font-size-56);
			font-weight: 800;
		}

		span {
			font-size: var(--font-size-24);
			font-weight: 600;
			width: 50ch;
			text-align: center;
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// PAGE DESCRIPTION
	import { opengraph } from '~/utils/opengraph';

	export const PageDescription: opengraph.struct = {
		title				: 'Eccheuma | Рекомендации',
		description	: 'Раздел связан с обслуживанием и заметками касательно содержания проектов',
		url					: '',
		image				: require('~/assets/images/NotificationBadge.png?resize&size=600').src,
	};

	// MODULE
	export default Vue.extend({
		layout: 'Application',
		scrollToTop: false,
		transition: 'opacity-transition',
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