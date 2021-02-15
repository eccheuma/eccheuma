<template>
	<transition name="Notification">
		<section class="fluid-container px-lg-5 px-0 notification" ref="NotificationNode" v-if="Notification.status">
			<div class="row px-4 py-3 justify-content-center">
				<div class="notification_icon col-auto py-lg-0 py-3">
					<i class="fas fa-exclamation"></i>
					<i class="fas fa-exclamation"></i>
				</div>
				<div class="notification_text col-lg col-12 py-lg-0 py-3">
					<span>{{ Notification.content.message }}</span>
					<span>{{ Notification.content.description }}</span>
					<template v-if="Notification.content.link">
						<a :href="Notification.content.link">
							Подробнее тут.
						</a>
					</template>
				</div>
				<div class="notification_button col-lg-3 col-12 py-lg-0 py-3">
					<!-- <p @click="TEST = !TEST">Скрыть уведомление</p> -->
					<p @click="ChangeNotificationState(!Notification.status)">Скрыть уведомление</p>
				</div>
			</div>
		</section>
	</transition>
</template>

<script lang="ts">

	import Vue from 'vue'

	import { mapMutations, mapState } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	export default Vue.extend({
		computed: {
			...mapState({
				Notification: ( state: any ) => ( state as VuexModules ).Notification
			}),
		},
		methods: {
			...mapMutations({
				ChangeNotificationState: 'Notification/Change_Status' 
			})
		}
	})

</script>

<style lang="sass" scoped>

.Notification
	&-enter
		filter: opacity(0)
		&-active
			filter: opacity(0)
			transform: translateY(-80px)
			transition: all .75s ease
		&-to
			filter: opacity(1)
			transform: translateY(0px)
	&-leave
		filter: opacity(1)
		&-active
			filter: opacity(0)
			transform: translateY(0)
			transition: all .75s ease
		&-to
			filter: opacity(0)
			transform: translateY(-80px)

.notification
	position: fixed
	overflow: hidden
	top: 0px
	width: 100vw
	z-index: 2050
	min-height: 80px
	border-bottom: 1px solid $color2
	background-color: $color1
	@extend %gradient_border

.notification 
	&_text 
		display: block
		margin: auto 0
		color: $color5
		font-weight: 700
		font-size: 12px
		span
			display: block
			&:nth-child(1)
				font-size: 14px
				color: $color6
			&:nth-child(2)
				font-weight: 400
				color: rgba($color6,.75)
		a 
			opacity: 0.5
			color: #29B6F6
			transition-duration: 0.25s
			&:hover 
				text-decoration: none
				opacity: 1   
	&_icon 
		position: relative
		margin: auto
		i 
			&:nth-child(1) 
				padding: 15px 19px
				border-radius: 2rem
				background-color: $color2
				border: 2px solid $color3
				color: $color4
				font-size: 13px 
				animation: NotificationFlicker 3s infinite alternate
				will-change: border, color 
				@keyframes NotificationFlicker
					0%
						border: 2px solid $color3
						color: $color4
					100% 
						border: 2px solid $color5
						color: $color5
			&:nth-child(2) 
				position: absolute
				font-size: 120px
				top: -25px
				left: -30px
				color: $color4
				opacity: .1
				transform: translateY(-10px) scale(1) rotate(30deg)
				z-index: -1
				animation: NotificationSpan 3s infinite alternate
				@keyframes NotificationSpan
					0%
						opacity: 0
						transform: translateY(-10px) scale(1) rotate(30deg)
					100% 
						opacity: .1
						transform: translateY(-10px) scale(1.25) rotate(45deg)
	&_button 
		margin: auto 0
		p 
			padding: 0 0
			line-height: 30px
			font-size: 10px
			cursor: pointer
			margin: auto
			text-align: center
			@extend %button_light   

</style>