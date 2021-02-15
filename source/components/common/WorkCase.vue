<template>
	<section class="work_case-container">
		<div class="work_case-about">

			<div class="work_case-about-header">
				<h5>{{ content.name }}</h5>
				<span>Срок выполнения: {{ content.time }}</span>
			</div>

			<div class="work_case-about-body">

				<section>
					<h6>Тематика:</h6>
					<span>{{ content.theme }}</span>
				</section> 

				<section>
					<h6>Техническое задание:</h6>
					<span>{{ content.tech_request }}</span>
				</section> 

				<section>
					<h6>Адрес на готовый продукт:</h6>
					<a :href="`https://${ content.link }`">{{ content.link }}</a>
				</section> 

				<section>
					<h6>Стоимость заказа:</h6>
					<span>{{ content.cost }} ₽</span>
				</section>

			</div>

		</div>
		<div class="work_case-content">

			<vue-image v-for="(item, index) in content.images" :key="`IMAGE-${ index }`"
				:class="$isMobile ? '' 
					: !index ? 'main' : 'other'
				"
				:style="$isMobile ? '' 
					: !index ? `grid-column: main / ${ content.images.length }` : ''
				"
				:content="item.content" 
				:sections="{ date: false, description: false, zoom: true }" 
				:property="{ fit: 'cover', type: 'case' }">
				{{ content.name }}
			</vue-image>

		</div>
	</section>
</template>

<style lang="scss">

.work_case {
	&-container {

		max-height: 60vh;

		margin: 1vh 1vw;

		column-gap: 15px;
		row-gap: 15px;

		display: grid;
		grid-template: {
			columns: 1fr 3fr;
			rows: 100%;
		}

		@media screen and ( max-width: $MobileBreakPoint ) {

			max-height: unset;

			grid-template: {
				columns: 1fr;
    		rows: min-content auto;
			}
		}

	}
	&-about {

		row-gap: 15px;

		display: grid;
		grid-template: {
			rows: min-content auto;
		}

		&-header {
			background-color: $color6;
			padding: 20px 0px ;
			border-radius: .7rem;
			text-align: center;
			h5 {
				color: #414141 ;
				font-weight: 700;
			}
			span {
				margin: 0;
				font-size: 10px;
				font-weight: 700;
				color: #737373;
			}
		}
		&-body {

			@media screen and ( max-width: $MobileBreakPoint ) {
				padding-bottom: 100px;
			}

			position: relative;
			background-color: $color6;
			padding: 10px 30px;
			border-radius: .7rem;
			section {
				display: block;
				h6 {
					margin-top: 10px;
					font-size: 14px;
					font-weight: 700;
					color: $color1;
				}
				a {
					display: block;
					font-size: 12px; 
					font-weight: 700;
					color: $color3;
					padding: 6px 15px;
					&:hover {
						color: $color4
					}
					&:empty {
						margin-top: 10px;
						padding: 0;
						height: 25px;
						pointer-events: none;
						&:before {
							padding: 10px 15px;
							content: "Не имеет.";
							font-size: 12px;
							font-weight: 700;
							color: $color4;
						}
					}
				}
				span {
					font-size: 12px;
					font-weight: 700;
					color: $color2;
					padding: 2px 15px;
				}
			}
		}
	}
	&-content {

		background-color: $color2;

		border-radius: .7rem;

		padding: 2vh 10vw;

		row-gap: 1vh;
		column-gap: 1vw;

		display: grid;
		grid-template: {
			rows: 50% 50%;
			areas: 	"main"
							"other"
		}

		@media screen and ( max-width: $MobileBreakPoint ) {

			max-height: unset;

			grid-template: {
				columns: 1fr;
    		rows: unset;
			}
		}

		.main {
			grid-row: main;
		}

		.other {
			grid-row: other;
		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// COMPONENTS
		import VueImage from '~/components/common/ImageComponent/Image.vue'

	// TYPES
		import type { WORKCASE, CONTENT } from '~/types/WorkCase.ts'

	// MODULE
	export default Vue.extend({
		props: {
			content: 		{ required: true  } as PropOptions< CONTENT >,
			properties: { required: true  } as PropOptions< WORKCASE['properties'] >,
		},
		components: {
			VueImage
		},
	})

</script>