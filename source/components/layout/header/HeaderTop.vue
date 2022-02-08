<template>
	<header class="header_top-container">

		<section v-once>
			<span>Eccheuma</span>
			<span>Веб-дизайн с русским духом</span>
		</section>

		<svg v-once viewBox="0 0 157 24" :fill="!$isMobile ? `none` : `#333`" @click="GoToHoll">
			<path 
				ref="HDLP" 
				d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
				stroke="#333" 
			/>
		</svg>

		<eccheuma-button
			v-if="LoginStatus == true && !$isMobile"
			scheme="dark"
			:indicator="Notification"
			@mouseenter.native="Notification = false"
			@click.native="ToggleProfileArea"  
		>
			Личный кабинет
		</eccheuma-button>

	</header>
</template>

<script lang="ts">

	import Vue from 'vue'

	import { mapState, mapMutations } from 'vuex'

	// COMPONENTS
	import EccheumaButton		from '~/components/buttons/CommonButton.vue'

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaButton
		},
		data() {
			return {
				Notification: true
			}
		},
		computed: {
			...mapState({
				isDesktop: 		( state: any ): boolean => state.isDesktop,
				LoginStatus: 	( state: any ): boolean => state.Auth.Session.LoginStatus,
				NewMessages: 	( state: any ): number 	=> state.User.Messages.NewMessages,
			})
		},
		mounted() {

			if ( !this.$isMobile ) {
				this.AnimateLogo()
			}

		},
		methods: {
			...mapMutations({
				ToggleProfileArea: 'User/State/Toggle_UserProfileArea'
			}),
			GoToHoll() {
				this.$router.push({ path: '/' })
			},
			AnimateLogo() {

				this.$AnimeJS({
					targets: this.$refs.HDLP,
					strokeDashoffset: [this.$AnimeJS.setDashoffset, 0],
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
	})
</script>

<style lang="scss">

.header_top-container {
	display: grid;
	padding: 1vh 4vw;
	grid-template-columns: repeat(3, 1fr); 
	background-color: rgb(var(--color-mono-200));
	align-items: center;
	section {
		@media screen and ( max-width: $mobile-breakpoint ) {
			display: none;
		}
		span {
			display: block; text-transform: uppercase;
			&:nth-child(1) {
				color: rgb(var(--color-mono-900));
				font-weight: 500;
				letter-spacing: .15ch;
				font-size: var(--font-size-36);
				font-family: var(--decor-font);
				line-height: var(--size-42);
				margin-top: -0.5vh;
			}
			&:nth-child(2) {
				color: rgb(var(--color-mono-900)); font-weight: 700; letter-spacing: 1px; font-size: .45rem
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
		width: min-content;
		justify-self: right;
	}
}

</style>
