<template>
	<div v-if="Object.keys(RecivedData).length " :id="`HASH-${ commentID }`" class="post-comment-item pattern_bg">

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
			<hr>
			<p>{{ RecivedData.Comment }}</p>
			<hr>
			<template v-if="LoginStatus">
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

	border-radius: .7rem;
	background-color: rgb(var(--color-mono-300));

	grid-template: {
		columns: auto 1fr;
		areas: 	'icon author'
						'icon content'
	}

	column-gap: 2vw;

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
	
			border: 4px solid rgb(var(--color-mono-200));
			// box-shadow: 0px 1vh 0px 0px rgb(var(--color-mono-800));
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
				font-size: var(--font-size-18);
				font-weight: 800;
				color: rgb(var(--color-mono-800));
			}
			&:nth-of-type(2) {
				font-size: var(--font-size-18);
				font-weight: 600;
				color: rgb(var(--color-mono-600));
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
			color: rgb(var(--color-mono-800));
			font: {
				size: 	var(--font-size-18);
				family: var(--read-font);
				weight: 500;
			}

			width: 65ch;

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
				LoginStatus:	state => (state as VuexModules).Auth.Auth.LoginStatus,
				UserState: 		state => (state as VuexModules).User.State.UserState 
			}),

		},
		async created() {

			this.setSounds([
				{
					file: 'Tap',
					name: 'SendComment',
					settings: { rate: .33, volume: .25 },
				}
			])

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
					.then(() => this.playSound(this.Sounds.get('SendComment')))

			}

		},
	})

</script>
