<template>
	<div v-if="Object.keys(RecivedData).length " :id="`HASH-${ commentID }`" class="post-comment-item">

		<section class="post-comment-item-icon">
			<i class="post_comment-icon" :style="`background-image: url(${ Author.UserImageID })`" />
		</section>

		<section class="post-comment-item-author">
			<span>{{ Author.UserName }}</span>
			<span>
				{{ DateOfComment.Day }} в {{ DateOfComment.Time }}
			</span>
			<hr>
		</section>

		<section class="post-comment-item-content">
			<p>{{ RecivedData.Comment }}</p>
			
			<template v-if="LoginStatus">
				<button v-if="UserState.UserID === Author.UserID" @click="RemoveComment">
					Удалить комментарий
				</button>
			</template>
		</section>

	</div>
</template>

<style lang="scss">

.post-comment-item {

	@media screen and ( max-width: var(--mobile-breakpoint)) {
		
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

	padding: 2vh 3vw;
	margin: { bottom: 2vh };
	border-bottom: 1px solid rgb(var(--color-5));

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

			$s: 80px;

			display: block;

			width: $s; height: $s;
	
			background: {
				size: cover;
				position: center;
				repeat: 	no-repeat;
			}
	
			border: 4px solid rgb(var(--color-6));
			box-shadow: 0px 1vh 0px 0px rgb(var(--color-5));
			border-radius: 100%;
		}

	}

	&-author {

		grid: { 
			row: 		author; 
			column: author; 
		}

		align-self: center;

		padding-bottom: 1vh;

		hr {

			background-color: rgb(var(--color-5));
			width: 50%;
			margin: 1vh 0;

			@media screen and ( max-width: var(--mobile-breakpoint)) {
				margin: 1vh auto;
			}

		}

		span {
			font-weight: 700;
			display: block;
			&:nth-of-type(1) {
				font-size: var(--font-size-3);
				color: rgb(var(--color-3));
			}
			&:nth-of-type(2) {
				color: rgb(var(--color-4));
				font-size: var(--font-size-4);
			}
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {
			text-align: center;
		}

	}

	&-content {
		grid: { 
			row: 		content; 
			column: content; 
		}

		p {
			font-weight: 500;
			font-size: var(--font-size-3);
			font-family: var(--second-font);
			color: rgb(var(--color-2));

			@media screen and ( max-width: var(--mobile-breakpoint)) {
				padding: 0 5vw;
			}

		}

		button {
			@include push-button {
				background-color: transparent;
				padding: 3px 20px;
				float: right;
				margin: 0;
			};
		}

	}

}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
	import { mapActions, mapState } from 'vuex'
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES
	import type { COMMENT, POST } 	from '~/types/Post.ts'
	import type { USER_STATE }			from '~/types/User.ts'			
	import type { FORMATED_DATE } 		from '~/store'

	// MODULE
	export default Vue.extend({
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

			}

		},
	})

</script>
