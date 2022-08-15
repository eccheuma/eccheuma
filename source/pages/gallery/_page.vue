<template>
	<section ref="page" class="gallery-page" :key="Page" :style="dynamicStyles">

		<template v-if="$isMobile">
			<eccheuma-image

				v-for="(image, index) in Images"

				:id="`GalleryImage_${ index }`"
				:key="image.content.path"

				:ref="'images'" 
				:style="`order: ${( BasePoint - image.ID ) + Images.length }`"

				:content="image.content" 
				:sections="{ date: true, description: true, zoom: true }" 
				:property="{ fit: 'cover', type: 'gallery', collumn: 10 }"
			>

				{{ image.content.description }}

			</eccheuma-image>
		</template>

		<template v-for="(image, index) in Images" v-else>
			<intesection-component 
				:key="image.content.path"
				:style="`order: ${( BasePoint - image.ID ) + Images.length }`"
				:rootMargin="5"
				:wrap="true" 
				@isIntersecting="animateImage"
				>
				<eccheuma-image
					:id="`GalleryImage_${ index }`"
					:ref="'images'" 

					:content="image.content" 
					:sections="{ date: true, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'gallery', collumn: 10 }"
					>

					{{ image.content.description }}

				</eccheuma-image>
			</intesection-component>
		</template>

	</section>
</template>

<style lang="scss">

.gallery-page {
	transition-duration: 250ms;
}

</style>

<script lang="ts">

	import Vue, { VNodeData } from 'vue'

	// VUEX
	import { mapActions, mapMutations, mapState } from 'vuex'
	
	// VUEX MAP
	import type { VuexMap } from '~/types/VuexMap';

	// API
	import { database } from '~/api/database';

	// UTILS
	import { Meta } from '~/utils/meta';

	// MIXINS
	import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty'

	// TYPES
	import type { PayloadQuery } 					from '~/store/PageContent'
	import type { ANIMATION_PAYLOAD } from '~/assets/mixins/IntersectionObserver'

	import { navigation } from '~/types/Navigation';

	// LOAD POLITIC
	import { Ranges } from '~/config/LoadPolitic'

	// COMPONENTS
	import EccheumaImage 						from '~/components/image/Image.vue'
	import IntesectionComponent from '~/components/functional/intersectionComponent.vue'

	const PAGE_TRANSITION_TIME = 250;

	// INTERSECTION_ANIMATION
	const Animation: ANIMATION_PAYLOAD = {
		in: {
			opacity: [0, 1],
			translateY: [100, 0],
			duration: () => 500 + 500 * Math.random(),
		},
		out: {
			opacity: [1, 0],
			translateY: [0, 100],
			duration: () => 500 + 500 * Math.random(),
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaImage, IntesectionComponent
		},
		mixins: [ PageTransitionProperty ],
		async middleware({ params, query, redirect }) {

			// Возможно лучше вообще отказаться от мидлвар вовсе. Уж больно они мне не нравятся.

			if ( !query.range && !params.query ) return;

			// ? Parse page_1: str => 1: int
			const Page: number = parseInt(params.page.slice(-1));

			const Range: number = typeof query.range === 'string'
				? parseInt(query.range)
				: Ranges.gallery

			const Quantity: number = await database.getLength('Gallery');

			if ( ! Number.isInteger(Page) ) redirect('/error');
 
			const inRange: boolean = (Quantity + Range) >= (Page * Range);

			inRange 
				? null 
				: redirect('/error');

    },
		asyncData({ params, query }) {

			const Page 			= Number( params.page.slice(-1) ); // page_1 => 1
			const LoadRange = Number( query.range );
			
			return { Page, LoadRange }

		},
		data() {
			return {

				Ready: false,
				
				Page: 1,
				LoadRange: Ranges.gallery,
				BasePoint: 0,

			}
		},
		async fetch() {

			await this.getDatabaseData();
			
		},
		head(): {[index: string]: string } {

			return {
				title: Meta.conctructTitle(this.Lang, { 
					page: this.Page, 
					section: navigation.routeSections.gallery
				}),
			}
			
		},
		computed: {

			...mapState({
				Images	: state => (state as VuexMap).PageContent.Content.Gallery,
				Lang 		: state => (state as VuexMap).App.Lang
			}),

			dynamicStyles(): VNodeData['style'] {
				return {
					['--t']: `${ PAGE_TRANSITION_TIME }ms`,
					opacity: Number(this.Ready)
				}
			}

		},
		created() {

			this.ChangePage(this.Page);

			if ( process.browser && this.$router.currentRoute.name === 'gallery' ) {
				this.getDatabaseData();
			}

			this.$router.beforeEach((to, from, next) => {

				if (to.name !== 'gallery-page') return next();

				this.Ready = false;

				setTimeout(next, PAGE_TRANSITION_TIME);

			})

		},
		methods: {
			
			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),
			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			async getDatabaseData() {

				const QUANTITY = await database.getLength('Gallery')

				const REM: number = QUANTITY - ( this.LoadRange * this.Page )

				const Query: PayloadQuery = {
					ref: 'Gallery',
					loadQuery: {
						LoadRange: REM < 0 ? this.LoadRange + REM : this.LoadRange,
						LoadPoint: REM < 0 ? 0 : REM
					}
				}

				await this.GetContent(Query);

				this.Ready = true

			},

			animateImage(intersection: boolean, slotNode: Node) {

				this.$AnimeJS({
					targets: slotNode,
					easing: 'linear',

					...Animation[intersection ? 'in' : 'out']

				})

			}

		},
	})
	
</script>
