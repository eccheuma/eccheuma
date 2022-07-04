<template>

	<section ref="content" class="post-content-body">

		<template v-for="(item, index) in source" >

			<template v-if="item && item.tag === 'img'">
				<eccheuma-image 
					:key="index"
					:class="{ EditableBlock: editableBlock == index }"
					:content="{ path: item.value.url, description: item.value.alt }" 
					:sections="{ date: false, description: false, zoom: true }" 
					:property="{ type: 'default' }"
					>
					{{ item.value.alt }}
				</eccheuma-image>
			</template>

			<section :key="index" v-else-if="item && item.tag === 'code'" class="post-content-body-code">
				<span>Синтаксис: {{ item.value.lang }}</span>
				<code 
					v-html="prismHighlight(item.value.data, item.value.lang)"
				/>
			</section>

			<component v-else-if="item && item.tag === 'a'" :is="item.tag" :href="item.value.url" :key="index + item.tag">
				<icon name="Link" /> {{ item.value.alt }}
			</component>

			<component v-else :is="item && item.tag || 'div'" :key="`section-${ index }`">
				{{ item.value }}
			</component>

		</template>
	</section>

</template>

<style lang="scss">

.post-content {

	&-body {

		padding: 5vh 0vw;

		color: rgb(var(--color-mono-900));
		font-family: var(--read-font);

		border-top: 1px solid rgb(var(--color-mono-300));

		iframe {
			overflow: hidden;
			border-radius: var(--border-radius);
			margin: 40px 20px;
			max-width: 95%;
			min-height: 420px;
		}

		hr {
			height: 1px;
		}

		blockquote {

			font: {
				style: italic;
				size: 14px;
				weight: 500;
			}

			background-color: rgba(var(--color-mono-300));
			margin: 30px 0;
			padding: 20px 30px;
			border-left: 3px solid rgb(var(--color-mono-400));

		}

		p {
			font-size: var(--font-size-21);
			font-weight: 300;
			width: clamp(35ch, 75ch, 100%);
			line-height: var(--font-size-28);
			color: rgb(var(--color-mono-600));
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

		a {

			--color: var(--color-accent-notice);

			color: var(--color);
			display: inline-flex;
    	align-items: flex-end;

			i {
				fill: var(--color); 
			}

		}

		&-code {

			background: rgb(var(--color-mono-300));
			border: 1px solid var(--color-accent-edges-100);
			border-radius: var(--border-radius);
      
			padding: 1vh 1vw 2vh .5vw;
			margin: 2vh 0;
      
			code {
				display: block;
				white-space: pre-wrap;
				tab-size: 3ch;
				font-size: 12px;
			}

			> span {
				display: block;
				text-align: right;
				color: rgb(var(--color-mono-500));
				font-family: var(--decor-font);
				font-size: var(--font-size-24);
				margin-bottom: -3vh;
			}

			.function {
				color: var(--color-accent-edges-300);
			}

			.keyword {
				color: var(--color-accent-edges-200);
			}

			.operator {
				color: rgb(var(--color-mono-600));
			}

			.string {
				color: rgb(var(--color-mono-600));
			}

		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// PRISM
	import Prism 		from 'prismjs';

	// TYPES
	import type { Post } from '~/types/Post'

	// COMPONENTS
	import Icon from '~/components/common/Icon.vue'

	// MODULE
  export default Vue.extend({
		components: {
			Icon,
			EccheumaImage: () => import('~/components/image/Image.vue'),
		},
		props: {
			source: {
				type: Array,
				required: true
			} as PropOptions<Array<Post.content>>,
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
			},

			prismHighlight(code: string, lang: string) {

				const res = Prism.highlight(code, Prism.languages.javascript, 'javascript');

				return res;

			},

		}
  })

</script>

<style lang="scss">

.EditableBlock {
	padding: 30px 10px !important;
	background-color: #F2F8FA !important;
}

</style>
