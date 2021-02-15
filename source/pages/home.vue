<template>
	<div class="home-container" id="Home">

		<main>
			<!-- <section class="container"> -->

				<client-only>
					<Auth v-if="$isMobile"></Auth>
				</client-only>

				<page-selector :payload="{ order: 1, scrollTarget: 445, section: 'home', collumns: 3 }"/>

				<nuxt-child class="home-content" :key="$route.path" :load-range="LoadRange" />

				<page-selector :payload="{ order: -1, scrollTarget: 445, section: 'home', collumns: 3 }"/>

			<!-- </section>  -->
		</main>

		<aside>

			<client-only>
				<Auth v-if="!$isMobile"></Auth>
			</client-only>

			<div class="vk_post_container">
				<div class="vk_post_header mt-1">
					<i class="fab fa-vk"></i><i class="fab fa-vk"></i>
					<span>Посты из Вконтакте</span>
				</div>
				<div class="d-lg-block d-sm-none vk_post_wrapper"> 

					<!-- @scroll.passive="Test" -->

					<!-- <client-only>
						<VKPostWidget
							v-for="prop in VKPost"
							:key="prop.PostKey"
							:ID="prop.ID"
							:PostKey="prop.PostKey"
							:Hash="prop.Hash">
						</VKPostWidget>
					</client-only> -->

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
		@media screen and ( max-width: $MobileBreakPoint ) {
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

	import { mapMutations } from 'vuex'

	import firebase from "firebase/app"
	import "firebase/database"

	import PageSelector from '~/components/common/PageSelector.vue'
	import TransitionSound from '~/assets/mixins/TransitionSound'

	export default Vue.extend({ 
		layout: 'Application', 
		scrollToTop: false, 
		transition: 'OpacityTransition', 
		mixins: [ TransitionSound ],
		head () {
			return {
				title: `Eccheuma | Главная`,
				meta: [
					{ 
						hid: 'description', name: 'description', 
						content: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.' 
					},
					{
						hid: 'og:title', property: 'og:title',
						content: `Escape from Mordorland - Главная `
					},
					{
						hid: 'og:description', property: 'og:description',
						content: `Главная страница. Тут собраны статьи на завязанные на профильную тему.`
					},
				],
			}
		},
		data() {
			return {

				Title: `Главная`,

				LoadRange: 4,

				VKPost: [
					{
						ID: "-158755478",
						PostKey: 17,
						Hash: 'w29AkYYd9i4Jh7t0SORRF1-mZg4',
					},
					{
						ID: "-158755478",
						PostKey: 14,
						Hash: 'vYYjqYns8GMqZpbxETGHiY4enUg'
					},
				],

				PostHolder: [
					{
						ID: "-158755478",
						PostKey: 17,
						Hash: 'w29AkYYd9i4Jh7t0SORRF1-mZg4',
					},
					{
						ID: "-158755478",
						PostKey: 14,
						Hash: 'vYYjqYns8GMqZpbxETGHiY4enUg'
					},
				]
			}
		},
		components: {
			PageSelector,
			VKPostWidget: () => import('~/components/common/VKPostWidget.vue'),
			Auth: 				() => import('~/components/user/Auth.vue'),
		},
		methods: {
			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			})
		},
		async created() {

			const PostsQuantity: number = await firebase.database().ref("Posts").once('value').then( data => data.numChildren() )

			const A = PostsQuantity / this.LoadRange
			const B = A % 1 == 1 ? Math.trunc(A) : Math.trunc(A) + 1 

			this.ChangePageQuantity(B)

		}
	})

</script>
