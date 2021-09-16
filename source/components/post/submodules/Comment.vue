<template>
	<div 
		v-if="Object.keys(RecivedData).length " 
		:id="`HASH-${ commentID }`" 
		class="post-comment-item" 
		:style="`
			--t: ${ Math.trunc(Math.random() * 100) }%; 
			--l:${ Math.trunc(Math.random() * 100) }%;
		`.trim()"
		>

		<section class="post-comment-item-icon">
			<i class="post_comment-icon" :style="`background-image: url(${ Author.UserImageID })`" />
		</section>

		<section class="post-comment-item-author">
			<span>{{ Author.UserName }}</span>
			<span>
				{{ DateOfComment.Day }} в {{ DateOfComment.Time }}
			</span>
		</section>

		<section class="post-comment-item-content">
			<hr v-once>
			<p>{{ RecivedData.Comment }}</p>
			<hr v-once>
			<template v-if="LoginStatus" v-once>
				<common-button v-if="UserState.UserID === Author.UserID" @click.native="RemoveComment">
					Удалить комментарий
				</common-button>
			</template>
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
		}

		p {

			line-height: 2.5vh;
			color: rgb(var(--color-mono-900));
			font: {
				size: var(--font-size-18);
				family: var(--read-font);
				weight: 500;
			}

			width: clamp(30ch, 65ch, 100%);

			// MOBILE
			@media screen and ( max-width: $mobile-breakpoint ) {
				padding: 0 4vw;
			}

		}

	}

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// FIREBASE
	import firebase from 'firebase/app';
	import 'firebase/database';

	// VUEX
	import { mapActions, mapState } from 'vuex';

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// TYPES
	import type { VuexModules } 			from '~/typescript/VuexModules';

	import type { COMMENT, POST } 		from '~/typescript/Post';
	import type { USER_STATE }				from '~/typescript/User';		
	import type { FORMATED_DATE } 		from '~/store';

	// COMPONENTS
	// import Tag from '~/components/common/Tag.vue'
	// import EccheumaButton 	from '~/components/common/EccheumaButton.vue'
	import CommonButton 			from '~/components/buttons/CommonButton.vue'

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
			} as PropOptions<POST['ID']>,
			userID: {
				type: String,
				required: true,
			} as PropOptions<USER_STATE['UserID']>,
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

				DateOfComment: { Day: '', Time: '' } as FORMATED_DATE,

				Author: 	new Object() as USER_STATE,
				RecivedData: new Object() as COMMENT,

			}
		},
		computed: {

			...mapState({
				LoginStatus:	state => (state as VuexModules).Auth.Session.LoginStatus,
				UserState: 		state => (state as VuexModules).User.State.UserState 
			}),

		},
		async created() {

			if ( process.browser ) {
				this.setSounds([
					{ file: 'Tap', name: 'Element::Action', settings: { rate: 0.50 } }
				])
			}

			firebase.database()
				.ref(`Users/${ this.userID }/state`)	
				.on('value', (data) => {
					this.Author = data.val()
				});

			firebase.database()
				.ref(`Posts/PostID-${ this.postID }/comments/Hash-${ this.commentID }`)	
				.on('value', (data) => {
					this.RecivedData = data.val();
				});

			this.DateOfComment = await this.GetLocalTime(this.RecivedData.Date)

		},
		methods: {

			...mapActions({
				GetLocalTime: 'GetLocalTime'
			}),

			RemoveComment() {

				firebase.database()
					.ref(`Posts/PostID-${ this.postID }/comments/Hash-${ this.commentID }`)
					.remove()
					.then(() => this.playSound(this.Sounds.get('Element::Action')))

			}

		},
	})

</script>
