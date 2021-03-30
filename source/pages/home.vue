<template>
	<div id="HomePage" class="home-container">

		<main>

			<client-only>
				<auth v-if="$isMobile" />
			</client-only>

			<pagination :payload="{ order: 1, scrollTarget: 445, section: 'home', delay: 0 }" />

			<nuxt-child 
				:key="$route.path" 
				class="home-content"
			/>

			<pagination :payload="{ order: -1, scrollTarget: 445, section: 'home', delay: 0 }" />

		</main>

		<aside>

			<client-only>
				<auth v-if="!$isMobile" />
			</client-only>

			<div class="vk_post_container">

				<div class="vk_post_header">
					<i class="fab fa-vk" />
					<i class="fab fa-vk" />
					<span>Посты из Вконтакте</span>
				</div>

				<div class="vk_post_wrapper"> 

					<!-- @scroll.passive="Test" -->

					<client-only>
						<VKPostWidget
							v-for="prop in VKPost"
							:key="prop.PostKey"
							:payload="prop"
						/>
					</client-only>

				</div>
			</div>
			
		</aside>

	</div>
</template>

<style lang="scss" scoped>

.home {
	&-container {
		display: grid;
		column-gap: 15px;
		grid-template-columns: 9fr 3fr;
		@media screen and ( max-width: var(--mobile-breakpoint)) {
			grid-template-columns: 1fr;
		}
	}
	&-content {
		min-height: 75vh;
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import { mapMutations, mapState } from 'vuex'

	import firebase from 'firebase/app'
	import 'firebase/database'

// MIXINS
	import TransitionSound 		from '~/assets/mixins/TransitionSound.ts'
	import TransitionProperty from '~/assets/mixins/PageTransitionProperty.ts'

// COMPONENTS
	import Pagination 			from '~/components/common/Pagination.vue'
	import Auth 							from '~/components/auth/Wrap.vue'

// TYPES
	import type { VuexModules } from '~/types/VuexModules'

// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic.ts'

// MODULE
	export default Vue.extend({ 
		components: {
			Pagination,
			Auth,
			VKPostWidget: () => import('~/components/common/VKPostWidget.vue'),
		},
		mixins: [ TransitionSound, TransitionProperty ],
		layout: 'Application', 
		scrollToTop: false, 
		data() {
			return {

				Title: 'Главная',

				LoadRange: load_ranges.posts,

				VKPost: [
					{
						ID: '-158755478',
						PostKey: 17,
						Hash: 'w29AkYYd9i4Jh7t0SORRF1-mZg4',
					},
					{
						ID: '-158755478',
						PostKey: 14,
						Hash: 'vYYjqYns8GMqZpbxETGHiY4enUg'
					},
				],

				PostHolder: [
					{
						ID: '-158755478',
						PostKey: 17,
						Hash: 'w29AkYYd9i4Jh7t0SORRF1-mZg4',
					},
					{
						ID: '-158755478',
						PostKey: 14,
						Hash: 'vYYjqYns8GMqZpbxETGHiY4enUg'
					},
				]
			}
		},
		head () {
			return {
				title: 'Eccheuma | Главная',
				meta: [
					{ 
						hid: 'description', 
						name: 'description', 
						content: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.' ,
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
				LoginStatus: state => (state as VuexModules).Auth.Auth.LoginStatus
			})
		},
		async created() {

			const PostsQuantity: number = await firebase.database().ref('Posts').once('value').then( data => data.numChildren() );

			this.ChangePageQuantity( Math.ceil( PostsQuantity / this.LoadRange ) );

		},
		methods: {
			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			})
		},
	})

</script>
