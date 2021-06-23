<template>
	<div class="admin-container">

		<!-- v-if="UserState.UserID == 'tGOrAx0PyvWmxQ64gYcUxn3roNB3' || DEVELOPMENT"> -->

		<template v-if="true">

			<aside>
				<section class="admin-header">
					<span>Escape From Mordorland CMS</span>
					<span>Тестовый вариант админки | v - 0.1.12</span>
				</section>
				<section class="admin-navigation">
					<button v-for="(item, index) in Sections" :key="index" @click="CurentComponent = item.component">
						{{ item.title }}
					</button>
				</section>
			</aside>

			<main>
				<component :is="CurentComponent" />
			</main>

		</template>
	</div>
</template>

<style lang="scss">

.admin {
	&-container {

		width: 100vw;
		height: 100vh;

		display: grid;
		grid-template: {
			columns: 1fr 3fr;
		}

		main {

			padding: 2vh 3vw;

			background: {
				color: rgb(var(--color-1));
			}

			display: flex;

			overflow: {
				y: scroll;
				x: hidden;
			}

		}

		aside {

			display: grid;
			grid-template: {
				rows: 10vh auto 1fr;
			}

			background: {
				color: rgb(var(--color-2));
			}

		}

	}
	&-navigation {

		width: 100%;
		display: inline-grid;

		button {

			width: 75%;

			margin: 10px auto;

			display: block;
			@include light-button;

		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'  

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// COMPONENTS 

	import GalleryImage 	from '~/components/AdminPanel/GalleryImage.vue';
	import PortfolioCase 	from '~/components/AdminPanel/PortfolioCase.vue';
	import Post						from '~/components/AdminPanel/Post.vue';
	import Messages				from '~/components/AdminPanel/Messages.vue';

	// TYPES
	type COMPONENTS = 'GalleryImage' | 'PortfolioCase' | 'Post' | 'Messages';

	type SECTIONS = {
		title: string
		component: COMPONENTS
	}

	export default Vue.extend({
		components: {
			GalleryImage,
			PortfolioCase,
			Post,
			Messages,
		},
		data() {
			return {
				
				CurentComponent: 'Post' as COMPONENTS,

				Sections: [
					{
						title: 'Галлерея',
						component: 'GalleryImage',
					},
					{
						title: 'Посты',
						component: 'Post',
					},
					{
						title: 'Портфолио',
						component: 'PortfolioCase',
					},
					{
						title: 'Сообщения',
						component: 'Messages',
					}
				] as SECTIONS[],

			}
		},
		computed: {
			...mapState({
				UserState: state	=> (state as VuexModules).User.State.UserState,
			}),
		},
	})

</script>
