<template>
	<section class="post-container" @keydown.ctrl.enter="SendComment" 
		:id="`PostID-${ payload.ID }`" 
		:style="`order:${ PostOrder }`">
		
		<div class="post-header" ref="ImageHolder" :style="`background-image: url(${ ImageURL })`">

			<section class="post-header-tags">
				<span>{{ payload.tags }}</span>
			</section>

			<section class="post-header-title">
				<h4>{{ payload.title }}</h4>
				<h6>{{ payload.description }}</h6>
			</section>

			<section class="post-header-time">
				<span>{{ PostDate.Day }} в {{ PostDate.Time }}</span>
			</section>

		</div>

		<div class="post-footer">

			<section class="post-footer-social">

				<button @click="SetLike" 
					:id="`LikePopOver-${ payload.ID }`"
					:class="[
						{ active: UserLiked }, 
						{ NonActive: !this.LoginStatus }
					]">

					<i class="fas fa-fire"/>

					<client-only>
						
						<template v-if="Object.values(Likes || {}).length">
							<span class="post_btn_counter pl-2">{{ Object.values(Likes || {}).length }}</span>
						</template>

						<span slot="placeholder"></span>

					</client-only>

				</button>

				<button @click='CommentSection = !CommentSection' 
					:id="`CommentPopOver-${ payload.ID }`" 
					:class="{ active: CommentSection }">

					<i class="fas fa-comment" />

					<client-only>

						<template v-if="Comments.length">
							<span class="post_btn_counter pl-2">{{ Comments.length || '' }}</span>
						</template>

						<span slot="placeholder"></span>

					</client-only>

				</button>

			</section>

			<section class="post-footer-collapse">
				<button @click='ContentSection = !ContentSection'>
					{{ !ContentSection ? 'Развернуть пост' : 'Свернуть пост' }}
				</button>
			</section>				

			<section class="post-footer-author">
				<span>{{ AuthorInfo.UserName }}</span>
				<i :style="`background-image: url(${ AuthorInfo.UserImageID })`"></i>
			</section>

		</div>

		<!-- <client-only>

			<component :is="`eccheuma-collapse`" :active="ContentSection" v-if="CLIENT_RENDER_CHECK">
				<div class="post-content" v-if="ContentSection">

					<section key="POST_CONTENT_SECTION_1" class="post-content-header">
						<h4>{{ payload.title }}</h4>
						<h6>{{ payload.description }}</h6>
						<span>{{ AuthorInfo.UserName }} | {{ PostDate.Day }} в {{ PostDate.Time }}</span>
					</section>

					<section key="POST_CONTENT_SECTION_2" class="post-content-body">

						<template v-if="EditContent">
							<slot></slot>
						</template>

						<template v-else>
							<PostContent :source="Content"></PostContent>
						</template>

					</section>

					<section key="POST_CONTENT_SECTION_3" class="post-content-footer">
						<h6 class="d-inline mr-2">Теги: </h6>
						<span>{{ payload.tags }}</span>
						<hr>
						<button class="mx-auto mt-5" type="button" @click='CommentSection = !CommentSection' v-b-toggle="`post_comment_collapse_ID${ payload.ID }`">
							Открыть комментарии
						</button>
					</section>

				</div>
			</component>

			<component :is="`eccheuma-collapse`" :active="CommentSection" v-if="CLIENT_RENDER_CHECK">
				<div class="post-comments">

					<template v-if="!Comments.length">
						<section class="post-comments-first">
							<span>Тут ещё нет комментариев, но я крайне надеюсь что они появятся.</span>
						</section>
					</template>

					<section class="post-comments-content">
						<transition-group name="Fade" mode="out-in">
							<post-comment 
								v-for="(item, index) in Comments" :key="`Comment#${ index }`" 
								:UserID='item.UserID'
								:ModerationMode='false' 
								:PostID='payload.ID' 
								:CommentID='item.ID'>
							</post-comment>
						</transition-group>
					</section>

					<section class="post-comments-answer">

						<template v-if="LoginStatus">
							<h5>Оставьте свой комментарий</h5>
							<p>Не длинее 600 символов и не менее 6. <strong>Лимит: {{ CommentCharLimit }}</strong></p>
							<div class="row justify-content-center py-3">
								<div class="col-10">
									<textarea name="comment_section" v-model="Message" @input="EmitSound(`On`)"
										placeholder="Напишите тут что-то в ответ." maxlength="400">
									</textarea>
								</div>
							</div>
							<div class="post_comment-footer row justify-content-center">
								<div class="col-auto">
									<button :class="$v.Message.$invalid ? 'NonActive' : '' " @click="SendComment" type="button">
										Ответить <span>( Ctrl + Enter )</span>
									</button>
								</div>
							</div>
						</template>

						<template v-else>
							<h5>Для комментирования необходима авторизация</h5>
							<p class="pb-0">Это не так уж и сложно, да и получите сверху ещё больше функионала.</p>
						</template>

					</section>

				</div>
			</component>

		</client-only> -->

	</section>
</template>

<style lang="scss">

.post {
	&-header {

		@include gradient_border(top);

		background-color: $color2;
		min-height: 40vh;

		background: {
			size: cover;
			position: center;
			repeat: no-repeat;
		}

		display: grid;

		grid-template: {
			columns: 1fr;
			rows: 1fr 4fr 1fr;
		}

		position: relative;

		&:before {
			content: "";
			position: absolute; top: 0; left: 0; z-index: 1;
			width: 100%; height: 100%;
			background-image: url(~assets/images/SVG/Stripes.svg);
			background-size: 12px;
			opacity: .5;
		}

		&:after {
			content: "";
			position: absolute; top: 0; left: 0; z-index: 2;
			width: 100%; height: 100%;
			background-color: $color1;
			opacity: .5;
		}

		&-tags {

			z-index: 3;

			justify-self: center;
    	align-self: center;

			span {
				padding: 4px 15px;
				font-weight: 700;
				font-size: $FontSize5;
				background-color: $color1;
				border-radius: .7rem;
			}
		}

		&-title {

			z-index: 3;

			align-self: center;

			padding: 0 40px;

			h4 {
				font-weight: 600;
			}
			h6 {
				font-weight: 500;
				font-size: $FontSize2;
			}

		}

		&-time {

			z-index: 3;

			justify-self: center;
    	align-self: center;

			span {
				padding: 4px 15px;
				font-weight: 600;
				font-size: $FontSize5;
				background-color: $color1;
				border-radius: .7rem;
			}
		}

	}
	&-footer {

		background-color: $color5;

		display: grid;

		grid-template: {
			columns: 1fr 3fr 1fr;
			rows: 10vh;
			areas: 'social collapse author'
		}

		@media screen and ( max-width: $MobileBreakPoint ) {

			padding: 2vh 0;
			row-gap: 2vh;

			grid-template: {
				columns: 1fr;
				rows: auto;
				areas: 	'author'
								'social'
								'collapse'
			}


		}

		.active {
			transition-duration: 250ms;
			background-color: $color2;
			color: $color5;
		}

		&-social {

			justify-self: center;
			align-self: center;
			
			grid: { 
				row: 		social; 
				column: social; 
			}

			button {
				@include push-button {
					background-color: transparent;
					padding: 6px 20px;
					margin: 0 2px;
				}
			}

		}
		
		&-collapse {

			justify-self: center;
			align-self: center;
			
			grid: { 
				row: 		collapse; 
				column: collapse; 
			}

			button {
				@include push-button {
					background-color: transparent;
					width: 100%;
				}
			}

		}

		&-author {

			$iconSize: 100px;

			@media screen and ( max-width: $MobileBreakPoint ) {
				transform: unset;
				border-bottom: 1px solid $color6;
			}

			z-index: 3;

			transform: translateY(-#{$iconSize / 2});

			justify-self: center;
			align-self: center;
			
			grid: { 
				row: 		author; 
				column: author; 
			}

			span {

				display: block;width: 100%;

				background-color: $color1;
				border-radius: .7rem;

				margin: { bottom: 1vh };

				font: {
					size: $FontSize4;
					weight: 700;
				}

				text-align: center;

			}

			i {

				display: block;

				background: {
					size: cover;
					position: center;
					color: $color6;
				}

				border: 4px solid $color5; border-radius: 100%;

				height: $iconSize; 
				width: $iconSize;

				box-shadow: 0px 1vh 0px 0px $color6;

			}

		}
	}
	&-content {

		@media screen and ( max-width: $MobileBreakPoint ) {
			padding: 0 5vw;
		}

		background-color: $color5;
		color: $color1;
		min-height: 50vh;
		padding: 5vh 3vw;
		&-header {
			height: 100%;
			p {
				display: inline-block;
				font-size: 12px;
				font-weight: 700;
				opacity: .75;		
			}
		}
		&-footer {
			button {
				@include push-button {
					background-color: transparent;
				};
			}
			span {
				width: 100px;
				text-align: center;
				padding: 4px 20px;
				border-radius: .7rem;
				background-color: $color1;
				color: $color5;
				font-size: $FontSize5;
				font-weight: 700;
			}
		}
	}
	&-comments {
		background-color: $color5;
		color: $color1;
		&-first {
			
		}
		&-content {
		}
		&-answer {
			border-top: 1px solid $color6;
			padding: 4vh 3vw;
			h5 {
				color: $color3;
				font-size: $FontSize1;
				text-align: center;
				font-weight: 700;
			}
			p {
				white-space: pre-wrap;
				text-align: center;
				font-weight: 500;
				font-size: $FontSize2;
			}
			textarea {
				resize: none;
				display: block;
				width: 100%;
				height: 90px;
				border-radius: .7rem;
				padding: 15px 20px;
				font-size: 12px;
			}
			button {
				@include push-button {
					background-color: transparent;
				};
			}
		}
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// VUELIDATE
	import type { validationMixin } from "vuelidate"
	import { required, minLength, maxLength, helpers } from 'vuelidate/lib/validators'

	const customValidator = helpers.regex('alpha', /^[а-яА-ЯЁё\n\t\s\w\W]*$/)

	// FIREBASE 
	import firebase from "firebase/app"
	import "firebase/database"

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound.ts'
	import HashGenerator from '~/assets/mixins/HashGenerator.ts'

	// TYPES & INTERFACES
	import type { POST, POST_CONTENT, COMMENT, LIKE } from '~/types/Post.ts'
	import type { USER_STATE } 												from '~/types/User.ts'
	import type { FORMATED_DATE } 											from '~/store'

	type SECTIONS = 'Likes' | 'Comments' | 'Content'

	// COMPONETS
	import EccheumaCollapse from '~/components/common/EccheumaCollapse.vue'

	// IMAGE PLACEHOLDER
	const PLACEHOLDER = `${ require('~/assets/images/ImagePlaceholder.png?resize&size=600')}`
		
	// MODULE
	export default Vue.extend({
		mixins: [ EmitSound, HashGenerator ],
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions< POST >,
			PostOrder: {
				type: Number
			},
			EditContent: {
				type: Boolean,
				default: false
			},
		},
		components: {
			EccheumaCollapse,
			PostComment: () => import('~/components/post/PostComment.vue'),
			PostContent: () => import('~/components/post/PostContent.vue'),
		},
		data() {
			return {

				ImageURL: 'PLACEHOLDER',

				CharterLimit: 600,

				AuthorInfo: new Object() as USER_STATE,

				Message: '',

				ContentSection: false,
				CommentSection: false,

				LikedFocus: false,
				CommentFocus: false,

				PostDate: { Day: '', Time: '' } as FORMATED_DATE,

				Content: 	[] as POST_CONTENT[],
				Comments: [] as COMMENT[],
				Likes: 		{} as {[ID: string]: LIKE}

			}
		},
		watch: {
			payload: {
				handler() {
					this.UpdateImage()
				},
				deep: true
			},
			ImageURL: {
				handler() {

					this.$AnimeJS({
						targets: this.$refs.ImageHolder,
						opacity: [0, 1],
						// delay: 1000,
						duration: 250,
						easing: 'easeInQuad',
					})
					
				}
			},
		},
		validations: {
			Message: {
				required, 
				customValidator,
				minLength: minLength(6),
				maxLength: maxLength(600),
			}
		},
		computed: {
			...mapState({
				// ROOT
				LocalTime:		(state: any) => (state as VuexModules).LocalTime,
				// MODULES
				LoginStatus: 	(state: any) => (state as VuexModules).Auth.Auth.LoginStatus,
				StoreUser:		(state: any) => (state as VuexModules).User.State.UserState,
			}),
			CommentCharLimit(): number {

				return 600 - this.Message.length
				
			},
			UserLiked(): boolean {

				if ( this.LoginStatus ) {
					return this.Likes ? this.StoreUser.UserID in this.Likes : false
				}

				return false

			}
		},
		methods: {

			...mapActions({
				GetLocalTime: 'GetLocalTime',
				GetImageURL: 'Images/GetImageURL'
			}),
			
			GetAuthorInfo() {
				firebase.database()
					.ref(`Users/${ this.payload.authorID }/state`)
					.on('value', data => {
						this.AuthorInfo = data.val()
					})
			},

			GetPostData( sections: SECTIONS[] ) {

				sections.map(( section: SECTIONS ) => {

					if( section == 'Comments' ) {

						firebase.database()
							.ref(`Posts/PostID-${ this.payload.ID }/${ section.toLowerCase() }`)
							.orderByChild('Date')
							.on('value', data => {
								this[section] = Object.values( data.val() || {} )
							})

						return

					}

					firebase.database()
						.ref(`Posts/PostID-${ this.payload.ID }/${ section.toLowerCase() }`)
						.on('value', data => {
							this[section] = data.val()
						})

				})

			}, 
			async UpdateImage(): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.ImageHolder as Element

				this.ImageURL = await this.GetImageURL({ 
					_path: this.payload.image,
					_size: IMAGE_CONTAINER.getBoundingClientRect().width * window.devicePixelRatio
				})

			},
			SendComment(): void {

				if ( !this.$v.Message.$invalid && this.LoginStatus ) {
					
					const HASH = this.HashGenerator()

					this.GetLocalTime()
	
					this.EmitSound('In', { rate: 1 })

					const COMMENT: COMMENT = {
						ID: HASH,
						Date: Date.now(),
						Comment : this.Message,
						UserID: this.StoreUser.UserID,
					}

					const Section: SECTIONS = 'Comments'
	
					firebase.database()
						.ref(`Posts/PostID-${ this.payload.ID }/${ Section.toLowerCase() }/Hash-${ HASH }`)
						.set( COMMENT );

				}

			},
			SetLike(): void {

				const Section: SECTIONS = 'Likes'

				const REF = `Posts/PostID-${ this.payload.ID }/${ Section.toLowerCase() }/${ this.StoreUser.UserID }`

				if( this.UserLiked && this.LoginStatus ) {

					firebase.database().ref(REF).remove()

				} else {

					firebase.database().ref(REF).set({
						hash: this.HashGenerator()
					})

				}

			},
		},
		created() {

			this.GetAuthorInfo()
			this.GetPostData(['Likes', 'Comments', 'Content'])

		},
		async mounted() {

			this.PostDate = await this.GetLocalTime(this.payload.date)

			if ( process.client ) {
				this.UpdateImage()		
			}

		}
	})

</script>