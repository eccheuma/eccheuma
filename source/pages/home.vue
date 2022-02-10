<template>
	<div id="HomePage" class="home-container">

		<main>

			<client-only>
				<auth v-if="$isMobile" />
			</client-only>

			<pagination :payload="{ order: 1, scrollTarget: 445, section: 'home', delay: 0 }" />

			<nuxt-child :key="$route.path" class="home-content" />

			<pagination style="align-self: end" :payload="{ order: -1, scrollTarget: 445, section: 'home', delay: 0 }" />

		</main>

		<aside>

			<client-only>

				<auth v-if="!$isMobile" v-once />

				<vk-posts-container />

			</client-only>
			
		</aside>

	</div>
</template>

<style lang="scss" scoped>

aside {

	padding: 2vh 10px;
	display: grid;
	row-gap: 2vh;
	align-content: start;

}

main {
	display: grid;
	row-gap: 2vh;
	align-content: start;
	padding: 2vh 10px;
}

.home {
	&-container {
		display: grid;
		column-gap: 15px;
		grid-template-columns: 3fr minmax(300px, 1fr);
		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template-columns: 1fr;
		}
	}
	&-content {
		display: grid;
		row-gap: 2vh;
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapMutations, mapState } from 'vuex'

// API
	import { database } from '~/api/database'

// MIXINS
	import TransitionSound 		from '~/assets/mixins/TransitionSound'
	import TransitionProperty from '~/assets/mixins/PageTransitionProperty'

// COMPONENTS
	import Pagination 			from '~/components/common/Pagination.vue'
	import Auth 						from '~/components/auth/Auth.vue'

// TYPES
	import type { VuexMap } from '~/typescript/VuexMap'

// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic'

// MODULE
	export default Vue.extend({ 
		components: {
			Pagination,
			Auth,
			VkPostsContainer: () => import('~/components/feed/VkPostsContainer.vue'),
		},
		mixins: [ TransitionSound, TransitionProperty ],
		layout: 'Application', 
		scrollToTop: false, 
		data() {
			return {

				Title: 'Главная',

				LoadRange: load_ranges.posts,

			}
		},
		async fetch() {

			const PostsQuantity: number = await database.getLength('Posts');

			this.ChangePageQuantity( Math.ceil( PostsQuantity / this.LoadRange ) );

		},
		head () {
			return {
				title: 'Eccheuma | Главная',
				meta: [
					{ 
						hid: 'description', 
						name: 'description', 
						content: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.',
					},
					{
						hid: 'og:title', 
						property: 'og:title',
						content: 'Escape from Mordorland - Главная',
					},
					{
						hid: 'og:description', 
						property: 'og:description',
						content: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.',
					},
				],
			}
		},
		computed: {
			...mapState({
				LoginStatus: state => (state as VuexMap).Auth.Session.LoginStatus
			})
		},
		methods: {
			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			})
		},
	})

</script>
