<template>
	<div class="CMS">
		<div class="container">
			<div class="row p-4 justify-content-center">

				<div class="col-8">
					<vue-image
						:content="ImageProperty.content" 
						:sections="{ date: false, description: true, zoom: false }" 
						:property="{ fit: 'cover', type: 'promo', collumn: ImageProperty.property.collumn }">

						{{ ImageProperty.content.description }}

					</vue-image>
				</div>

				

			</div>
			<div class="row CMS-Input justify-content-center">
				<div class="col-10">
					<div class="row">
						<div class="col-3 CMS-Input_Section">
							<span>Ссылка на изображение</span>
						</div>
						<div class="col">
							<input v-model="ImageProperty.content.path" type="text">
						</div>
					</div>
					<!-- <div class="row">
						<div class="col-3 CMS-Input_Section">
							<span>Размер: {{ ImageProperty.property.collumn }} col</span>
						</div>
						<div class="col">
							<input v-model.number="ImageProperty.property.collumn" type="range" step="1" max="12" min="3">
						</div>
					</div> -->
					<div class="row">
						<div class="col-3 CMS-Input_Section">
							<span>Заголовок</span>
						</div>
						<div class="col">
							<input v-model="ImageProperty.content.title" type="text">
						</div>
					</div>
					<div class="row">
						<div class="col-3 CMS-Input_Section">
							<span>Описание</span>
						</div>
						<div class="col">
							<input v-model="ImageProperty.content.description" type="text">
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<button @click="SendImage">Отправить</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapActions } from 'vuex'

	// TYPES 
		import type { IMAGE_PROPERTY } from '~/types/Image.ts'

	// COMPONENTS
		import VueImage from '~/components/common/ImageComponent/Image.vue'

	// MODULE
	export default Vue.extend({
		components: {
			VueImage
		},
		data() {
			return {

				ImageProperty: {

					content: {
						path: 'Other/1',
						title: 'TEST',
						description: 'TEST'
					} as IMAGE_PROPERTY['content'],

					property: {
						collumn: 8
					} as IMAGE_PROPERTY['property'],

				}
			}
		},
		methods: {
			...mapActions({
				GallerySetImage: 'AdminPanel/NewGalleryImage/GallerySetImage'
			}),
			SendImage() {

				const content: { content: IMAGE_PROPERTY['content'], property: IMAGE_PROPERTY['property']  } = {
					content: {...this.ImageProperty.content, date: Date.now() },
					property: this.ImageProperty.property
				}

				// console.log( content )

				this.GallerySetImage(content)

			}
		},
		filters: {
			ColSizeFilter(value: number) {

				if ( value == 13 ) {
					return 'lg'
				}
				
				return value
				
			}
		}
	})

</script>

<style lang="sass">

.image_wrap_CMS
	margin: 0px 2px
	height: 260px
	&_template
		margin: 0px 2px
		height: 260px
		background-color: $color1
		border-radius: .7rem

.CMS
	position: relative
	width: 100%
	select
		width: 100%
		margin: 4px 0px
		display: inline-bl
		padding: 10px 15px
		background-color: $color2
		border: 1px solid rgba($color1,.25)
		border-radius: .7rem
		color: $color4
		font-weight: 700
		font-size: 14px
	textarea
		width: 100%
		height: 40px
		overflow: hidden
		resize: none
		padding: 10px 15px
		background-color: $color5
		border: 1px solid rgba($color1,.25)
		border-radius: .7rem
		color: $color1
		font-size: 12px
	button
		display: block
		width: 70%
		margin: 20px 15% 10px
		font-size: 12px
		padding: 6px 0px
		@extend %button_light
	&-ImageInfo
		color: $color5
		margin: auto 0
		span
			display: block
			strong
				display: block
	&-ImagePreview
		background-color: $color2
		border-radius: .7rem 
		padding: 10px 4px
		display: block
		width: 100%
		height: 280px
	&-Input
		background-color: rgba($color2, .5)
		&_Section
			margin-bottom: 10px
			padding: 10px 0
			border-right: 1px solid $color3
		span
			padding: 4px 0
			color: $color5
			font-weight: 700
			font-size: .8rem
			width: 200px
		input
			width: 100%
			height: 40px
			padding: 4px 20px
			overflow: hidden
			background-color: $color2
			color: $color4
			text-align: center
			font-size: .8rem
			font-weight: 700
			border: 1px solid $color3
			border-radius: .7rem
			-webkit-appearance: none
			&:focus
				outline: none
			&::-webkit-slider-thumb
				-webkit-appearance: none
				height: calc(100% - 4px)
				margin: 2px 0
				width: 9px
				border-radius: .7rem
				background-color: $color4
				cursor: pointer
				transition-duration: .5s
				&:hover
					background-color: $color5
			&::-webkit-slider-runnable-track
				margin: 0 15px
				width: 100%
				height: 30px
				cursor: pointer
				transition-duration: .5s
				&:hover
					height: 30px

</style>