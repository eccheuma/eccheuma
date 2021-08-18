<template>
	<div 
		class="admin_post-container" 
		@keydown.ctrl.enter="PushBlock" 
		@click.ctrl.left="DeleteBlock"
		>
		<section class="admin_post-header">

			<button @click="PreviewMode = true">
				Превью
			</button>

			<button @click="PreviewMode = false">
				Редактор
			</button>

		</section>
		<section class="admin_post-body">
			<transition-group name="opacity-transition">

				<template v-if="PreviewMode">

					<post key="post_preview" :EditContent="true" :payload="PostData" :order="0">
						<post-content :source="PostEditableContent" :editorMode="false" :editableBlock="0" />
					</post>

					<section key="property" class="admin_post-property">
						<template v-for="(item, index) in PropertyList">
							<div :key="index" class="admin_post-property-section">
								<span>{{ item.label }}</span>
								<input v-model="PostData[item.model]" type="text" :placeholder="item.placeholder">
							</div>
						</template>
					</section>

					<section key="submit" class="admin_post-submit">
						<button @click="UploadPost">
							Отправить
						</button>
					</section>

				</template>

				<template v-else>
					<section key="post_content" class="admin_post-post_content">
						<post-content 
							:editorMode="true" 
							:source="PostEditableContent" 
							:editableBlock="CurentEditableBlock"
							@curent-block="SetCurentBlock"
						/>
					</section>
				</template>

			</transition-group>
		</section>
	</div>
</template>

<style lang="scss">

.admin_post {
	&-container {
		width: 100%;
		padding: 3vh 0;
		display: inline-grid;
	}
	&-header {

		width: 50%;
		margin: 3vh auto;

		display: flex;

		button {
			@include light-button {
				width: 75%;
				height: 5vh;
				line-height: 5vh;
				padding: 0;
				margin: 0 1vw;
			}
		}

	}
	&-property {

		padding: 3vh 0;

		&-section {

			span {

				color: rgb(var(--color-mono-800));

				font: {
					size: 1rem;
				};

			}

			input {
	
				@include ecc-input;
	
				display: block;
				width: 75%;
				margin: 1vh 0;

			}
		}

	}
	&-submit {

		display: inline-grid;
		width: 100%;

		button {
			@include light-button {
				width: 50%;
				height: 5vh;
				line-height: 5vh;
				padding: 0;
				margin: 0 auto 5vh;
			}
		}
	}
	&-post_content {

		padding: 2vh 3vw;

		background: {
			color: rgb(var(--color-mono-900));
		}
	}
}

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

	// TYPES
	import type { POST, POST_CONTENT } 	from '~/typescript/Post.ts'
	import type { IMAGE_PROPERTY } 			from '~/typescript/Image.ts'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// BLOCK TYPES
	type BLOCK_TYPES = 'h5' | 'p' | 'blockquote' | 'img' | 'hr'

	type PROPERTY_LIST = {
		label: string
		model: keyof POST
		placeholder: string
	}

	// MODULE
	export default Vue.extend({
		components: {
			Post,
			PostContent,
		},
		data() {
			return {

				PostsQuantity: 0,
				
				PreviewMode: true,

				CurentEditableBlock: 	null 	as number | null,
				CurentTypeOfContent: 	'' 		as BLOCK_TYPES,
				CurentProperty: 			'' 		as string,

				PropertyList: [
					{
						label: 'Загаловок',
						model: 'title',
						placeholder: 'Faust'
					},
					{
						label: 'Изображение',
						model: 'image',
						placeholder: 'Other/1'
					},
					{
						label: 'Описание',
						model: 'description',
						placeholder: 'Neu wie kommt an ist ertönt.'
					}
				] as PROPERTY_LIST[],

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
					tags: [ '#TEST' ],
					date: Date.now(),
				} as POST,

				PostEditableContent: [
					{ type: 'h5', value: 'TEST' },
				] as POST_CONTENT[]

			}
		},
		computed: {
			...mapState({
				LocalTime: state => ( state as VuexModules ).LocalTime,
				UserState: state => ( state as VuexModules ).User.State.UserState
			})
		},
		methods: {

			updateHASH() {

				firebase.database()
					.ref('App/Cache/Posts')
					.set(Math.random().toString(36).substring(2))

			},

			SetCurentBlock(index: number) {

				if ( this.CurentEditableBlock === index ) {
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
					.set(CONTENT, () => this.updateHASH());

			}

		},
	})

</script>