<template>
	<div class="promo_container">

		<section class="promo_header" :class="{ cooled: Cooled }">
			<h4>{{ moduleContent.title }}</h4> 
			<p>{{ moduleContent.subtitle }}</p>
		</section>

		<template v-if="!Cooled">
			<keep-alive>
				<component :is="PromoType" />
			</keep-alive>
		</template>

		<section class="promo_footer" :class="{ cooled: Cooled }">

			<p>
				{{ moduleContent.footer }}
			</p>

			<hr>

			<eccheuma-button @click.native="routeTo(moduleContent.link.path)">
				{{ moduleContent.link.name }}
			</eccheuma-button>

		</section>

	</div>
</template>
 
<style lang="scss">

.promo_container_slider {
	padding: 4px 15px;
}

.promo {
	&_container {

		display: grid; 
		justify-items: center;

		grid-template: {
			columns: 1fr;
			rows: 20vh 70vh 30vh
		}

		overflow: hidden;

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template: {
				columns: 1fr;
				rows: 30vh 120vh 50vh
			}
		}

		background: {
			color: rgb(var(--color-2));
		}

		> section {
			padding: 3vh 2vw;
			display: inline-grid;
			align-content: center;
		}
	}
	&_header {

		display: grid;
		width: 100%;

		@include gradient_border(bottom);

		background: {
			color: rgb(var(--color-1));
		}

		h4 {
			font-weight: 600;
			width: 100%;
			font-size: var(--font-size-1);
		}
		p {
			font-weight: 500;
			font-size: var(--font-size-3);
			width: calc(min(100%, 70ch));
			color: rgb(var(--color-4));
		}
		@media screen and ( max-width: $mobile-breakpoint ) {
			text-align: center !important;
		}
	}
	&_footer {

		width: 100%;

		display: grid;
		justify-items: center;

		@include gradient_border(top);

		padding: 3vh 0;

		background: {
			color: rgb(var(--color-1));
		}

		p {
			width: calc(min(100%, 120ch));
			font-size: 12px;
			font-weight: 700;
			padding: 0 5vw;
			color: rgb(var(--color-4));
		}
		hr {
			background-color: rgb(var(--color-4));
			width: 50%;
			height: .5px;
			border-top: unset;
		}
		button {

			@include light-button { 
				width: 25%; 
				justify-self: center; 
				margin-top: 15px; 
			}

			position: relative;

		}
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// MIXINS
	import IntersectionCooler 	from '~/assets/mixins/IntersectionCooler.ts'

	// TYPES
	type MODULES = 'Works' | 'Style' | 'Gallery' | 'Adaptation'

	type CONTENT = {
		title: string
		subtitle: string
		footer: string
		link: {
			path: string
			name: string
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			Works: 			() => import('~/components/promo/_Works.vue'),
			Style: 			() => import('~/components/promo/_Style.vue'),
			Gallery: 		() => import('~/components/promo/_Gallery.vue'),
			Adaptation: () => import('~/components/promo/_Adaptation.vue'),
			// OTHERS 
			EccheumaButton: () => import('~/components/common/EcchuemaButton.vue')
		},
		mixins: [
			IntersectionCooler
		],
		props: {
			PromoType: {
				type: String,
				required: true,
				default: 'Works'
			} as PropOptions<MODULES>
		},
		data() {
			return {

				Cooled: false,

				PromoContent: {
					Style: {
						title: 'Фирменный стиль и айдентика',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'Jugendlich ihr seh im träne freundschaft kommt was mir, vor busen erste lispelnd denen. Neu guten nennt hinweggeschwunden ernsten, mir weich mild lieb sich, was sich die guten klage unbestimmten ich neu. Busen lebens froher seelen festzuhalten ihr, besitze noch herz die herzen zerstoben ihr.',
						link: {
							path: '/service',
							name: 'К услугам'
						}
					},
					Works: {
						title: 'Последние выполненные заказы',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'Meinem die neu guten sich längst dem. Zauberhauch gezeigt und schöne mein lied tränen mein, mild nicht manche jenem träne und menge zug folgenden zerstreuet, jenem gleich hinweggeschwunden wie euch euch wirklichkeiten, in festzuhalten erste.',
						link: {
							path: '/portfolio',
							name: 'Перейти к портфолио'
						}	
					},
					Gallery: {
						title: 'Фирменный стиль и айдентика',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'Die  zu sage gut wiederholt den zug aus, strenge herzen herzen was sich verschwand und. Was lauf mir froher hören gestalten sage an ich, stillen vom strenge um euch bang wohl tage. Der wirklichkeiten wirklichkeiten schatten mild, nicht sonst es ihr einer lebens, strenge die zug jenem kommt sage getäuscht halbverklungnen was, es beifall mir nun glück alten lispelnd..',
						link: {
							path: '/service',
							name: 'К услугам'
						}
					},
					Adaptation: {
						title: 'Последние выполненные заказы',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'Mich neu getäuscht macht der mein mein, jenem ihr trüben mein hören naht mich zauberhauch,.',
						link: {
							path: '/portfolio',
							name: 'Перейти к портфолио'
						}	
					}
				} as {[T in MODULES]: CONTENT} 
			}
		},
		computed: {
			moduleContent(): CONTENT {
				return this.PromoContent[this.PromoType]
			}
		},
		mounted() {
			this.initCooler(this.$el, (cooled: boolean) => { this.Cooled = cooled })
		},
		methods: {
			routeTo(path: string) {

				console.log(path)

				this.$router.push({ path })
			}
		}
	})

</script>
