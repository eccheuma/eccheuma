<template>
  <footer class="footer-container" :class="[{ 'utils::cooled-sections': Cooled }]">

		<section class="footer-social">
			<h5>Социальные сети</h5>
			<hr>
			<template v-for="(item, index) in Links.Social">
				<a :key="`link-social-${ index }`" :href="item.link">
					<icon :name="item.icon" /> {{ item.content }}
				</a>
			</template>
		</section>

		<section class="footer-freelance">
			<h5>Фриланс Биржи</h5>
			<hr>
			<template v-for="(item, index) in Links.Freelance">
				<a :key="`link-freelance-${ index }`" :href="item.link">
					<icon :name="item.icon" /> {{ item.content }}
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

		<section class="footer-info pattern_bg">
			
			<SearchBar v-if="!$isMobile" />

			<section class="footer-info-contacts">
				<span>Электронная почта</span>
				<span>Ryoova@yandex.ru</span>
			</section>

			<section v-if="!$isMobile" class="footer-info-power_by">
				<i class="fab fa-vuejs" />
				<span>Работает на костях Vue and Nuxt</span>
			</section>

		</section>

		<section class="footer-pit">
			<div class="footer-pit-text">
				<span>Eccheuma</span>
				<span>Ryova Graphical & Web Design</span>
			</div>
			<div class="footer-pit-logo">
				<svg v-if="!$isMobile" ref="LOGO_SVG" fill="rgb(var(--color-mono-300))" viewBox="0 0 157 24">
					<path
						ref="LOGO_PATH"
						d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
						stroke="none"
					/>
				</svg>
			</div>
			<div class="footer-pit-version">
				<span>ВЕРСИЯ СБОРКИ: {{ BUILD_HASH || '000000' }}</span>
			</div>
		</section>

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

		display: grid; 
		padding: 5vh 5vw 0px; 
		row-gap: 2vh;
		column-gap: 1vw;

		grid-template: {
			columns: 1fr 1fr 2fr;
			rows: 20vh auto 10vh;
			areas: 	"social freelance about"
							"info 	info 			info "
							"pit		pit				pit  "
		}

		@media screen and ( max-width: $mobile-breakpoint ) {

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

		background-color: rgb(var(--color-mono-200)); min-height: 10vh;

		h5 { 
			display: block; 
			text-align: left; 
			color: rgb(var(--color-mono-800));
			font: {
				size: var(--font-size-36);
				family: var(--decor-font);
			}

			letter-spacing: .25ch;

		}

		hr {
			background-color: rgb(var(--color-mono-400));
		}

		a {

			display: flex;
			align-items: center;
			gap: 4px;

			color: rgb(var(--color-mono-800));
			font-weight: 600;
			font-size: var(--font-size-14);
			line-height: 3vh;

			transition-duration: 0.25s;

			text-decoration: underline;

			i {
				margin: unset !important;
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
			width: 30ch; 
			display: inline-flex; 
			padding: 0 10px; 
			margin: 5px 0;

			border: {
				left: 1px solid rgb(var(--color-mono-500))
			}
		}
	}
	&-info {

		@include gradient_border(block);

		@include section_position($area: info);

		margin: 	0vh -5vw;
		padding: 	4vh 5vw;
		background-color: rgb(var(--color-mono-300));

		display: grid;
		grid-template: {
			columns: 1fr 3fr 1fr
		}

		@media screen and ( max-width: $mobile-breakpoint ) {
			
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
				&:nth-of-type(1) {
					color: rgb(var(--color-mono-700));
					font: {
						size: var(--font-size-18);
						weight: 500;
					}
				}
				&:nth-of-type(2) {
					color: rgb(var(--color-mono-600));
					font: {
						size: var(--font-size-16);
						weight: 700;
					}
				}
			}
		}

		&-power_by {
			color: rgb(var(--color-mono-700));
			display: flex;
			justify-content: center;
			span {
				margin: auto 1vw;
				font: {
					size: var(--font-size-12);
					weight: 700;
				}
			}
		}

	}
	&-pit {

		@include section_position($area: pit);

		align-content: center;

		display: grid;
		grid-template: {
			columns: 1fr 1fr 1fr
		}

		&-text {
			span {

				display: block; 
				text-transform: uppercase;

				&:nth-child(1) {
					color: rgb(var(--color-mono-400));
					font-weight: 500;
					letter-spacing: .25ch;
					font-size: var(--font-size-36);
					font-family: var(--decor-font);
					line-height: var(--size-36);
				}

				&:nth-child(2) {
					color: rgb(var(--color-mono-400)); font-weight: 700; letter-spacing: 1px; font-size: .45rem
				}

			}
		}
		&-logo {
			display: flex;
			svg {
				margin: auto;
				height: 3vh;
			}
		}
		&-version {
			display: flex;
			justify-content: flex-end;
			span {
				align-self: center;
				color: rgb(var(--color-mono-400));
				letter-spacing: .25ch;
				font-size: var(--font-size-12);
				font-weight: 900;
			}
		}
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// COMPONENTS
	import SearchBar from '~/components/common/SearchBar.vue'
	import Icon									from '~/components/Icon.vue'

	// MIXINS
	import IntersectionCooler from '~/assets/mixins/IntersectionCooler'

	// TYPES
	type LINK = {
		link: 			string
		content: 		string 
		icon?: string
		ext?: 'PDF' | 'TXT'
	}

	type FOOTER_SECTIONS = 'Social' | 'Freelance' | 'About'
	
	// MODULE
	export default Vue.extend({
		components: { SearchBar, Icon },
		mixins: [ IntersectionCooler ],
		data() {
			return {

				Cooled: !process.browser,

				Links: {
					Social: [
						{ icon: 'VK', content: 'Группа в ВКонтакте', link: 'http://vk.com/club158755478' },
						// { iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'vk.com/club158755478' },
						// { iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'vk.com/club158755478' },
					],
					Freelance: [
						// { iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
						// { iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
						// { iconClass: 'fab fa-vk', content: 'ВКонтакте', link: 'behance.net/Ryova' },
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
