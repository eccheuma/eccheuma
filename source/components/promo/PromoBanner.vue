<template>
	<div class="promo_container" :class="`order-${ order }`">

		<template v-if="CurentType">
			<section class="promo_header">
				<h4>{{ CurentType.title }}</h4> 
				<p>{{ CurentType.subtitle }}</p>
			</section>

			<component :is="PromoType"></component>

			<section class="promo_footer">
				
				<client-only>
					<p v-if="CLIENT_RENDER_CHECK && !$isMobile">{{ CurentType.footer}}</p>
				</client-only>

				<hr>

				<nuxt-link :to="CurentType.link.path" tag="button">
					{{ CurentType.link.name }}
				</nuxt-link>

			</section>

		</template>

	</div>
</template>
 
<style lang="scss">

.promo_container_slider {
	padding: 4px 15px;
}

.promo {
	&_container {
		display: grid; padding: 3vh 0;
		grid-template-columns: 1fr;
		background-color: $color1;
		> section {
			padding: 3vh 2vw
		}
	}
	&_header {
		h4 {
			font-weight: 600;
			width: 100%;
			font-size: $FontSize1;
		}
		p {
			font-weight: 500;
			font-size: $FontSize3;
			width: calc(min(100%, 70ch));
			color: $color4;
		}
		@media screen and ( max-width: $MobileBreakPoint ) {
			text-align: center !important;
		}
	}
	&_footer {
		display: grid;
		grid-template-columns: 1fr;
		p {
			font-size: 12px;
			font-weight: 700;
			// margin-bottom: 30px;
			padding: 0 5vw;
			color: $color4;
		}
		hr {
			background-color: $color4;
			width: 50%;
			height: .5px;
			border-top: unset;
		}
		button {
			@include light-button { width: 25%; justify-self: center; margin-top: 15px; }
		}
	}
}
	

</style>

<script>

	export default {
		props: [ 'PromoType', 'order' ],
		components: {
			Works: () => import  ( './_Works.vue' ),
			Style: () => import  ( './_Style.vue' ),
			Gallery: () => import  ( './_Gallery.vue' ),
			Adaptation: () => import  ( './_Adaptation.vue' ),
		},
		computed: {
			CurentType() {
				return this.PromoContent[this.PromoType]
			}
		},
		data() {
			return {
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
				} 
			}
		},
	};

</script>