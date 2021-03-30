<template>
	<section
		:id="`PostID-${ payload.ID }`" 
		class="post-container"
		:class="`interface-${ UI }`" 
		:style="`order:${ order }`"
		@keydown.ctrl.enter="sendComment"
		> 

		<!-- Post description, Image, Tage and etc. -->
		<div 
			ref="ImageHolder" 
			class="post-header"
			:class="[
				{ cooled_sections: Cooled },
			]" 
			:style="`background-image: url(${ ImageURL })`"
		>

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

		<!-- Footer. Social buttons and Author Icon -->
		<div 
			class="post-footer" 
			:class="[
				{ cooled_sections: Cooled },
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
					@mouseenter="EmitSound('On', { rate: .45, volume: .25 })"
					>

					<i class="fas fa-fire" />

					<client-only>
						
						<template v-if="Object.keys(Likes || {}).length">
							<span class="post_btn_counter pl-2">{{ Object.keys(Likes || {}).length }}</span>
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
					@mouseenter="EmitSound('On', { rate: .45, volume: .25 })" 
					>

					<i class="fas fa-comment" />

					<client-only>

						<template v-if="sortedComments.length">
							<span class="post_btn_counter pl-2">{{ sortedComments.length }}</span>
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
					<span>{{ AuthorInfo.UserName }}</span>
					<i :style="`background-image: url(${ AuthorInfo.UserImageID })`" />
				</template>

			</section>

		</div>

		<!-- Comments and Content -->
		<client-only>

			<component 
				:is="`eccheuma-collapse`" 
				:active="ContentSection"
				>

				<article 
					class="post-content" 
					:class="[
						{ 'rounded': !ContentSection },
						{ 'rounded-bottom': !CommentSection }
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
						<span>{{ payload.tags }}</span>
						<hr>
						<button @click="toggleSection(!CommentSection, 'CommentSection')">
							Открыть комментарии
						</button>
					</footer>

				</article>
				
			</component>

			<component 
				:is="`eccheuma-collapse`" 
				:active="CommentSection"
				>	

				<div 
					class="post-comments" 
					:class="[
						{ 'rounded': !CommentSection },
						{ 'rounded-bottom': CommentSection }
					]"
				>

					<template v-if="!sortedComments.length">
						<section class="post-comments-first">
							<span>" <i>Тут ещё нет комментариев, но это пока...</i> "</span>
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
								@input="EmitSound(`On`)"
							/>
	
							<button :class="$v.Message.$invalid ? 'disabled' : '' " type="button" @click="sendComment">
								Ответить <span>( Ctrl + Enter )</span>
							</button>

						</template>

						<template v-else>
							<h5>Для комментирования необходима авторизация</h5>
							<p class="pb-0">
								Это не так уж и сложно, да и получите сверху ещё больше функионала.
							</p>
						</template>

					</section>

				</div>

			</component>

		</client-only>

	</section>
</template>

<style lang="scss">

.post {
	&-container {

		padding: 0 4px;

		margin: {
			bottom: 2vh;
		}

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

		@include gradient_border(top);

		background-color: rgb(var(--color-2));
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
			background-color: rgb(var(--color-def-1));
			opacity: .5;
		}

		&-tags {

			z-index: 3;

			justify-self: center;
			align-self: center;

			span {
				padding: 4px 15px;
				font-weight: 700;
				font-size: var(--font-size-5);
				background-color: rgb(var(--color-def-1));
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
				font-size: var(--font-size-3);
			}

		}

		&-time {

			z-index: 3;

			justify-self: center;
			align-self: center;

			span {
				padding: 4px 15px;
				font-weight: 600;
				font-size: var(--font-size-5);
				background-color: rgb(var(--color-def-1));
				border-radius: .7rem;
			}
		}

	}
	&-footer {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-6));

		display: grid;

		grid-template: {
			columns: 1fr 3fr 1fr;
			rows: 10vh;
			areas: 'social collapse author'
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {

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
			background-color: rgb(var(--color-def-2));
			color: rgb(var(--color-def-6));
		}

		.disabled {
			pointer-events: none;
			opacity: .25;
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
					margin-right: 1ch;
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

			@media screen and ( max-width: var(--mobile-breakpoint)) {
				transform: unset;
				border-bottom: 1px solid rgb(var(--color-5));
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

				background-color: rgb(var(--color-def-1));
				border-radius: .7rem;

				margin: { bottom: 1vh };

				font: {
					size: var(--font-size-4);
					weight: 700;
				}

				text-align: center;

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

		@media screen and ( max-width: var(--mobile-breakpoint)) {
			padding: 0 5vw;
		}

		background-color: rgb(var(--color-6));
		color: rgb(var(--color-1));
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
				background-color: rgb(var(--color-1));
				color: rgb(var(--color-6));
				font-size: var(--font-size-5);
				font-weight: 700;
			}

		}
	}
	&-comments {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-6));
		color: rgb(var(--color-1));

		&-first {
			text-align: center;
			padding: 8vh 0;
			font-size: var(--font-size-2);
			font-weight: 600;
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
				font-size: var(--font-size-1);
				text-align: center;
				font-weight: 700;
			}
			p {
				white-space: pre-wrap;
				text-align: center;
				font-weight: 500;
				font-size: var(--font-size-3);
			}
			textarea {
				resize: none;
				display: block;
				width: 100%;
				height: 90px;
				border-radius: .7rem;
				padding: 15px 20px;
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
	import EmitSound 			from '~/assets/mixins/EmitSound.ts'
	import HashGenerator 	from '~/assets/mixins/HashGenerator.ts'

	import IntersectionObserver from '~/assets/mixins/IntersectionObserver.ts'
	import IntersectionCooler 	from '~/assets/mixins/IntersectionCooler.ts'

	// COMPONETS
	import EccheumaCollapse from '~/components/common/EccheumaCollapse.vue'
	import Popover 					from '~/components/common/Popover.vue'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES & INTERFACES
	import type { POST, POST_CONTENT, COMMENT, LIKE } 	from '~/types/Post.ts'
	import type { USER_STATE } 													from '~/types/User.ts'
	import type { FORMATED_DATE } 											from '~/store'

	import type { ANIMATION_PAYLOAD } from '~/assets/mixins/IntersectionObserver.ts'

	type SECTIONS = 'Likes' | 'Comments' | 'Content'

	// // IMAGE PLACEHOLDER
	const PLACEHOLDER = require('~/assets/images/ImagePlaceholder.png?resize&size=600').src as string

	// VALIDATE REGULAR EXPRESSION
	const CYRILLIC_VALIDATION = helpers.regex('alpha', /^[а-яА-ЯЁё\n\t\s\w\W]*$/)
		
	// INERSECTION OBSERVER ANIMATION
	const OBSERVER_ANIMATION: ANIMATION_PAYLOAD = {
		in: {
			opacity: [0, 1],
		},
		out: {
			opacity: [1, 0],
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaCollapse,
			Popover,
			PostComment: () => import('~/components/post/PostComment.vue'),
			PostContent: () => import('~/components/post/PostContent.vue'),
		},
		mixins: [ 
			EmitSound, 
			HashGenerator, 
			IntersectionObserver, 
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

				// CANDIDATE FOR WEB ASSEMBLY OPTIMIZATIONS

				const PREP = Object.values(this.Comments || {})

				const SORTED_DATES = PREP.map( item => item.Date ).sort();
				const SORTED_ARRAY = [] as COMMENT[];

				SORTED_DATES.forEach((number) => {
					SORTED_ARRAY.push( PREP.filter(item => item.Date === number).pop()! )
				})

				return SORTED_ARRAY;

			}
			
		},
		watch: {
			'payload.image': {
				handler() {
					this.$nextTick().then(this.updateImage)
				},
			},
		},
		created() {

			const Watcher = this.$watch('Cooled', () => {
				if ( Watcher ) {
					this.updateImage(); Watcher()
				}
			}) 

			this.getAuthor()
			this.listenSnapshots(['Likes', 'Comments', 'Content'])

		},
		async mounted() {

			this.initCooler(this.$el, (cooled: boolean) => { this.Cooled = cooled })

			if ( !this.$isMobile && this.$PIXI.utils.isWebGLSupported() ) {
				this.initIntersectionObserver(this.$el, OBSERVER_ANIMATION)
			}

			if ( this.CLIENT_RENDER_CHECK && !this.Cooled ) {
				this.updateImage()		
			}

			this.PostDate = await this.GetLocalTime(this.payload.date)

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
				GetImageURL: 'Images/GetImageURL'
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

				this[section] = status;

				this.EmitSound('Out', { rate: status ? 0.8 : 0.6, volume: .25 }); 

			},

			async updateImage(): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.ImageHolder as Element

				const I = await this.GetImageURL({ 
					_path: this.payload.image,
					_size: IMAGE_CONTAINER.getBoundingClientRect().width * window.devicePixelRatio
				})

				this.$AnimeJS({
					targets: this.$refs.ImageHolder,
					opacity: [1, 0],
					delay: 2000,
					duration: 500,
					endDelay: 500,
					direction: 'alternate',
					easing: 'easeInQuad',
					update: (anime) => {
						if (anime.progress === 100) {
							this.ImageURL = I
						}
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
						.then(() => {
							this.EmitSound('Tap', { rate: .75, volume: .25 }); this.Message = '';
						})

				}

			},

			sendLike(): void {

				const Section: SECTIONS = 'Likes'

				const REF = `Posts/PostID-${ this.payload.ID }/${ Section.toLowerCase() }/${ this.StoreUser.UserID }`

				if ( this.userLiked && this.LoginStatus ) {

					this.EmitSound('Tap', { rate: .5, volume: .25 })

					firebase.database().ref(REF).remove()

				} else {

					this.EmitSound('Tap', { rate: .75, volume: .25 })

					firebase.database().ref(REF).set({
						hash: this.HashGenerator()
					})

				}

			},

		}
	})

</script>
