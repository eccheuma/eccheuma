<template>

	<section ref="content" class="post-content-body">

		<template v-for="(item, index) in source">

			<template v-if="item.type === 'img'">
				<vue-image 
					:key="index"
					:class="{ EditableBlock: editableBlock == index }"
					:content="item.value" 
					:sections="{ date: false, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'promo', collumn: 10 }"
					>
					{{ item.value.description }}
				</vue-image>
			</template>

			<template v-else>
				<component :is="item.type" :key="`section-${ index }`" :class="{ EditableBlock: editableBlock == index }">
					{{ item.value }}
				</component>
			</template>

		</template>
	</section>

</template>

<style lang="scss">

.post-content {
	&-body {

		padding: 5vh 0vw;

		color: rgb(var(--color-mono-900));
		font-family: var(--read-font);

		iframe {
			overflow: hidden;
			border-radius: var(--border-radius);
			margin: 40px 20px;
			max-width: 95%;
			min-height: 420px;
		}

		hr {
			height: 100%
		}

		blockquote {

			font: {
				style: italic;
				size: 14px;
				weight: 500;
			}

			background-color: rgba(var(--color-mono-200),.15);
			margin: 30px 0;
			padding: 20px 30px;
			border-left: 3px solid rgb(var(--color-mono-400));

		}

		// img {
		// 	display: inline-block
		// 	overflow: hidden
		// 	border-radius: .7rem
		// 	border: 1px solid rgba(var(--color-mono-500),.25)
		// 	margin: 40px 10px
		// 	width: 100%
		// 	max-height: 420px	
		// }

		p {
			font-size: var(--font-size-20);
			font-weight: 500;
			line-height: 1.4rem;
			width: clamp(35ch, 75ch, 100%);

			// // Mobile
			// @media screen and ( max-width: $mobile-breakpoint ) {
			// 	width: $GLOBAL-BodySize;
			// }

		}

		h5 {

			display: block;
			position: relative;

			padding: { bottom: 20px }

			font: {
				size: var(--font-size-36);
				weight: 700;
			}

			&:before {

				content: "";

				background: {
					color: rgba(var(--color-mono-500), .25);
				}

				position: absolute;

				top: 45px; left: 0;
				width: 60%; height: 1px;

				margin: 0;

			}
		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// TYPES
	import type { POST_CONTENT } from '~/typescript/Post'

	// MODULE
  export default Vue.extend({
		components: {
			VueImage: () => import('~/components/image/Image.vue'),
		},
		props: {
			source: {
				type: Array,
				required: true
			} as PropOptions<POST_CONTENT[]>,
			editorMode: {
				required: false,
				type: Boolean,
				default: false
			} as PropOptions<boolean>,
			editableBlock: {
				required: false,
				type: Number,
				default: null
			} as PropOptions<number>
		},
		data() {
			return {
				PickedBlock: null 
			}
		},
		mounted() {
			
			if ( this.editorMode ) {

				const WRAP_NODE = this.$refs.content as Element

				WRAP_NODE.childNodes.forEach((node, i) => {
					node.addEventListener('dblclick', () => this.PickBlock(i))
				})

			}

		},
		methods: {
			PickBlock(index: number = 0) {
				this.$emit('curent-block', index )
			}
		}
  })

</script>

<style lang="scss">

.EditableBlock {
	padding: 30px 10px !important;
	background-color: #F2F8FA !important;
}

</style>
