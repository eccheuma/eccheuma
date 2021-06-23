<template>
	<header class="header_top-container">

		<section>
			<span>Eccheuma</span>
			<span>Ryova Graphical & Web Design</span>
		</section>

		<svg @click="GoToHoll" viewBox="0 0 157 24" :fill="!$isMobile ? `none` : `#333`">
			<path 
				ref="HDLP" 
				d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
				stroke="#333" 
			/>
		</svg>

		<button
			v-if="LoginStatus == true && !$isMobile" 
			@mouseenter="Notification = false" 
			@click="ToggleProfileArea"
		> 
		
			<span> Личный кабинет </span>

			<i />

		</button>

	</header>
</template>

<script lang="ts">

	import Vue from 'vue'

	import { mapState, mapMutations } from 'vuex'

	export default Vue.extend({
		data() {
			return {
				Notification: true
			}
		},
		computed: {
			...mapState({
				isDesktop: 		( state: any ): boolean => state.isDesktop,
				LoginStatus: 	( state: any ): boolean => state.Auth.Auth.LoginStatus,
				NewMessages: 	( state: any ): number 	=> state.User.Messages.NewMessages,
			})
		},
		methods: {
			...mapMutations({
				ToggleProfileArea: 'User/State/Toggle_UserProfileArea'
			}),
			GoToHoll() {
				this.$router.push({ path: `/` })
			},
			AnimateLogo() {

				this.$AnimeJS({
					targets: this.$refs.HDLP,
					strokeDashoffset: [this.$AnimeJS.setDashoffset , 0],
					fill: [
						{ value: '#333', duration: 2500, delay: 1500, endDelay: 5000, }
					],
					delay: 1000,
					duration: 3000,
					easing: 'easeInOutSine',
					direction: 'alternate',
					loop: true
				});

			},
		},
		mounted() {

			if ( !this.$isMobile ) {
				this.AnimateLogo()
			}

		}
	})
</script>

<style lang="scss">

.header_top-container {
	display: grid;
	padding: 1vh 4vw;
	grid-template-columns: repeat(3, 1fr); 
	background-color: rgb(var(--color-1));
	align-items: center;
	section {
		@media screen and ( max-width: $mobile-breakpoint ) {
			display: none;
		}
		span {
			display: block; text-transform: uppercase;
			&:nth-child(1) {
				color: rgb(var(--color-6)); font-weight: 800; letter-spacing: 3px; font-size: .6rem
			}
			&:nth-child(2) {
				color: rgb(var(--color-5)); font-weight: 700; letter-spacing: 1px; font-size: .45rem
			}
		}
	}
	svg {
		height: 33%;
		cursor: pointer;
		grid-column: 2/3;
		transition-duration: .5s;
		margin: auto;
		&:hover {
			transform: scale(.85);
		}
	}
	button {
		@extend %button_black;
		display: grid; padding: 4px 5%; margin: 0 10px;
		grid-template-columns: 3fr 1fr;
		justify-self: end;
		span {
			color: rgb(var(--color-4)); font-size: 10px; line-height: 15px;
		}
		i {
			$s: 7px;
			height: $s; width: $s;
			justify-self: end;
			align-self: center;
			background-color: rgb(var(--color-5));
			border-radius: 100%;
			animation: MessageNotificationSpan 1s infinite alternate;
			@keyframes MessageNotificationSpan {
				0% {
					opacity: 0
				}
				100% {
					opacity: 1;
					box-shadow: 0px 0px 6px 0px rgb(var(--color-5));
				}
			}
		}
	}
}

</style>