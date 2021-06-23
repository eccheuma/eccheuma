<template>
	<section
		:id="`PostID-${ HashGenerator(12) }`" 
		class="post-container"
		:class="`interface-${ UI }`" 
		@keydown.ctrl.enter="sendComment"
		> 

		<!-- Post description, Image, Tage and etc. -->
		<div 
			ref="ImageHolder" 
			class="post-header"
			:class="[
				{ 'utils::cooled-sections': Cooled },
			]" 
		>

			<!-- <displacement-filter :name="filter.name" :status="filter.status" /> -->
			<!-- <img :src="ImageURL.webp" :alt="payload.description" :style="`filter: url(#filter::${ filter.name })`"> -->

			<picture class="post-header-image">
				<source :srcset="ImageURL.avif" type="image/avif">
				<img :src="ImageURL.webp" :alt="payload.description">
			</picture>

			<section class="post-header-tags">
				<tag>
					{{ payload.tags }}
				</tag>
			</section>

			<section class="post-header-title">
				<h4>{{ payload.title }}</h4>
				<h6>{{ payload.description }}</h6>
			</section>

			<section class="post-header-time">
				<tag>
					{{ PostDate.Day }} в {{ PostDate.Time }}
				</tag>
			</section>

		</div>

		<!-- Footer. Social buttons and Author Icon -->
		<div 
			class="post-footer" 
			:class="[
				{ 'utils::cooled-sections': Cooled },
				{ 'rounded-bottom': !ContentSection && !CommentSection },
			]"
			>

			<section class="post-footer-social">

				<button 
					:id="`LikePopOver-${ payload.ID }`"
					:class="[
						{ active: userLiked }, 
						{ disabled: !LoginStatus }
					]"
					@click="sendLike"
					@mouseenter="playSound(Sounds.get('PostSocialButton'))"
					>

					<icon name="Fire" />

					<client-only>
						
						<template v-if="Object.keys(Likes || {}).length">
							<span>{{ Object.keys(Likes || {}).length }}</span>
						</template>

						<span slot="placeholder" />

					</client-only>

				</button>

				<popover :target="`LikePopOver-${ payload.ID }`">
					{{ LoginStatus ? 'Поставить лайк' : 'Авторизируйтесь для оценки' }}
				</popover>

				<button 
					:id="`CommentPopOver-${ payload.ID }`" 
					:class="{ active: CommentSection }"
					@click="toggleSection(!CommentSection, 'CommentSection')"
					@mouseenter="playSound(Sounds.get('PostSocialButton'))"
					>

					<icon name="Comment" />

					<client-only>

						<template v-if="sortedComments.length">
							<span>{{ sortedComments.length }}</span>
						</template>

						<span slot="placeholder" />

					</client-only>

				</button>

				<popover :target="`CommentPopOver-${ payload.ID }`">
					Открыть комметарий
				</popover>

			</section>

			<section class="post-footer-collapse">
				<button @click="toggleSection(!ContentSection, 'ContentSection')">
					{{ !ContentSection ? 'Развернуть пост' : 'Свернуть пост' }}
				</button>
			</section>				

			<section class="post-footer-author">

				<template v-if="AuthorInfo">
					<tag>
						{{ AuthorInfo.UserName }}
					</tag>
					<i :style="`background-image: url(${ AuthorInfo.UserImageID })`" />
				</template>

			</section>

		</div>

		<!-- Comments and Content -->
		<client-only>

			<eccheuma-collapse :active="ContentSection">

				<article 
					class="post-content" 
					:class="[
						{ 'rounded': !ContentSection && !CommentSection },
						{ 'rounded-bottom': ContentSection && !CommentSection }
					]"
				>

					<header class="post-content-header">
						<h4>{{ payload.title }}</h4>
						<h6>{{ payload.description }}</h6>
						<span>{{ AuthorInfo ? AuthorInfo.UserName : '' }} | {{ PostDate.Day }} в {{ PostDate.Time }}</span>
					</header>

					<template v-if="editContent">
						<slot />
					</template>

					<template v-else>
						<post-content :source="Content" />
					</template>

					<footer class="post-content-footer">
						<h6>Теги: </h6>
						<tag :transparent="false">
							{{ payload.tags }}
						</tag>
						<hr>
						<common-button class="interface-dark" @click.native="toggleSection(!CommentSection, 'CommentSection')">
							Открыть комментарии
						</common-button>
					</footer>

				</article>
				
			</eccheuma-collapse>

			<eccheuma-collapse :active="CommentSection">	

				<div 
					class="post-comments" 
					:class="[
						{ 'rounded': !CommentSection },
						{ 'rounded-bottom': CommentSection }
					]"
				>

					<template v-if="!sortedComments.length">
						<section class="post-comments-first">
							<span>
								" Тут ещё нет комментариев, но это пока... "
							</span>
						</section>
					</template>

					<section class="post-comments-content">
						<post-comment 
							v-for="item in sortedComments" 
							:key="item.Date" 
							:userID="item.UserID"
							:postID="payload.ID" 
							:commentID="item.ID" 
						/>
					</section>

					<section class="post-comments-answer">

						<template v-if="LoginStatus">

							<h5>Оставьте свой комментарий</h5>
							<p>Не длинее 600 символов и не менее 6. <strong>Лимит: {{ charLimit }}</strong></p>

							<textarea 
								v-model="Message" 
								name="comment_section" 
								maxlength="400" 
								placeholder="Напишите тут что-то в ответ." 
								@input="playSound(Sounds.get('PostInput'))"
							/>
	
							<button :class="$v.Message.$invalid ? 'disabled' : '' " type="button" @click="sendComment">
								Ответить <span>( Ctrl + Enter )</span>
							</button>

						</template>

						<template v-else>
							<h5>Для комментирования необходима авторизация</h5>
							<p>Это не так уж и сложно, да и получите сверху ещё больше функионала.</p>
						</template>

					</section>

				</div>

			</eccheuma-collapse>

		</client-only>

	</section>
</template>

<style lang="scss">

.post {
	&-container {

		@include gradient_border(top);

		.rounded {

			border-radius: .7rem;

			&-top {
				border-radius: 0 0 .7rem .7rem;
			}
			&-bottom {
				border-radius: 0 0 .7rem .7rem;
			}
		}

	}
	&-header {

		display: grid;
		position: relative;

		background-color: rgb(var(--color-2));

		border-radius: .7rem .7rem 0 0;
    overflow: hidden;

		background: {
			size: cover;
			position: center;
			repeat: no-repeat;
		}

		grid-template: {
			columns: 1fr;
			rows: 10vh 20vh 10vh;
		}

		&:before {
			content: "";
			position: absolute; top: 0; left: 0; z-index: 1;
			width: 100%; height: 100%;
			background-image: url(~assets/images/Stripes.png?format=webp&size=20);
			opacity: .75;
		}

		&:after {
			content: "";
			position: absolute; top: 0; left: 0; z-index: 2;
			width: 100%; height: 100%;
			background-color: rgb(var(--color-def-1));
			opacity: .5;
		}

		&-image {
			position: absolute;
			display: block;
			width: 100%;
			height: 100%;
			img {
				position: relative;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&-tags {

			z-index: 3;

			position: relative;
			display: grid;

			width: 100%;
			height: 100%;

			align-content: center;
			justify-content: center;

		}

		&-title {

			z-index: 3;

			align-self: center;

			padding: 0 40px;

			h4 {
				font-weight: 700;
				font-size: var(--font-size-1);
			}
			h6 {
				font-weight: 500;
				font-size: var(--font-size-3);
			}

		}

		&-time {

			z-index: 3;

			position: relative;
			display: grid;

			width: 100%;
			height: 100%;

			align-content: center;
			justify-content: center;

		}

	}
	&-footer {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-6));

		display: grid;

		padding: 0 2vw;

		grid-template: {
			columns: 1fr 3fr 1fr;
			rows: 10vh;
			areas: 'social collapse author'
		}

		border-bottom: 1px solid rgba(var(--color-5), .25);

		@media screen and ( max-width: $mobile-breakpoint ) {

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

			background-color: rgb(var(--color-2));
			color: rgb(var(--color-5));

			i {
				background-color: rgb(var(--color-5));
			}

		}

		.disabled {
			pointer-events: none;
			opacity: .25;
		}

		&-social {

			justify-self: start;
			align-self: center;
			
			grid: { 
				row: 		social; 
				column: social; 
			}

			button {

				display: inline-flex;

				column-gap: 4px;

				@include push-button {

					background-color: transparent;
					padding: 6px 15px;
					margin-right: 1ch;

					color: rgb(var(--color-2));

					transition-duration: 250ms;

					i {
						background-color: rgb(var(--color-2));
					}

					span {
						line-height: 21px;
						padding: 0 4px;
					}

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
					padding: 6px 6vw;
					line-height: 21px;
					width: 100%;
				}
			}

		}

		&-author {

			$iconSize: 100px;

			@media screen and ( max-width: $mobile-breakpoint ) {
				transform: unset;
				border-bottom: 1px solid rgb(var(--color-5));
			}

			z-index: 3;

			display: inline-grid;
			row-gap: 2vh;

			transform: translateY(calc((#{ $iconSize } - 10vh) - #{ $iconSize / 2 }));

			justify: {
				self: end;
				items: center;
			}

			align: {
				self: flex-end;
			}
			
			grid: { 
				row: 		author; 
				column: author; 
			}

			i {

				display: block;

				background: {
					size: cover;
					position: center;
					color: rgb(var(--color-5));
				}

				border: 4px solid rgb(var(--color-6)); border-radius: 100%;

				height: $iconSize; 
				width: $iconSize;

				box-shadow: 0px 1vh 0px 0px rgb(var(--color-5));

			}

		}
	}
	&-content {

		transition: border-radius 250ms ease-in-out;

		@media screen and ( max-width: $mobile-breakpoint ) {
			padding: 0 5vw;
		}

		background-color: rgb(var(--color-6));
		color: rgb(var(--color-1));
		min-height: 50vh;
		padding: 5vh 3vw;

		&-header {

			color: rgb(var(--color-3));

			h4 {	
				font: {
					size: var(--font-size-1);
					weight: 800;
				}
			}
			h6 {
				font: {
					size: var(--font-size-3);
					weight: 600;
				}
			}
			span {
				font: {
					size: var(--font-size-5);
					weight: 500;
				}
			}
		}
		&-footer {

			display: grid;

			button {
				margin: 0 25%;
			}

		}
	}
	&-comments {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-6));
		color: rgb(var(--color-1));

		&-first {
			text-align: center;
			padding: 5vh 0 4vh;
			font-size: var(--font-size-4);
			color: rgb(var(--color-3));
			font-weight: 500;
		}

		&-content {
			display: inline-grid;
			width: 100%;
		}

		&-answer {
			border-top: 1px solid rgb(var(--color-5));
			padding: 4vh 3vw;
			h5 {
				color: rgb(var(--color-3));
				font-size: var(--font-size-2);
				text-align: center;
				font-weight: 800;
			}
			p {
				white-space: pre-wrap;
				text-align: center;
				font-weight: 500;
				font-size: var(--font-size-4);
			}
			textarea {
				resize: none;
				display: block;
				width: 100%;
				height: 90px;
				border-radius: .7rem;
				padding: 15px 20px;
				margin-top: 4vh;
				font-size: 12px;
				background-color: rgb(var(--color-6));
				color: rgb(var(--color-1));
			}
			button {
				@include push-button {
					background-color: transparent;
				};

				margin: {
					top: 3vh;
				}
			}
		}
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// VUELIDATE
	import { required, minLength, maxLength, helpers } from 'vuelidate/lib/validators'

	// FIREBASE 
	import firebase from 'firebase/app'
	import 'firebase/database'

	// MIXINS
	import EmitSound 						from '~/assets/mixins/EmitSound'
	import HashGenerator 				from '~/assets/mixins/HashGenerator'
	import IntersectionCooler 	from '~/assets/mixins/IntersectionCooler'

	// COMPONETS
	import EccheumaCollapse 		from '~/components/common/EccheumaCollapse.vue'
	import Popover 							from '~/components/common/Popover.vue'
	import Tag 									from '~/components/common/Tag.vue'
	import Icon									from '~/components/Icon.vue'
	import CommonButton 				from '~/components/buttons/CommonButton.vue'

	//	С фильтрами происходит что-то не совсем ясное. 
	//  Нормально работают в хроме, но лиса отказывается с ними адекватно дружить.

	// FILTERS
	// import DisplacementFilter		from '~/components/filters/displacement.vue'
	// import NoiseFilter					from '~/components/filters/noise.vue'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// TYPES & INTERFACES
	import type { POST, POST_CONTENT, COMMENT, LIKE } 	from '~/typescript/Post'
	import type { USER_STATE } 													from '~/typescript/User'
	import type { IMAGE_URL } 													from '~/typescript/Image'
	import type { FORMATED_DATE } 											from '~/store'

	import type { DirectionOptions, AnimeCallBack } from '~/../node_modules/@types/animejs'

	type SECTIONS = 'Likes' | 'Comments' | 'Content'

	// // IMAGE PLACEHOLDER
	const PLACEHOLDER: IMAGE_URL = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	}

	// VALIDATE REGULAR EXPRESSION
	const CYRILLIC_VALIDATION = helpers.regex('alpha', /^[а-яА-ЯЁё\n\t\s\w\W]*$/)

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaCollapse,
			CommonButton,
			Popover,
			Tag,
			Icon,
			// DisplacementFilter,
			// NoiseFilter,
			PostComment: () => import('~/components/post/PostComment.vue'),
			PostContent: () => import('~/components/post/PostContent.vue'),
		},
		mixins: [ 
			EmitSound, 
			HashGenerator, 
			// IntersectionObserver, 
			IntersectionCooler 
		],
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions< POST >,
			order: {
				type: Number,
				required: true,
			},
			editContent: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {

				// filter: {
				// 	name: 'XXX',
				// 	status: false,
				// },

				Cooled: process.browser,

				ImageURL: PLACEHOLDER,

				CharterLimit: 600,

				AuthorInfo: new Object() as USER_STATE | null,

				Message: '',
				PreviosMessage: '_',

				ContentSection: false,
				CommentSection: false,

				LikedFocus: false,
				CommentFocus: false,

				PostDate: { Day: '', Time: '' } as FORMATED_DATE,

				Content: 	[] as POST_CONTENT[],
				Comments: {} as {[ID: string]: COMMENT},
				Likes: 		{} as {[ID: string]: LIKE}

			}
		},
		computed: {

			...mapState({
				LocalTime:		state => (state as VuexModules).LocalTime,
				UI:						state => (state as VuexModules).App.UI,
				LoginStatus: 	state => (state as VuexModules).Auth.Auth.LoginStatus,
				StoreUser:		state => (state as VuexModules).User.State.UserState,
			}),

			charLimit(): number {
				return 600 - this.Message.length
			},

			userLiked(): boolean {

				if ( this.LoginStatus ) {
					return this.Likes ? this.StoreUser.UserID in this.Likes : false
				}

				return false

			},

			sortedComments(): COMMENT[] {
				return Object.values(this.Comments || {}).sort((a, b) => a.Date - b.Date)
			}
			
		},
		watch: {
			'payload.image': {
				handler() {
					this.$nextTick().then(this.updateImage)
				},
			},
		},
		async created() {

			this.PostDate = await this.GetLocalTime(this.payload.date);

			const Watcher = this.$watch('Cooled', () => {
				if ( Watcher ) {
					this.updateImage(); Watcher()
				}
			}); 

			this.getAuthor();
			this.listenSnapshots(['Likes', 'Comments', 'Content']);

			// @mouseenter="EmitSound('On', { rate: .45, volume: .25 })

			this.setSounds([
				{
					file: 'On',
					name: 'PostSocialButton',
					settings: { rate: .45, volume: .25 },
				},
				{
					file: 'On',
					name: 'PostInput',
				},
				{
					file: 'Out',
					name: 'PostToggleIn',
					settings: { rate: .8, volume: .25 },
				},
				{
					file: 'Out',
					name: 'PostToggleOut',
					settings: { rate: .6, volume: .25 },
				},
				{
					file: 'Tap',
					name: 'PostLikeInc',
					settings: { rate: .75, volume: .25 },
				},
				{
					file: 'Tap',
					name: 'PostLikeDec',
					settings: { rate: .5, volume: .25 },
				},
			]);

		},
		mounted() {

			if ( !this.$isMobile ) {
				this.initCooler(this.$el, (cooled: boolean) => { this.Cooled = cooled })
			} else {
				this.Cooled = false;
			}

			if ( this.CLIENT_RENDER_CHECK ) {
				if ( !this.Cooled ) { this.updateImage() }
			}

		},
		validations: {
			Message: {
				required, 
				CYRILLIC_VALIDATION,
				minLength: minLength(6),
				maxLength: maxLength(600),
			}
		},
		methods: {

			...mapActions({
				GetLocalTime: 'GetLocalTime',
				getImageURL: 'Images/getImageURL',
				decodeImage:  'Images/decodeImage',
			}),
			
			getAuthor() {

				firebase.database()
					.ref(`Users/${ this.payload.authorID }/state`)
					.on('value', (snapshot) => {
						this.AuthorInfo = snapshot.val()
					})

			},

			listenSnapshots( sections: SECTIONS[] ) {

				sections.forEach((section: SECTIONS) => {

					firebase.database()
						.ref(`Posts/PostID-${ this.payload.ID }/${ section.toLowerCase() }`)
						.on('value', (data) => {
							this[section] = data.val()
						})

				})

			}, 

			toggleSection(status: boolean, section: 'ContentSection' | 'CommentSection'): void {

				// if ( section === 'ContentSection' ) {
				// 	this.filter.status = status;
				// }

				this[section] = status;

				this.playSound(this.Sounds.get(status ? 'PostToggleIn' : 'PostToggleOut'));

			},

			async updateImage(): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.ImageHolder as Element

				const URL: IMAGE_URL = await this.getImageURL({ 
					_path: this.payload.image,
					_size: IMAGE_CONTAINER.getBoundingClientRect().width * window.devicePixelRatio
				})

				const ANIMATION = (u_direction: DirectionOptions, cb?: AnimeCallBack ) => {
					this.$AnimeJS({

						targets: IMAGE_CONTAINER,
						opacity: [1, 0],
						duration: 500,
						direction: u_direction,
						easing: 'linear',

						...cb

					})
				} 

				ANIMATION('normal', {
					complete: () => { 

						this.ImageURL = URL;

						this.decodeImage(URL).finally(() => ANIMATION('reverse'))

					}
				})

			},

			sendComment(): void {

				const NON_REPETED = this.PreviosMessage !== this.Message;

				if ( !this.$v.Message.$invalid && this.LoginStatus && NON_REPETED ) {

					const HASH = this.HashGenerator()

					const SECTION: SECTIONS = 'Comments'

					const COMMENT: COMMENT = {
						ID: HASH,
						Date: Date.now(),
						Comment : this.Message,
						UserID: this.StoreUser.UserID,
					}
	
					firebase.database()
						.ref(`Posts/PostID-${ this.payload.ID }/${ SECTION.toLowerCase() }/Hash-${ HASH }`)
						.set( COMMENT )
						.then(() => { this.Message = '' })

				}

			},

			sendLike(): void {

				const Section: SECTIONS = 'Likes'

				const REF = `Posts/PostID-${ this.payload.ID }/${ Section.toLowerCase() }/${ this.StoreUser.UserID }`

				if ( this.userLiked && this.LoginStatus ) {

					this.playSound(this.Sounds.get('PostLikeDec'));

					firebase.database().ref(REF).remove()

				} else {

					this.playSound(this.Sounds.get('PostLikeInc'));

					firebase.database().ref(REF).set({
						hash: this.HashGenerator()
					})

				}

			},

		}
	})

</script>
