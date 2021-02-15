<template>
	
	<div class="col-12">
		<div class="row no-gutters post_body_content_wrap" @dblclick="PickBlock(index)" :class="{ EditableBlock: EditableBlock == index }"
			v-for="(item, index) in source" 
			:key="index" 
			:style="`order: ${index}`">
				<!-- / Заголовок -->
				<template v-if="item.type === `h5`" >
					<h5
						class="col-12">{{ item.value }}
					</h5>
				</template>
				<!-- / Параграф -->
				<template v-if="item.type === `p`" >
					<p
						class="col-12">{{ item.value }}
					</p>
				</template>
				<!-- Цитата -->
				<template v-if="item.type === `blockquote`">
					<blockquote>
						{{ item.value }}
					</blockquote>
				</template>
				<!-- / Изоборажения-->
				<template v-if="item.type === `img`">

					<vue-image class="mx-auto my-2"
						:content="item.value" 
						:sections="{ date: false, description: true, zoom: true }" 
						:property="{ fit: 'cover', type: 'promo', collumn: 10 }">
						{{ item.value.description  }}
					</vue-image>

				</template>
				<!-- / Список -->
				<!-- <template v-if="item.type === `ul`">
					<ul>
						<li v-for="prop in item.ul" :key="prop.id" > 
							{{ prop.prop }}
						</li>
					</ul>
				</template> -->
				<!-- /	 Разделитель-->
				<hr v-if="item.type === `hr`" class="col-12">
		</div>
	</div>

</template>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// TYPES
	import type { POST_CONTENT } from '~/types/Post'

	// MODULE
  export default Vue.extend({
		props: {
			source: {
				required: true
			} as PropOptions<POST_CONTENT[]>,
			Editor: {
				default: false
			} as PropOptions<boolean>,
			EditableBlock: {
				default: null
			} as PropOptions<number>
		},
		components: {
			VueImage: () => import('~/components/common/ImageComponent/Image.vue'),
		},
		data() {
			return {
				PickedBlock: null 
			}
		},
		methods: {
			PickBlock(index: number) {
				if( this.Editor ) {
					this.$emit('curent-block', index )
				}
			}
		}
  })

</script>

<style lang="sass" scoped>

.EditableBlock
	padding: 30px 10px !important
	background-color: #F2F8FA !important

.post_body_content
	&_wrap
		transition-duration: .5s
		font-family: $second-font
		>iframe
			overflow: hidden
			border-radius: .7rem
			margin: 40px 20px
			max-width: 95%
			min-height: 420px
			// max-height: 420px
		>hr
			height: 100%
			// margin: 40px 0px
		>ul
			// background-color: rgba($color1,.15)
			padding: 20px 50px
			li
				padding-right: 40%
				margin: 0px 0px 10px
				font-size: 12px
				font-weight: 500
				color: $color3	
		>blockquote
			// font-style: italic
			font-size: 14px
			font-weight: 500
			color: $color2
			background-color: rgba($color1,.15)
			margin: 30px 0
			padding: 20px 30px
			border-left: 3px solid $color3
		>img
			display: inline-block
			overflow: hidden
			border-radius: .7rem
			border: 1px solid rgba($color4,.25)
			margin: 40px 10px
			width: 100%
			max-height: 420px	
		>p
			white-space: pre-wrap
			margin: 20px 0px 0px
			padding-right: 20% !important
			font-size: .9rem
			font-weight: 500
			color: #000000
			line-height: 1.4rem
			color: $color2
		>h5
			display: block
			text-align: left
			margin: 40px 0% 20px
			font-size: 1.3rem
			font-weight: 600
			color: $color3
			padding: 0px 0px 20px
			&:before
				content: ""
				background-color: rgba($color4, .25)
				position: absolute
				top: 45px
				left: 0
				width: 60%
				margin: 0
				height: 1px

</style>