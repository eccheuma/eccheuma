<template>
	<div class="post-comment-item">

		<section class="post-comment-item-icon">
			<i class="m-auto post_comment-icon" :style="`background-image: url(${ Author.UserImageID })`" />
		</section>

		<section class="post-comment-item-author">
			<span>{{ Author.UserName }}</span>
			<span>
				{{ DateOfComment.Day }} в {{ DateOfComment.Time }}
			</span>
			<hr>
		</section>

		<section class="post-comment-item-content">
			<p>{{ Comment.Comment }}</p>
			
			<template v-if="LoginStatus">
				<span class="mx-auto" v-if="UserState.UserID === Author.UserID" @click="RemoveComment">
					Удалить комментарий
				</span>
			</template>
		</section>

	</div>
</template>

<style lang="scss">

.post-comment-item {

	@media screen and ( max-width: $MobileBreakPoint ) {
		
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
	border-bottom: 1px solid $color6;

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
	
			border: 4px solid $color5;
			box-shadow: 0px 1vh 0px 0px $color6;
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

			background-color: $color6;
			width: 50%;
			margin: 1vh 0;

			@media screen and ( max-width: $MobileBreakPoint ) {
				margin: 1vh auto;
			}

		}

		span {
			font-weight: 700;
			display: block;
			&:nth-of-type(1) {
				font-size: $FontSize3;
				color: $color3;
			}
			&:nth-of-type(2) {
				color: $color4;
				font-size: $FontSize4;
			}
		}

		@media screen and ( max-width: $MobileBreakPoint ) {
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
			font-size: $FontSize2;
			font-family: $second-font;
			color: $color2;

			@media screen and ( max-width: $MobileBreakPoint ) {
				padding: 0 5vw;
			}

		}
	}



}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// FIREBASE
	import firebase from "firebase/app"
	import "firebase/database"

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
			PostID: {
				required: true,
			} as PropOptions<POST['ID']>,
			UserID: {
				required: true,
			} as PropOptions<USER_STATE['UserID']>,
			CommentID: {
				required: true,
			} as PropOptions<string>,
			ModerationMode: {
				required: true,
			} as PropOptions<boolean>,
		},
		data() {
			return {

				Ready: false,

				DateOfComment: { Day: '', Time: '' } as FORMATED_DATE,

				Author: 	new Object() as USER_STATE,
				Comment: 	new Object() as COMMENT,

			}
		},
		watch: {
			Comment: {
				async handler() {
					this.DateOfComment = await this.GetLocalTime(this.Comment.Date)
				}
			}
		},
		computed: {

			...mapState({
				LoginStatus:	state => (state as VuexModules).Auth.Auth.LoginStatus,
				UserState: 		state => (state as VuexModules).User.State.UserState 
			}),

		},
		methods: {

			...mapActions({
				GetLocalTime: 'GetLocalTime'
			}),

			TEST(a: boolean): number {

				if(a) {
					return 6
				} else {
					return 8
				}

			},

			RemoveComment() {
				firebase.database()
					.ref(`Posts/PostID-${ this.PostID }/comments/Hash-${ this.CommentID }`)
					.remove()
			}

		},
		created() {

			firebase.database()
				.ref(`Users/${ this.UserID }/state`)	
				.on('value', data => {
					this.Author = data.val()
				});

			firebase.database()
				.ref(`Posts/PostID-${ this.PostID }/comments/Hash-${ this.CommentID }`)	
				.on('value', data => {
					this.Comment = data.val(); this.Ready = true
				});

		},
	})

</script>