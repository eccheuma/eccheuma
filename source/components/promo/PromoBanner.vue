<template>
	<div class="promo_container">

		<section class="promo_header" :class="{ cooled: Cooled }">
			<h4>{{ moduleContent.title }}</h4> 
			<p>{{ moduleContent.subtitle }}</p>
		</section>

		<keep-alive>
			<component :is="PromoType" v-if="!Cooled" />
		</keep-alive>

		<section class="promo_footer" :class="{ cooled: Cooled }">

			{{ moduleContent.footer }}

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

		padding: 3vh 0;

		display: grid; 

		grid-template: {
			columns: 1fr;
			rows: 20vh 70vh 30vh
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {
			grid-template: {
				columns: 1fr;
				rows: 40vh 140vh 25vh
			}
		}

		background: {
			color: rgb(var(--color-1));
		}

		> section {
			padding: 3vh 2vw;
			display: inline-grid;
			align-content: center;
		}
	}
	&_header {

		align-self: center;

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
		@media screen and ( max-width: var(--mobile-breakpoint)) {
			text-align: center !important;
		}
	}
	&_footer {

		height: 30vh;

		p {
			font-size: 12px;
			font-weight: 700;
			// margin-bottom: 30px;
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
						footer: 'А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.',
						link: {
							path: '/Service',
							name: 'К услугам'
						}
					},
					Works: {
						title: 'Последние выполненные заказы',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.',
						link: {
							path: '/Portfolio',
							name: 'Перейти к портфолио'
						}	
					},
					Gallery: {
						title: 'Фирменный стиль и айдентика',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.',
						link: {
							path: '/Service',
							name: 'К услугам'
						}
					},
					Adaptation: {
						title: 'Последние выполненные заказы',
						subtitle: 'Последние выполненые работы за этот месяц, начиная от логотипов, и заканчивая полновестными макетами сайтов',
						footer: 'А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.',
						link: {
							path: '/Portfolio',
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
