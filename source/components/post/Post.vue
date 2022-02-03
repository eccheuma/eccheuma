<template>
	<intesection-component :ignite="!$isMobile" :rootMargin="15" @isIntersecting="animateIntersection">
		<section
			:id="`PostID-${ payload.ID }`" 
			class="post-container"
			:data-hash="HashGenerator(12)"
			@keydown.ctrl.enter="sendComment"
			ref="post"
			> 

			<div 
				ref="ImageHolder" 
				class="post-header"
				>

				<picture class="post-header-image">
					<source :srcset="ImageURL.avif" type="image/avif">
					<img :src="ImageURL.webp" :alt="payload.description">
				</picture>

				<section v-once class="post-header-tags">

					<tag v-for="(item, i) in payload.tags" :key="i">
						#{{ item }}
					</tag>

				</section>

				<section v-once class="post-header-title">
					<h4>{{ payload.title }}</h4>
					<h6>{{ payload.description }}</h6>
				</section>

				<section class="post-header-time">
					<tag>
						{{ PostDate.Day }} в {{ PostDate.Time }}
					</tag>
				</section>

			</div>

			<div 
				class="post-footer"  
				:class="[
					{ 'utils::cooled-sections': Cooled && !$isMobile },
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

					<common-button 
						:scheme="UI"
						:sound="false"
						@mouseenter.native.once="prepareContent = true" 
						@click.native="toggleSection(!ContentSection, 'ContentSection')"
						>
						{{ !ContentSection ? 'Развернуть пост' : 'Свернуть пост' }}
					</common-button>

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

			<client-only>

				<hardware-acceleration-decorator>
					<collapse :active="ContentSection">

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
								<content-component :source="Content" />
							</template>

							<section v-once class="post-content-tags">
								<h6>Теги: </h6>
								<tag v-for="(item, i) in payload.tags" :key="i" :transparent="false" :light="UI !== 'light'">
									#{{ item }}
								</tag>
							</section>

							<hr v-once>

							<section class="post-content-comments">
								<common-button class="interface-dark" :scheme="UI" :sound="false" @click.native="toggleSection(!CommentSection, 'CommentSection')">
									Открыть комментарии
								</common-button>
							</section>

						</article>
						
					</collapse>
				</hardware-acceleration-decorator>

				<hardware-acceleration-decorator>
					<collapse :active="CommentSection">	

						<div 
							class="post-comments" 
							:class="[
								{ 'rounded': !CommentSection },
								{ 'rounded-bottom': CommentSection }
							]"
						>

							<template v-if="!sortedComments.length" v-once> 
								<section class="post-comments-first">
									<span>" Тут ещё нет комментариев, но это пока... "</span>
								</section>
							</template>

							<section class="post-comments-content">
								<comment-component 
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
									<p>Не длинее {{ CharLimit }} символов и не менее 6. <strong>Лимит: {{ charLimit }}</strong></p>

									<textarea 
										v-model="Message" 
										name="comment_section" 
										:maxlength="CharLimit" 
										placeholder="Напишите тут что-то в ответ." 
									/>
			
									<button :class="{ disabled: $v.Message.$anyError }" type="button" @click="sendComment">
										Ответить <span>( Ctrl + Enter )</span>
									</button>

								</template>

								<template v-else v-once>
									<icon name="Info" />
									<h5>Для комментирования необходима авторизация</h5>
									<p>Это не так уж и сложно, да и получите сверху ещё больше функионала.</p>
								</template>

							</section>

						</div>

					</collapse>
				</hardware-acceleration-decorator>

			</client-only>

		</section>
	</intesection-component>
</template>

<style lang="scss">

.post {
	&-container {

		@include gradient_border(block);
		@include component-shadow;

		border-radius: var(--border-radius);

		.rounded {

			border-radius: var(--border-radius);

			&-top {
				border-radius: 0 0 .7rem .7rem !important;
			}
			&-bottom {
				border-radius: 0 0 .7rem .7rem !important;
			}
		}

	}
	&-header {

		display: grid;
		position: relative;

		background-color: rgb(var(--color-mono-300));

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

			position: absolute; 
			z-index: 1;
			
			top: 0; 
			left: 0; 

			width: 100%; 
			height: 100%;

			opacity: .75;

			// Desktop
			@media screen and ( min-width: $mobile-breakpoint ) {
				background-image: url(~assets/images/Stripes.png?format=webp&size=20);
			}

		}

		&:after {
			content: "";
			position: absolute; top: 0; left: 0; z-index: 2;
			width: 100%; 
			height: 100%;

			// Desktop
			@media screen and ( min-width: $mobile-breakpoint ) {
				background: linear-gradient(180deg, rgb(var(--mono-200),.5) 80%, rgb(var(--mono-200)) 100%);
			}

			// Mobile
			@media screen and ( max-width: $mobile-breakpoint ) {
				background: linear-gradient(180deg, rgb(var(--mono-200),.5) 50%, rgb(var(--mono-200)) 100%);
			}
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
			display: inline-flex;

			width: 100%;
			height: 100%;

			align-items: center;
			justify-content: center;

			column-gap: calc(min(5px, .5vw));

		}

		&-title {

			z-index: 3;

			align-self: center;

			padding: 0 40px;
			color: rgb(var(--mono-800));

			@media screen and ( max-width: $mobile-breakpoint ) {
				text-align: center;
			}

			h4 {
				font-weight: 900;
				font-size: var(--font-size-42);
				// width: clamp(min-content, 25ch, 100%);
				width: 25ch;
			}
			h6 {
				font-weight: 600;
				font-size: var(--font-size-20);
				// width: clamp(min-content, 65ch, 100%);
				width: 65ch;
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

		background-color: rgb(var(--color-mono-200));
		border-top: 1px solid var(--color-accent-edges-100);

		display: grid;

		padding: 0 2vw;

		grid-template: {
			columns: 2fr min-content 2fr;
			rows: 10vh;
			areas: 'social collapse author'
		}

		// border-bottom: 1px solid rgba(var(--color-mono-900), .25);

		@media screen and ( max-width: $mobile-breakpoint ) {

			padding: 2vh 0;
			row-gap: 2vh;

			justify-content: center;
			grid-template: {
				columns: 1fr;
				rows: auto;
				areas: 	'author'
								'social'
								'collapse'
			}

		}

		.active {

			background-color: rgb(var(--color-mono-900));
			color: rgb(var(--color-mono-300));

			i {
				fill: rgb(var(--color-mono-300));
			}

		}

		.disabled {
			pointer-events: none;
			opacity: .25;
		}

		&-social {

			@media screen and ( max-width: $mobile-breakpoint ) {
				place-self: center;
			}

			justify-self: start;
			align-self: center;
			
			grid: { 
				row: 		social; 
				column: social; 
			}

			column-gap: 2px;

			button {

				display: inline-flex;
				column-gap: 4px;

				@include push-button {

					background-color: transparent;
					color: rgb(var(--color-mono-900));

					transition-duration: 250ms;

					i {
						fill: rgb(var(--color-mono-900));
					}

					span {
						line-height: 21px;
						padding: 0 4px;
					}

				}
			}

		}
		
		&-collapse {

			@media screen and ( max-width: $mobile-breakpoint ) {
				place-self: center;
			}

			justify-self: center;
			align-self: center;
			
			grid: { 
				row: 		collapse; 
				column: collapse; 
			}

		}

		&-author {

			$iconSize: 100px;

			@media screen and ( max-width: $mobile-breakpoint ) {
				transform: unset;
				place-self: center;
			}

			z-index: 3;

			display: inline-grid;
			row-gap: 2vh;

			transform: translateY(calc((#{ $iconSize } - 10vh) - ($iconSize / 2)));

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
					color: rgb(var(--color-mono-900));
				}

				border: 4px solid var(--color-accent-edges-100);
				border-radius: 100%;

				height: $iconSize; 
				width: $iconSize;

				box-shadow: 0px 1vh 0px 0px rgba(var(--color-mono-000), .25);

			}

		}
	}
	&-content {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-mono-200));
		color: rgb(var(--color-mono-900));
		min-height: 50vh;
		padding: 5vh 3vw;

		display: grid;
		row-gap: 2vh;

		hr {
			width: 100%;
			background-color: rgb(var(--color-mono-400))
		}

		&-header {

			color: rgb(var(--color-mono-900));

			h4 {	
				font: {
					size: var(--font-size-36);
					weight: 900;
				}
			}

			h6 {
				font: {
					size: var(--font-size-18);
					weight: 800;
				}
			}

			span {

				font: {
					size: var(--font-size-14);
					weight: 700;
				}

				color: rgb(var(--color-mono-500));

			}

		}

		&-tags {

			h6 {
				margin-right: 1vw;
				font-weight: 800;
				font-size: var(--font-size-20);
			}

			display: inline-flex;
			align-items: baseline;
			column-gap: calc(min(5px, .5vw));
		}

		&-comments {
			place-self: center;
		}

	}
	&-comments {

		transition: border-radius 250ms ease-in-out;

		background-color: rgb(var(--color-mono-200));
		color: rgb(var(--color-mono-900));

		&-first {

			text-align: center;
			padding-block: 5vh 6vh;

			color: rgb(var(--color-mono-900));
			font: {
				size: var(--font-size-36);
				family: var(--decor-font);
				weight: 500;
			}

			border-bottom: 1px solid rgb(var(--color-mono-300));
			border-top: 1px solid rgb(var(--color-mono-300));

		}

		&-content {
			display: inline-grid;
			width: 100%;
			padding-inline: 2vh;
		}

		&-answer {
			border-top: 1px solid rgb(var(--color-mono-200));
			padding: 2vh 3vw 5vh;

			i {
				@include icon-size(10vh);
				margin-bottom: 1vh;
				fill: rgb(var(--color-mono-400))
			}

			h5 {
				color: rgb(var(--color-mono-900));
				font-size: var(--font-size-24);
				text-align: center;
				font-weight: 800;
			}
			p {
				white-space: pre-wrap;
				text-align: center;
				font-weight: 500;
				font-size: var(--font-size-16);
			}
			textarea {
				resize: none;
				display: block;
				width: 100%;
				height: 20vh;

				color: rgb(var(--color-mono-900));
				background-color: rgb(var(--color-mono-200));

				border: {
					style: solid;
					width: 2px;
					color: var(--color-accent-edges-100);
					radius: var(--border-radius);
				}

				padding: 15px 20px;
				font-size: 12px;
				transition-duration: 500ms;

				&:focus {
					outline: none;
					border: {
						color: var(--color-accent-edges-300);
					}
				}

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
	import Collapse 						from '~/components/common/Collapse.vue'
	import Popover 							from '~/components/common/Popover.vue'
	import Tag 									from '~/components/common/Tag.vue'
	import Icon									from '~/components/common/Icon.vue'
	import CommonButton 				from '~/components/buttons/CommonButton.vue'

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator 	from '~/components/functional/HardwareAcceleration.vue';
	import IntesectionComponent 					from '~/components/functional/intersectionComponent.vue'

	// ? С фильтрами происходит что-то не совсем ясное. 
	// ? Нормально работают в хроме, но лиса отказывается с ними адекватно дружить.

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

	// IMAGE PLACEHOLDER
	const PLACEHOLDER: IMAGE_URL = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	}

	const CHAR_LIMIT = 600;

	// VALIDATE REGULAR EXPRESSION
	const CYRILLIC_VALIDATION = helpers.regex('alpha', /^[а-яА-ЯЁё\n\t\s\w\W]*$/)

	// MODULE
	export default Vue.extend({
		components: {
			HardwareAccelerationDecorator,
			IntesectionComponent,
			Collapse,
			CommonButton,
			Popover,
			Tag,
			Icon,
			// DisplacementFilter,
			// NoiseFilter,
			CommentComponent: () => import('~/components/post/submodules/Comment.vue'),
			ContentComponent: () => import('~/components/post/submodules/Content.vue'),
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
			} as PropOptions<POST>,
			editContent: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {

				Cooled: undefined as undefined | boolean,

				ImageURL: PLACEHOLDER,

				AuthorInfo: new Object() as USER_STATE | null,

				Message: '',
				PreviosMessage: '',
				CharLimit: CHAR_LIMIT,

				ContentSection: false,
				CommentSection: false,

				prepareContent: false,

				PostDate: { Day: '', Time: '' } as FORMATED_DATE,

				Content: 	[] as POST_CONTENT[],
				Comments: {} as {[ID: string]: COMMENT},
				Likes: 		{} as {[ID: string]: LIKE},

				IntersectionAnimation: undefined as Animation | undefined

			}
		},
		async fetch() {

			this.PostDate = await this.GetLocalTime(this.payload.date);

			if ( process.server ) {
				await this.getAuthor();
			}

		},
		computed: {

			...mapState({
				LocalTime:		state => (state as VuexModules).LocalTime,
				UI:						state => (state as VuexModules).App.UI,
				LoginStatus: 	state => (state as VuexModules).Auth.Session.LoginStatus,
				StoreUser:		state => (state as VuexModules).User.State.UserState,
			}),

			charLimit(): number {
				return CHAR_LIMIT - this.Message.length
			},

			userLiked(): boolean {
				return Reflect.has(this.Likes, this.StoreUser.UserID);
			},

			sortedComments(): COMMENT[] {
				return Object.values(this.Comments || {}).sort((a, b) => a.Date - b.Date)
			}
			
		},
		watch: {
			'payload.image': {
				handler() {
					this.$nextTick().then(() => this.updateImage())
				},
			},
			Message: {
				handler(n: string, o: string) {
					this.playSound(this.Sounds.get(n.length > o.length ? 'Input::Increment' : 'Input::Decrement'));
				}
			},
			userLiked: {
				handler(value: boolean) {
					this.playSound(this.Sounds.get(value ? 'Switch::On' : 'Switch::Off'));
				}
			},
		},
		created() {

			if ( process.browser ) {
				
				const watchCooledStatus 	= this.$watch('Cooled', (status) => {
					if ( !status ) {

						this.listenDataSnapshots('Comments');
						this.listenDataSnapshots('Likes');

						this.updateImage(); 						
						this.getAuthor();
						
						watchCooledStatus(); console.debug('[Post]: watchCooledStatus | init')

					}
				}); 
	
				const watchCommentSection = this.$watch('CommentSection', () => {

					this.setSounds([
						{ file: 'Off', name: 'Input::Increment', settings: { rate: 0.65, volume: .25 } },
						{ file: 'Off', name: 'Input::Decrement', settings: { rate: 0.50, volume: .25 } },
					])
	
					watchCommentSection();

				});
	
				const watchPrepareContent = this.$watch('prepareContent', () => {
					this.listenDataSnapshots('Content'); watchPrepareContent();
				});

				const watchIntersection 	= this.$watch('IntersectionAnimation', () => {
					this.IntersectionAnimation!.reverse(); watchIntersection();
				})

			}

		},
		mounted() {

			if ( process.browser ) {

				this.initCooler(this.$el, (cooled: boolean) => {
					this.Cooled = cooled
				});

				this.IntersectionAnimation = (this.$refs.post as HTMLElement).animate([
					{ opacity: 0 },
					{ opacity: 1 }
				], {
					easing: 'ease-in-out',
					duration: 1000,
					fill: "both",
				})

				this.setSounds([
					{ file: 'Off', 	name: 'Element::Action', settings: { rate: 0.50 } },
				]);
		
				this.setSounds([
					{ file: 'Tap', 	name: 'Switch::On',		settings: { rate: 1.00, volume: 0.25 } },
					{ file: 'Tap', 	name: 'Switch::Off',	settings: { rate: 0.50, volume: 0.25 } },
				]);

			}

		},
		validations: {
			Message: {
				required, 
				CYRILLIC_VALIDATION,
				minLength: minLength(6),
				maxLength: maxLength(CHAR_LIMIT),
			}
		},
		methods: {

			...mapActions({
				GetLocalTime: 'GetLocalTime',
				getImageURL: 	'Images/getImageURL',
				decodeImage:  'Images/decodeImage',
			}),
			
			getAuthor(): Promise<void> {

				return new Promise((resolve) => {

					firebase.database()
						.ref(`Users/${ this.payload.authorID }/state`)
						.on('value', (snapshot) => {
							this.AuthorInfo = snapshot.val() as USER_STATE; resolve()
						})

				})

			},

			listenDataSnapshots(section: SECTIONS) {

				firebase.database()
					.ref(`Posts/PostID-${ this.payload.ID }/${ section.toLowerCase() }`)
					.on('value', (data) => {
						this[section] = data.val(); console.debug(`[Post]: listenDataSnapshots | ${ section }`)
					})

			}, 

			toggleSection(status: boolean, section: 'ContentSection' | 'CommentSection'): void {

				this[section] = status;

				this.playSound(this.Sounds.get(status ? 'Switch::On' : 'Switch::Off'));

			},

			async updateImage(width?: number): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.ImageHolder as HTMLElement

				const URL: IMAGE_URL = await this.getImageURL({ 
					_path: this.payload.image,
					_size: width || IMAGE_CONTAINER.offsetWidth * window.devicePixelRatio
				})

				if ( this.BROWSER && this.$PIXI.utils.isWebGLSupported() ) {
					this.prepareAnimations(IMAGE_CONTAINER, URL)
				} else {
					this.ImageURL = URL;
				}

			},

			animateIntersection(intersection: boolean) {
				if ( this.IntersectionAnimation ) {

					this.IntersectionAnimation.cancel(); 
					this.IntersectionAnimation.updatePlaybackRate(intersection ? 1 : -1); 
					this.IntersectionAnimation.play();

				}
			},

			prepareAnimations(el: Element, url: IMAGE_URL) {

				const animationFn = (_direction: DirectionOptions, callback?: AnimeCallBack ) => {
					this.$AnimeJS({

						targets: el,
						opacity: [1, 0],
						duration: 250,
						direction: _direction,
						easing: 'linear',

						...callback

					})
				}

				animationFn('normal', {
					complete: () => { 
						this.ImageURL = url; this.decodeImage(url).then(() => animationFn('reverse'))
					}
				})

			},

			sendComment(): void {

				if ( !this.$v.Message.$anyError && this.LoginStatus && this.PreviosMessage !== this.Message ) {

					this.PreviosMessage = this.Message;

					const HASH = this.HashGenerator()

					const COMMENT: COMMENT = {
						ID: HASH,
						Date: Date.now(),
						Comment : this.Message,
						UserID: this.StoreUser.UserID,
					}
	
					firebase.database()
						.ref(`Posts/PostID-${ this.payload.ID }/comments/Hash-${ HASH }`)
						.set(COMMENT)
						.then(() => { this.Message = '' })

				}

			},

			sendLike(): void {

				const REFERENCE = firebase.database().ref(`Posts/PostID-${ this.payload.ID }/likes/${ this.StoreUser.UserID }`)

				if ( this.userLiked && this.LoginStatus ) {

					REFERENCE.remove();

				} else {

					REFERENCE.set({
						hash: this.HashGenerator()
					});

				}

			},

		}
	})

</script>
