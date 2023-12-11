<template>
	<div id="HomePage" class="home-container">

		<section class="home-wrapper home-main" >
			<pagination :payload="{ order: 1, scrollTarget: 445, section: 'home', delay: 0 }" />
			<nuxt-child :key="$route.path" />
			<pagination :payload="{ order: -1, scrollTarget: 445, section: 'home', delay: 0 }" />
		</section>

		<section class="home-wrapper home-auth">
			<client-only>
				<auth />
			</client-only>
		</section>

		<section class="home-wrapper home-feed">
			<!-- <client-only> -->
				<vk-posts-container :posts="vk_feed"/>
			<!-- </client-only> -->
		</section>

	</div>
</template>

<style lang="scss" scoped>

.home {
	&-wrapper {
		padding: 2vh 10px;
		background: rgb(var(--color-mono-200));
	}
	&-container {
		display: grid;
		grid-template-columns: 9fr 3fr;
		grid-template-rows: auto 1fr;
		grid-template-areas: 
			"main auth" 
			"main feed";
		column-gap: 1vw;

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template-columns: 1fr;
			grid-template-areas: "auth" "main" "feed";
		}

	}
	&-main {
		grid-area: main;
		display: flex;
		flex-direction: column;
		row-gap: 2vh;
	}
	&-auth {
		grid-area: auth;
	}
	&-feed {
		grid-area: feed;
		padding: 0;
	}
}

</style>

<script lang="ts">

	import Vue from "vue";

// VUEX
	import { mapMutations, mapState } from "vuex";

// API
	import { database } from "~/api/database";
	import { feed } from "~/api/feed";

// MIXINS
	import TransitionProperty from "~/assets/mixins/PageTransitionProperty";

// COMPONENTS
	import Pagination from "~/components/common/Pagination.vue";
	import Auth from "~/components/auth/Auth.vue";

// TYPES
	import type { VuexMap } from "~/contracts/VuexMap";

// LOAD POLITIC
	import { Ranges } from "~/config/LoadPolitic";

// PAGE DESCRIPTION
	import { opengraph } from "~/utils/opengraph";

	export const PageDescription: opengraph.struct = {
		title				: "Eccheuma | Главная",
		description	: "Главная страница. Тут собраны статьи на завязанные на профильную тему.",
		url					: "",
		image				: require("~/assets/images/NotificationBadge.png?resize&size=600").src,
	};

// MODULE
	export default Vue.extend({ 
		components: {
			Pagination,
			Auth,
			VkPostsContainer: () => import("~/components/feed/Container.vue"),
		},
		mixins: [ TransitionProperty ],
		layout: "Application", 
		scrollToTop: false, 
		async asyncData() {

			const vk_feed = await feed.get();

			return { vk_feed };

		},
		data() {
			return {

				Title: "Главная",
				PageQuantity: 0,

			};
		},
		head() {
			return {
				title: PageDescription.title,
				meta: [
					...new opengraph.Meta(PageDescription).buildMeta()
				],
			};
		},
		async mounted() {

			const PostsQuantity: number = await database.getLength("posts");

			this.PageQuantity = Math.ceil( PostsQuantity / Ranges.posts );

			this.ChangePageQuantity(this.PageQuantity);

		},
		computed: {
			...mapState({
				LoginStatus: state => (state as VuexMap).Auth.Session.LoginStatus
			})
		},
		methods: {
			...mapMutations({
				ChangePageQuantity: "PageSelector/ChangePageQuantity"
			})
		},
	});

</script>
