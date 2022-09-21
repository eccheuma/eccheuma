<template>
	<div 
		:id="`HASH-${ commentID }`" 
		class="post-comment-item" 
		@click="pickUser"
		:style="`
			--t: ${ Math.trunc(Math.random() * 100) }%; 
			--l: ${ Math.trunc(Math.random() * 100) }%;
		`.trim()"
		>
		
		<section class="post-comment-item-icon">
			<i class="post_comment-icon" :style="`background-image: url(${ author.UserImageID })`" />
		</section>

		<section class="post-comment-item-author">
			<span>{{ author.UserName }}</span>
			<span>
				{{ localeDate.Day }} в {{ localeDate.Time }}
			</span>
		</section>

		<section class="post-comment-item-content">
			<hr v-once>
			<p>
				<span v-if="answerTo.length">
					Ответ для: <strong v-for="user in answerTo" :key="user">{{ user }}</strong>
				</span>
				{{ comment.data }}
			</p>
			<hr v-once>
			<common-button v-if="LoginStatus && canDelete" @click.native="RemoveComment">
				Удалить комментарий 
				<template v-if="State.UserStatus === roles.Admin">
					от лица администратора
				</template>
				<template v-if="State.UserStatus === roles.Moderator">
					от лица модератора
				</template>
			</common-button>
		</section>

	</div>
</template>

<style lang="scss">

.post-comment-item {

	@include component-shadow;
	@include gradient-border;

	@extend %pattern-lines;

	@media screen and ( max-width: $mobile-breakpoint ) {
		
		row-gap: 2vh;

		grid-template: {
			columns: 1fr;
			areas: 	'icon'
							'author'
							'content'
		}

	}

	display: grid;

	min-height: 20vh;

	padding: 5vh 2vw;
	margin: { bottom: 2vh };

	border-radius: var(--border-radius);
	background-color: rgb(var(--color-mono-300));

	grid-template: {
		columns: auto 1fr;
		areas: 	'icon author'
						'icon content'
	}

	column-gap: 2vw;
	overflow: hidden;

	&::after {

		--s: 800px;

		content: '';
		pointer-events: none;

		position: absolute;
		top: calc(var(--t, 0) - (var(--s) / 2));
		left: calc(var(--l, 0) - (var(--s) / 2));

		width: var(--s);
		aspect-ratio: 1/1;

		border: 2px dashed var(--color-accent-edges-100);
		border-radius: 100%;
		z-index: -1;

		animation: rotateCircle 5s infinite;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
		animation-play-state: paused;
		@keyframes rotateCircle {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(10deg);
			}
		}

	}

	transition-duration: 250ms;
	&:hover {

		transform: translate(0, 1vh);
		box-shadow: unset;

		&:after {
			animation-play-state: running;
		}
	}

	&-icon {

		grid: { 
			row: 		icon; 
			column: icon; 
		}

		i {

			display: block;

			width: 100px; 
			aspect-ratio: 1/1;			
	
			background: {
				size: cover;
				position: center;
				repeat: 	no-repeat;
			}
	
			border: 2px solid var(--color-accent-edges-200);
			// box-shadow: 0px 1vh 0px 0px rgb(var(--color-mono-900));
			border-radius: 100%;

			@media screen and ( max-width: $mobile-breakpoint ) {
				margin: 0 auto;
			}

		}

	}

	&-author {

		grid: { 
			row: 		author; 
			column: author; 
		}

		align-self: center;

		hr {

			background-color: rgb(var(--color-mono-200));
			width: 50%;
			margin: 1vh 0;

			@media screen and ( max-width: $mobile-breakpoint ) {
				margin: 1vh auto;
			}

		}

		span {
			display: block;
			&:nth-of-type(1) {
				font-size: var(--font-size-20);
				font-weight: 800;
				color: rgb(var(--color-mono-900));
			}
			&:nth-of-type(2) {
				font-size: var(--font-size-14);
				font-weight: 600;
				color: rgb(var(--color-mono-800));
			}
		}

		@media screen and ( max-width: $mobile-breakpoint ) {
			text-align: center;
		}

	}

	&-content {
		grid: { 
			row: 		content; 
			column: content; 
		}

		hr {
			background-color: rgb(var(--color-mono-400));
			margin: 1vh 0;
		}

		p {

			line-height: 2.5vh;
			color: rgb(var(--color-mono-800));
			font: {
				size: var(--font-size-18);
				family: var(--read-font);
				weight: 300;
			}

			width: clamp(30ch, 65ch, 100%);

			// MOBILE
			@media screen and ( max-width: $mobile-breakpoint ) {
				padding: 0 4vw;
			}

			span {
				display: block;
				color: rgb(var(--color-mono-600));
				font-size: var(--font-size-16);
				font-weight: 800;
				margin-bottom: 1vh;

				strong {
					color: var(--color-accent-link);
					text-decoration: underline;
					margin-right: 4px;
				}

			}

		}

	}

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// VUEX
	import { mapState } from 'vuex';

	// API
	import { database } from '~/api/database';

	// UTILS
	import { utils } from '~/utils';

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// NAMESPACES
	import { Post } from '~/types/Post';
	import { User }	from '~/types/User';	

	// TYPES
	import type { VuexMap } from '~/types/VuexMap';

	// COMPONENTS
	import CommonButton from '~/components/buttons/CommonButton.vue';

	// MODULE
	export default Vue.extend({
		components: {
			CommonButton
		},
		mixins: [ EmitSound ],
		props: {
			postID: {
				type: Number,
				required: true,
			} as PropOptions<Post.struct['ID']>,
			userID: {
				type: String,
				required: true,
			} as PropOptions<User.struct['UserID']>,
			commentID: {
				type: String,
				required: true,
			} as PropOptions<string>,
			moderationMode: {
				type: Boolean,
				required: false,
				default: false,
			} as PropOptions<boolean>,
		},
		data() {
			return {

				localeDate: utils.getLocalTime(0),

				author: new Object() as User.struct,
				comment: new Object() as Post.comment,

				answerTo: Array<User.struct['UserName']>(),

				roles: User.status,

			};
		},
		computed: {

			...mapState({
				LoginStatus	:	state => (state as VuexMap).Auth.Session.LoginStatus,
				State				: state => (state as VuexMap).User.State.State 
			}),

			canDelete(): boolean {

				if ( !this.LoginStatus ) return false;

				switch (this.State.UserStatus) {

					case User.status.Admin: 
						return true;
					case User.status.Moderator: 
						return true;
					default:
						return this.State.UserID === this.comment.userID;

				}

			}

		},
		created() {
			
			if ( process.browser ) {
				this.setSounds([
					{ file: 'Tap', name: 'Element::Action', settings: { rate: 0.50 } }
				]);
			}
			
		},
		async mounted() {

			this.author 	= await database.get(`Users/${ this.userID }/state`);
			this.comment 	= await database.get(`Posts/PostID-${ this.postID }/comments/Hash-${ this.commentID }`);
			this.answerTo = await this.taggedUser();

			this.localeDate = utils.getLocalTime(this.comment.date);

		},
		methods: {

			async RemoveComment() {

				await database.remove(`Posts/PostID-${ this.postID }/comments/Hash-${ this.commentID }`);

				this.playSound(this.Sounds.get('Element::Action'));

			},

			pickUser() {

				this.$emit('picked-user', this.author);

			},

			async taggedUser(): Promise<Array<User.struct['UserName']>> {

				const users = await database.get<utils.types.asIterableObject<User.state>>('Users');

				if ( !this.comment.mention ) return [];

				return Object.values(users).filter(user => {
					return this.comment.mention?.some(id => id === user.state.UserID);
				}).map(user => user.state.UserName);

			}

		},
	});

</script>
