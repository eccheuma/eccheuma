<template>
  <footer class="footer-container" :class="[{ cooled_sections: Cooled }]">

		<section class="footer-social">
			<h5>Социальные сети</h5>
			<hr>
			<template v-for="(item, index) in Links.Social">
				<a :key="`link-social-${ index }`" :href="item.link">
					<i :class="item.iconClass" /> {{ item.content }}
				</a>
			</template>
		</section>

		<section class="footer-freelance">
			<h5>Фриланс Биржи</h5>
			<hr>
			<template v-for="(item, index) in Links.Freelance">
				<a :key="`link-freelance-${ index }`" :href="item.link">
					<i :class="item.iconClass" /> {{ item.content }}
				</a>
			</template>
		</section>

		<section class="footer-about">
			<h5>Информация для клиента</h5>
			<hr>
			<template v-for="(item, index) in Links.About">
				<a :key="`link-${ index }`" :href="item.link">
					{{ item.content }} | {{ item.ext }}
				</a>
			</template>
		</section>

		<section class="footer-info">
			
			<SearchBar v-if="!$isMobile" />

			<section class="footer-info-contacts">
				<span>Электронная почта</span>
				<span>Ryoova@yandex.ru</span>
			</section>

			<section v-if="!$isMobile" class="footer-info-power_by">
				<i class="fab fa-vuejs" />
				<span>Powered by vue and nuxt</span>
			</section>

		</section>

		<section class="footer-pit" />

	</footer>
</template>

<style lang="scss">

@mixin section_position($area: block) {
	grid: { 
		row: 		$area; 
		column: $area; 
	}
}

.footer {
	&-container {

		@include gradient_border(top);

		display: grid; padding: 5vh 5vw; gap: 30px;
		grid-template: {
			columns: repeat(5, 1fr);
			rows: 20vh 4vh 6vh;
			areas: 	"social freelance about about about"
							"info 	info 			info 	info 	info"
							"pit		pit				pit		pit		pit"
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {

			grid-template: {
				columns: 1fr;
				rows: auto auto auto auto 2vh;
				areas: 	"social"
								"freelance"
								"about"
								"info"
								"pit"
			}
		}

		background-color: rgb(var(--color-1)); min-height: 10vh;

		h5 { 
			display: block; text-align: center; color: rgb(var(--color-6));
			font: {
				size: 1rem;
				weight: 600;
			}
		}

		hr {
			background-color: rgb(var(--color-3));
		}

		a {
			display: block; color: rgb(var(--color-6));
			font: {
				weight: 600;
				size: var(--font-size-4);
			}
			opacity: .5;
			line-height: 3vh;
			transition-duration: .25s;
			i {
				margin: { right: 5px }
			}
			&:hover {
				opacity: 1;
				text-decoration: none;
			}
		}

	}
	&-social {

		@include section_position($area: social);

	}
	&-freelance {

		@include section_position($area: freelance);

	}
	&-about {

		@include section_position($area: about);

		a {
			width: 30ch; display: inline-flex; padding: 0 10px; margin: 5px 0;
			border: {
				left: 1px solid rgb(var(--color-4))
			}
		}
	}
	&-info {

		@include gradient_border(both);

		@include section_position($area: info);

		margin: 	0vh -5vw;
		padding: 	2vh 5vw;
		background-color: rgb(var(--color-2));

		display: grid;
		grid-template: {
			columns: 1fr 3fr 1fr
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {
			
			padding: 5vh 25vw;

			row-gap: 5vh;

			grid-template: {
				columns: 1fr
			}
		}

		align-self: center;

		&-contacts {
			span {
				display: block;
				text-align: center;
				font-weight: 700;
				&:nth-of-type(1) {
					color: rgb(var(--color-4));
					font: {
						size: 12px;
					}
				}
				&:nth-of-type(2) {
					color: rgb(var(--color-3));
					font: {
						size: 10px;
					}
				}
			}
		}

		&-power_by {
			color: rgb(var(--color-3));
			display: flex;
			justify-content: center;
			i {
				font: {
					size: 5vh
				}
			}
			span {
				margin: auto 1vw;
				font: {
					size: var(--font-size-4);
					weight: 700;
				}
			}
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// COMPONENTS
	import SearchBar from '~/components/common/SearchBar.vue'

	// MIXINS
	import IntersectionCooler 	from '~/assets/mixins/IntersectionCooler.ts'

	// TYPES
	type LINK = {
		link: 			string
		content: 		string 
		iconClass?: string
		ext?: 'PDF' | 'TXT'
	}

	type FOOTER_SECTIONS = 'Social' | 'Freelance' | 'About'
	
	export default Vue.extend({
		components: { SearchBar },
		mixins: [ IntersectionCooler ],
		data() {
			return {

				Cooled: !process.browser,

				Links: {
					Social: [
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'vk.com/club158755478' },
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'vk.com/club158755478' },
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'vk.com/club158755478' },
					],
					Freelance: [
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
						{ iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
					],
					About: [
						{ 
							content: 'Политика ценообразования и вопросы оплаты.', 
							link: '/', 
							ext: 'PDF' 
						},
						{ 
							content: 'О сроках, просрочках, внесение правок.', 
							link: '/', 
							ext: 'PDF' 
						},
						{ 
							content: 'Сотрудничество, и общие работы.', 
							link: '/', 
							ext: 'PDF' 
						},
					]
				} as {[K in FOOTER_SECTIONS]: LINK[]}

			}
		},
		mounted() {

			this.initCooler(this.$el, (cooled: boolean) => { this.Cooled = cooled })

		}
	})

</script>
