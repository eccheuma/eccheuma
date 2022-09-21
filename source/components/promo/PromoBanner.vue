<template>
	<div class="promo_container" v-if="moduleContent">

		<section v-once class="promo_header" :class="{ cooled: Cooled }">
			<h4>{{ moduleContent.title }}</h4> 
			<p>{{ moduleContent.subtitle }}</p>
		</section>

		<component :is="PromoType" />

		<section class="promo_footer" :class="{ cooled: Cooled }">

			<template v-if="moduleContent.footer.body">
				<notion>
					{{ moduleContent.footer.body }}
					<template v-if="moduleContent.footer.about">
						<a :href="moduleContent.footer.about" target="_blank">Подробнее</a>
					</template>
				</notion>
				<hr>
			</template>

			<common-button @click.native="routeTo(moduleContent.link.path)">
				{{ moduleContent.link.name }}
			</common-button>

		</section>

	</div>
</template>
 
<style lang="scss">

.promo_container_slider {
	padding: 4px 15px;
}

.promo {
	&_container {

		@extend %card-container;

		display: grid; 
		justify-items: center;

		grid-template: {
			columns: 1fr;
			rows: 20vh minmax(50vh, auto) auto;
		}

		grid-template-areas: "head" "body" "footer";

		overflow: hidden;
		color: rgb(var(--color-mono-900));

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template: {
				columns: 1fr;
				rows: 30vh auto min-content;
			}
		}

		> section {
			padding: 3vh 2vw;
			display: inline-grid;
			align-content: center;
		}
	}
	&_header {

		grid-area: head;

		display: grid;
		width: 100%;

		gap: var(--size-10);

		@include gradient_border(bottom);

		background: {
			color: rgb(var(--color-mono-200));
		}

		h4 {
			font-weight: 800;
			width: 100%;
			font-size: var(--font-size-56);
			font-family: var(--decor-font);

			letter-spacing: .15ch;
			line-height: var(--size-56);
			color: rgb(var(--color-mono-900));

		}
		@media screen and ( max-width: $mobile-breakpoint ) {
			text-align: center !important;
		}
	}
	&_body {

		grid-area: body;
		min-width: 55vw;
		@extend %pattern-lines;

	}
	&_footer {

		grid-area: footer;

		width: 100%;

		display: grid;
		justify-items: center;

		@include gradient_border(top);

		padding: 3vh 0;

		background: {
			color: rgb(var(--color-mono-200));
		}

		p {
			width: calc(min(100%, 120ch));
			font-size: var(--font-size-14);
			font-weight: 700;
			padding: 0 5vw;
			color: rgb(var(--color-mono-500));
			text-align: center;
		}
		hr {
			background-color: rgb(var(--color-mono-500));
			width: 50%;
			height: .5px;
			border-top: unset;
		}
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// TYPES
	type MODULES = 'Works' | 'Stylistics' | 'Gallery' | 'Adaptation'

	type CONTENT = {
		title: string
		subtitle: string
		footer: {
			body	: string,
			about?: string,
		}
		link: {
			path: string
			name: string
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			Works					: () => import('./submodules/Works.vue'),
			Stylistics		: () => import('./submodules/Stylistics.vue'),
			Gallery				: () => import('./submodules/Gallery.vue'),
			Adaptation		: () => import('./submodules/Adaptation.vue'),
			// OTHERS 
			CommonButton	: () => import('~/components/buttons/CommonButton.vue'),
			Notion        : () => import('~/components/common/Notion.vue'),
		},
		mixins: [
			// IntersectionCooler
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
					Stylistics: {
						title: 'Фирменный стиль и айдентика',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: {
							body: 'Jugendlich ihr seh im träne freundschaft kommt was mir, vor busen erste lispelnd denen. Neu guten nennt hinweggeschwunden ernsten, mir weich mild lieb sich, was sich die guten klage unbestimmten ich neu. Busen lebens froher seelen festzuhalten ihr, besitze noch herz die herzen zerstoben ihr.',
						},
						link: {
							path: '/service',
							name: 'К услугам'
						}
					},
					Works: {
						title: 'Последние выполненные заказы',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: {
							body: 'Не все представленные работы выше могут являться полноценными или принятыми заказами, и так же могут содержать работы которые являются лишь простыми работами "в ящик" которые оставляются на усмотрение'
						},
						link: {
							path: '/portfolio',
							name: 'Перейти к портфолио'
						}	
					},
					Gallery: {
						title: 'Фирменный стиль и айдентика',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: {
							body: 'Die  zu sage gut wiederholt den zug aus, strenge herzen herzen was sich verschwand und. Was lauf mir froher hören gestalten sage an ich, stillen vom strenge um euch bang wohl tage. Der wirklichkeiten wirklichkeiten schatten mild, nicht sonst es ihr einer lebens, strenge die zug jenem kommt sage getäuscht halbverklungnen was, es beifall mir nun glück alten lispelnd...'
						},
						link: {
							path: '/service',
							name: 'К услугам'
						}
					},
					Adaptation: {
						title: 'Адаптивная вёрстка для ваших сайтов',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: {
							body: 'Wiederholt sang lispelnd nach trüben meinem ihr um liebe längst zerstreuet, lied blick vom zu bilder. Nun labyrinthisch aus mein bilder ihr lauf folgt. Äolsharfe mein bang ernsten nach seelen wenn wird busen, der es wohl steigen wirklichkeiten vor euch mich sich erste, was welt euch lauf geneigt wirklichkeiten, weiten der in ein die folgenden schmerz der nebel. Nun und.',
							about: 'https://vc.ru/design/166963-chto-takoe-adaptivnyy-dizayn-i-pochemu-adaptivnaya-verstka-sayta-dorozhe',
						},
						link: {
							path: '/portfolio',
							name: 'Перейти к портфолио'
						}	
					}
				} as {[T in MODULES]: CONTENT} 
			};
		},
		computed: {
			moduleContent(): CONTENT {
				return this.PromoContent[this.PromoType];
			}
		},
		mounted() {
			// this.initCooler(this.$el, (cooled: boolean) => { this.Cooled = cooled })
		},
		methods: {
			routeTo(path: string) {
				this.$router.push({ path });
			}
		}
	});

</script>
