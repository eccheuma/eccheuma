<template>
	<div class="col-10 CMS_post-wrapper" @keydown.ctrl.enter="PushBlock" @click.ctrl.left="DeleteBlock">

		<section class="CMS_post-header">
			<div class="row justify-content-center py-4">
				<div class="col-auto">
					<button @click="PreviewMode = true">Превью</button>
				</div>
				<div class="col-auto">
					<button @click="PreviewMode = false">Редактор</button>
				</div>
			</div>
		</section>

		<template v-if="PreviewMode">
			<section class="CMS_post-body-post">
				<div class="row">
					<div class="col-12">
						<keep-alive>
							<Post ID="PREVIEW" key="PREVIEW" :EditContent="true" :payload="PostData" :PostOrder="0">

								<PostContent :source="PostEditableContent"/>

							</Post>
						</keep-alive>
					</div>
				</div>
			</section>
			<section class="CMS_post-body-property">
				<div class="row text-center my-2 pb-2">
					<h5 class="w-100">Параметры поста</h5>
				</div>
				<div class="row px-5">
					<div class="col-6">
						<input type="text" class="text-center py-2 my-1" v-model="PostData.image" 
							placeholder="image">
					</div>
					<div class="col-6">
						<input type="text" class="text-center py-2 my-1" v-model="PostData.title" 
							placeholder="title" >
					</div>
					<div class="col-6">
						<input type="text" class="text-center py-2 my-1" v-model="PostData.description" 
							placeholder="description" >
					</div>
					<div class="col-6">
						<input type="text" class="text-center py-2 my-1" v-model="PostData.tags" 
							placeholder="tags">
					</div>
				</div>
			</section>
			<section class="CMS_post-body-send">
				<div class="row my-3">
					<div class="col-12 text-center">
						<button @click="UploadPost">Отправить</button>
					</div>
				</div>
			</section>
		</template>

		<template v-else>

			<section class="CMS_post-editor">
				<div class="row">
					<div class="col-12">
						<section class="CMS_post-editor-content py-3 px-5 my-2">
							<div class="row">
								<PostContent :Editor="true" :source="PostEditableContent" @curent-block="SetCurentBlock" :EditableBlock="CurentEditableBlock"/>
							</div>
						</section>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-12 my-2 text-center">
						<span>{{ CurentTypeOfContent }}</span>
					</div>
					<div class="col-10 my-2">
						<section class="CMS_post-editor-type">
							<select name="" id="" v-model="CurentTypeOfContent">
								<option value="h5"				>Заголовок		</option>
								<option value="p"					>Парафграф		</option>
								<option value="blockquote">Сноска				</option>
								<option value="img"				>Изображение	</option>
								<option value="ul"				>Список				</option>
								<option value="hr"				>Разделитель	</option>
							</select>
						</section>
					</div>
				</div>
				<div class="row justify-content-center">
					<div class="col-10">
						<section class="CMS_post-editor-property">
							<template v-if="['h5', 'p', 'blockquote'].filter(i => i === CurentTypeOfContent)">
								<textarea class="w-100 p-3" v-model="CurentProperty"></textarea>
							</template>
							<template v-if="CurentTypeOfContent == `img`">
								<div class="row">
									<div class="col-12">
										<input type="text" class="text-center w-100 py-2 my-1" v-model="CurentEditableImage.image" placeholder="image">
									</div>
									<div class="col-12">
										<input type="text" class="text-center w-100 py-2 my-1" v-model="CurentEditableImage.title" placeholder="title">
									</div>
									<div class="col-12">
										<input type="text" class="text-center w-100 py-2 my-1" v-model="CurentEditableImage.description" placeholder="description">
									</div>
								</div>
							</template>
						</section>
					</div>
				</div>
			</section>

		</template>

	</div>
</template>

<style lang="sass" scoped>

.CMS
	&_post
		&-wrapper
			color: rgb(var(--color-6))
			background-color: rgb(var(--color-2))
			min-height: 50vh
		&-header
			button
				display: block
				width: 240px
				font-size: 12px
				padding: 10px 0px
				@extend %button_light
		&-editor
			&-content
				height: 60vh
				overflow-y: scroll
				background-color: rgb(var(--color-6))
				border-radius: .7rem
			&-type
				select
					width: 100%
					margin: 4px 0px
					display: inline-bl
					padding: 10px 15px
					background-color: rgb(var(--color-2))
					border: 1px solid rgb(var(--color-3))
					border-radius: .7rem
					color: rgb(var(--color-4))
					font-weight: 700
					font-size: 14px
			&-property
				input
					background-color: rgb(var(--color-2))
					border: 1px solid rgb(var(--color-3))
					border-radius: .7rem
					color: rgb(var(--color-4))
					font-size: var(--font-size-3)
					font-weight: 600
		&-body
			&-send
				button
					display: block
					width: 240px
					font-size: 12px
					padding: 10px 0px
					@extend %button_light
			&-property
				input
					width: 100%
					overflow: hidden
					background-color: rgb(var(--color-2))
					color: rgb(var(--color-4))
					font-size: var(--font-size-3)
					font-weight: 600
					border: 1px solid rgb(var(--color-3))
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
						background-color: rgb(var(--color-4))
						cursor: pointer
						transition-duration: .5s
						&:hover
							background-color: rgb(var(--color-6))
					&::-webkit-slider-runnable-track
						margin: 0 15px
						width: 100%
						height: 30px
						cursor: pointer
						transition-duration: .5s
						&:hover
							height: 30px

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

		// COMPONENTS
	import Post 				from '~/components/post/Post.vue'
	import PostContent 	from '~/components/post/PostContent.vue'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES
	import type { POST, POST_CONTENT } 	from '~/types/Post.ts'
	import type { IMAGE_PROPERTY } 			from '~/types/Image.ts'

	// BLOCK TYPES
	type BLOCK_TYPES = 'h5' | 'p' | 'blockquote' | 'img' | 'ul' | 'hr'

	// MODULE
	export default Vue.extend({
		data() {
			return {

				PostsQuantity: 0,
				
				PreviewMode: true,

				CurentEditableBlock: 	null 	as number | null,
				CurentTypeOfContent: 	'' 		as BLOCK_TYPES,
				CurentProperty: 			'' 		as string,

				CurentEditableImage: {
					path: 				'',
					title: 				'',
					description: 	'',
				} as IMAGE_PROPERTY['content'],

				PostData: {
					ID: 0,
					authorID: 'tGOrAx0PyvWmxQ64gYcUxn3roNB3',
					title: 'Faust',
					description: 'Neu wie kommt an ist ertönt.',
					image: 'Other/1',
					tags: '#TEST',
					date: Date.now(),
				} as POST,

				PostEditableContent: [
					{ type: 'h5', value: "TEST" },
					{ type: 'h5', value: "TESD" },
					{ type: 'h5', value: "TESA" },
				] as POST_CONTENT[]

			}
		},
		components: {
			Post,
			PostContent,
		},
		computed: {
			...mapState({
				LocalTime: state => ( state as VuexModules ).LocalTime,
				UserState: state => ( state as VuexModules ).User.State.UserState
			})
		},
		methods: {

			SetCurentBlock(index: number) {

				if ( this.CurentEditableBlock == index ) {
					this.CurentEditableBlock = null
				} else {
					this.CurentEditableBlock = index
				}

			},

			DeleteBlock() {
				if ( this.CurentEditableBlock != null ) {

					const AR = [ ...this.PostEditableContent ]
	
					const SA = AR.slice( 0, this.CurentEditableBlock )
					const EA = AR.slice( this.CurentEditableBlock + 1, AR.length )
	
					this.PostEditableContent = [...SA, ...EA]; this.CurentEditableBlock = null

				}
			},

			PushBlock() {

				const VALUE = () => {
					switch ( this.CurentTypeOfContent ) {

						case 'img': return { 
							path: 				this.CurentEditableImage.path,
							title: 				this.CurentEditableImage.title,
							description:	this.CurentEditableImage.description,
						}			

						default: return this.CurentProperty;

					}
				}

				if ( this.CurentEditableBlock != null ) { 

					console.log(`EDIT`)

					this.PostEditableContent[ this.CurentEditableBlock ] = {
						type: this.CurentTypeOfContent, 
						value: VALUE()
					}

					this.CurentEditableBlock = null

				} else {

					console.log(`PUSH`)

					this.PostEditableContent.push({
						type: this.CurentTypeOfContent, 
						value: VALUE()
					})

				}

			},

			async FireBasePostQuantity(): Promise<number> {

				const Q = await firebase.database()
					.ref('Posts')
					.once('value')
					.then( data => data.numChildren() )

				this.PostsQuantity = Q;

				return Q;

			},

			async UploadPost() {

				const CONTENT = {
					ID: await this.FireBasePostQuantity(),
					authorID: this.UserState.UserID,
					comment: [],
					content: this.PostEditableContent,
					image: this.PostData.image,
					description: this.PostData.description,
					tags: this.PostData.tags,
					date: Date.now(),
					title: this.PostData.title,
				}

				console.log( CONTENT )

				firebase.database()
					.ref(`Posts/PostID-${ this.PostsQuantity || 0 }`)
					.set(CONTENT);

			}

		},
	})

</script>