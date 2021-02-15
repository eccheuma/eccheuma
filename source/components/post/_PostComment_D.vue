<template>
	<section class="container post_comment pt-4">
		<transition-group name="Fade" mode="in-out">
			<template v-if="Ready">
				<div class="row no-gutters" :key="`${ UserID }-${ DateOfComment.Time }`">
					<div class="col-lg-auto d-flex mx-lg-4 my-lg-0 my-3 pr-lg-2 ">
						<i class="m-auto post_comment-icon" :style="`background-image: url(${ Author.UserImageID })`" />
					</div>
					<div class="col">
						<div class="post_comment-header">
							<span>{{ Author.UserName }}</span>
							<span>{{ DateOfComment.Day }} в {{ DateOfComment.Time }}</span>
							<hr class="w-lg-25 w-100 text-left my-3 ml-0">
						</div>	
						<div class="post_comment-body">
							<p class="pb-4 pr-lg-4 pl-2 w-lg-75 w-100 text-left">
								{{ Comment.Comment }}
							</p>
							<div class="row justify-content-end px-5 pb-3">
								<div class="col-auto">
									<template v-if="LoginStatus">
										<span class="mx-auto" v-if="UserState.UserID === Author.UserID || ModerationMode" @click="RemoveComment">
											Удалить комментарий
										</span>
									</template>
								</div>
							</div>
						</div>
					</div>
					<hr>
				</div>
			</template>
		</transition-group>
	</section>
</template>

<style lang="sass" scoped>

.post_comment
	color: $color1
	background-color: $color5
	animation: opacity .75s 1 
		animation: opacity .75s 1 
	animation: opacity .75s 1 
	@keyframes opacity
		0%
			opacity: 0
		100% 
			100% 
		100% 
			opacity: 1
	&-header
		span
			font-weight: 700
			display: block
			&:nth-of-type(1)
				font-size: $FontSize3
				color: $color3
			&:nth-of-type(2)
				color: $color4
				font-size: $FontSize4
	&-body
		p
			font-weight: 500
			font-size: $FontSize2
			font-family: $second-font
			color: $color2
		span
			padding: 6px 25px
			margin: 0px 2px
			border-radius: .7rem
			color: $color3
			font-size: $FontSize4
			font-weight: 700
			transition-duration: .2s
			@extend %button_switch
	&-icon
		display: inline-block
		background-size: cover
		background-position: center
		border: 4px solid $color5
		box-shadow: 0px 1vh 0px 0px $color6
		border-radius: 100%
		padding: 20px					
		height: 80px
		width: 80px

</style>

<script lang="ts">

	import Vue from 'vue'

	// FIREBASE
	import firebase from "firebase/app"
	import "firebase/database"

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// TYPES
	import type { VuexModules } from '~/types/VuexModules'
	import type { COMMENT } 		from '~/types/Post'

	// MODULE
	export default Vue.extend({
		props: [
			'PostID',
			'CommentID',
			'UserID',
			'ModerationMode'
		],
		data() {
			return {

				Ready: false,

				DateOfComment: {
					Day: '',
					Time: '',
				},

				Author: 	new Object() as VuexModules['User']['State']['UserState'],
				Comment: new Object() as COMMENT
			}
		},
		watch: {
			DBComment: {
				async handler() {
					this.DateOfComment = await this.GetLocalTime(this.Comment.Date)
				}
			}
		},
		computed: {
			...mapState({
				LoginStatus:	( state: any ) => (state as VuexModules).Auth.Auth.LoginStatus,
				UserState: 		( state: any ) => (state as VuexModules).User.State.UserState 
			}),
		},
		methods: {
			...mapActions({
				GetLocalTime: 'GetLocalTime'
			}),
			RemoveComment() {
				firebase.database()
					.ref(`Posts/PostID-${ this.PostID }/comments/Hash-${ this.CommentID }`)
					.remove()
			}
		},
		mounted() {

			firebase.database()
				.ref(`Users/${ this.UserID }/state`)	
				.on('value', data => {
					this.Author = data.val()
				});

			firebase.database()
				.ref(`Posts/PostID-${ this.PostID }/comments/Hash-${ this.CommentID }`)	
				.on('value', data => {
					this.Comment = data.val();
				});

			this.Ready = true

		}
	})

</script>