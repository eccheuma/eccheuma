<template>
  <footer class="footer-container">

		<section class="footer-social">
			<h5>Социальные сети</h5>
			<hr>
			<template v-for="(item, index) in Links.Social">
				<a :href="item.link" :key="`link-social-${ index }`">
					<i :class="item.iconClass"></i> {{ item.content }}
				</a>
			</template>
		</section>

		<section class="footer-freelance">
			<h5>Фриланс Биржи</h5>
			<hr>
			<template v-for="(item, index) in Links.Freelance">
				<a :href="item.link" :key="`link-freelance-${ index }`">
					<i :class="item.iconClass"></i> {{ item.content }}
				</a>
			</template>
		</section>

		<section class="footer-about">
			<h5>Информация для клиента</h5>
			<hr>
			<template v-for="(item, index) in Links.About">
				<a :href="item.link" :key="`link-${ index }`">
					{{ item.content }} | {{ item.ext }}
				</a>
			</template>
		</section>

		<section class="footer-info">
			
			<SearchBar></SearchBar>

			<section class="footer-info-contacts">
				<span>Электронная почта</span>
				<span>Ryoova@yandex.ru</span>
			</section>

			<section class="footer-info-power_by">
				<i class="fab fa-vuejs"></i>
				<span>Powered by vue and nuxt</span>
			</section>

		</section>

		<section class="footer-pit"></section>

	</footer>
</template>

<style lang="scss" scoped>

@mixin section_position($area: block) {
	grid: { 
		row: 		$area; 
		column: $area; 
	}
}

h5 { 
	display: block; text-align: center; color: $color5;
	font: {
		size: 1rem;
		weight: 600;
	}
}

hr {
	background-color: $color3;
}

a {
	display: block; color: $color5;
	font: {
		weight: 600;
		size: $FontSize4;
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

.footer {
	&-container {

		@include gradient_border(top);

		display: grid; padding: 5vh 5vw; gap: 30px;
		grid-template: {
			columns: repeat(5, 1fr);
			row: 3fr 1fr 1fr;
			areas: 	"social freelance about about about"
							"info 	info 			info 	info 	info"
							"pit		pit				pit		pit		pit"
		}

		@media screen and ( max-width: $MobileBreakPoint ) {

			grid-template: {
				columns: 1fr;
				areas: 	"social"
								"freelance"
								"about"
								"info"
								"pit"
			}
		}

		background-color: $color1; min-height: 10vh;

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
				left: 1px solid $color4
			}
		}
	}
	&-info {

		@include gradient_border(both);

		@include section_position($area: info);

		margin: 	0vh -5vw;
		padding: 	2vh 5vw;
		background-color: $color2;

		display: grid;
		grid-template: {
			columns: 1fr 3fr 1fr
		}

		@media screen and ( max-width: $MobileBreakPoint ) {
			
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
					color: $color4;
					font: {
						size: 12px;
					}
				}
				&:nth-of-type(2) {
					color: $color3;
					font: {
						size: 10px;
					}
				}
			}
		}

		&-power_by {
			color: $color3;
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
					size: $FontSize4;
					weight: 700;
				}
			}
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import SearchBar from '~/components/common/SearchBar.vue'

	type LINK = {
		link: 			string
		content: 		string 
		iconClass?: string
		ext?: 'PDF' | 'TXT'
	}

	type FOOTER_SECTIONS = 'Social' | 'Freelance' | 'About'
	
	export default Vue.extend({
		components: { SearchBar },
		data() {
			return {

				Links: {
					Social: [
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "vk.com/club158755478" },
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "vk.com/club158755478" },
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "vk.com/club158755478" },
					],
					Freelance: [
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "behance.net/Ryova" },
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "behance.net/Ryova" },
						{ iconClass: "fab fa-vk", content: "ВКонтакте", link: "behance.net/Ryova" },
					],
					About: [
						{ 
							content: "Политика ценообразования и вопросы оплаты.", 
							link: "/", ext: "PDF" 
						},
						{ 
							content: "О сроках, просрочках, внесение правок.", 
							link: "/", ext: "PDF" 
						},
						{ 
							content: "Сотрудничество, и общие работы.", 
							link: "/", ext: "PDF" 
						},
					]
				} as {[s in FOOTER_SECTIONS]: LINK[]}

			}
		}
	})

</script>