<template>
	<eccheuma-layout key="Application" ref="ApplicationNode" :class="`ui-theme-${ UI }`">

		<section class="fixed-node">

			<page-loader />

			<notification />

			<client-only>
		
				<portal-target name="Modal" :transition="MIXIN_Transition('opacity-transition')" slim />

				<registration />

				<vk-messages />

			</client-only>

		</section>

		<header-top />

		<header-carousel />

		<header-navigation :search="true" :background="true" />

		<section class="content-wrapper">

			<scroll-bar v-if="!$isMobile" />

			<nuxt keep-alive :keep-alive-props="{ max: 2 }" class="content-container" />

		</section>

		<footer-component />

	</eccheuma-layout>    
</template>

<style lang="scss">

eccheuma-layout {

	position: relative;

	display: grid;
	grid-template: {
		columns: 100%;
		rows: 10vh 70vh 15vh;
	};

	.fixed-node {
		position: absolute;
	}

}

.content {
	&-wrapper {

		display: grid;
		grid-template: {
			columns: 4vw 1fr 4vw;
			rows: 1fr;
		}

		width: 100vw;
		min-height: 100vh;
		
	}
	&-container {
		width: 90vw;
		margin: 0 auto;
		@media screen and ( max-width: $mobile-breakpoint ) {
			width: 100vw;
		}
	}
}

.ui-theme {
	&-light {
		transition-duration: .75s;
		background-color: rgb(var(--color-5));
	}
	&-dark {
		transition-duration: .75s;
		background-color: rgb(var(--color-0));
	}
}

</style>

<script lang="ts">

/*
	⠄⠄⠄⢰⣧⣼⣯⠄⣸⣠⣶⣶⣦⣾⠄⠄⠄⠄⡀⠄⢀⣿⣿⠄⠄⠄⢸⡇⠄⠄ 
	⠄⠄⠄⣾⣿⠿⠿⠶⠿⢿⣿⣿⣿⣿⣦⣤⣄⢀⡅⢠⣾⣛⡉⠄⠄⠄⠸⢀⣿⠄ 
	⠄⠄⢀⡋⣡⣴⣶⣶⡀⠄⠄⠙⢿⣿⣿⣿⣿⣿⣴⣿⣿⣿⢃⣤⣄⣀⣥⣿⣿⠄ 
	⠄⠄⢸⣇⠻⣿⣿⣿⣧⣀⢀⣠⡌⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⣿⣿⣿⠄ 
	⠄⢀⢸⣿⣷⣤⣤⣤⣬⣙⣛⢿⣿⣿⣿⣿⣿⣿⡿⣿⣿⡍⠄⠄⢀⣤⣄⠉⠋⣰ 
	⠄⣼⣖⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⢇⣿⣿⡷⠶⠶⢿⣿⣿⠇⢀⣤ 
	⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣷⣶⣥⣴⣿⡗ 
	⢀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠄ 
	⢸⣿⣦⣌⣛⣻⣿⣿⣧⠙⠛⠛⡭⠅⠒⠦⠭⣭⡻⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠄ 
	⠘⣿⣿⣿⣿⣿⣿⣿⣿⡆⠄⠄⠄⠄⠄⠄⠄⠄⠹⠈⢋⣽⣿⣿⣿⣿⣵⣾⠃⠄ 
	⠄⠘⣿⣿⣿⣿⣿⣿⣿⣿⠄⣴⣿⣶⣄⠄⣴⣶⠄⢀⣾⣿⣿⣿⣿⣿⣿⠃⠄⠄ 
	⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⡄⢻⣿⣿⣿⠄⣿⣿⡀⣾⣿⣿⣿⣿⣛⠛⠁⠄⠄⠄ 
	⠄⠄⠄⠄⠈⠛⢿⣿⣿⣿⠁⠞⢿⣿⣿⡄⢿⣿⡇⣸⣿⣿⠿⠛⠁⠄⠄⠄⠄⠄ 
	⠄⠄⠄⠄⠄⠄⠄⠉⠻⣿⣿⣾⣦⡙⠻⣷⣾⣿⠃⠿⠋⠁⠄⠄⠄⠄⠄⢀⣠⣴ 
	⣿⣿⣿⣶⣶⣮⣥⣒⠲⢮⣝⡿⣿⣿⡆⣿⡿⠃⠄⠄⠄⠄⠄⠄⠄⣠⣴⣿⣿⣿

	/* global process */

	import Vue from 'vue'

	// VUEX
	import { mapState, mapActions, mapMutations } from 'vuex'

	// MIXINS
	import Transition from '~/assets/mixins/transitions/Opacity'

	// COMPONENTS
	import HeaderCarousel from '~/components/header/HeaderCarousel.vue'
	import HeaderTop 			from '~/components/header/HeaderTop.vue'
	import PageLoader 		from '~/components/common/PageLoader.vue'

	// TYPES
	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification'

	import type { VuexModules } from '~/typescript/VuexModules'

	// MODULE
	export default Vue.extend({ 
		components: {
			PageLoader,
			HeaderCarousel,
			HeaderTop,
			// Async components ========================================= //
			Registration: 		() => import('~/components/user/Registration.vue'),
			HeaderNavigation: () => import('~/components/header/HeaderNavigation.vue'),
			VkMessages: 			() => import('~/components/common/VK_Messages.vue'),
			ScrollBar: 				() => import('~/components/common/ScrollBar.vue'),
			Notification: 		() => import('~/components/common/Notification.vue'),
			FooterComponent: 	() => import('~/components/common/Footer.vue'),
			/// Mobile components ========================================= //
			// MobileNavigation: () => import('~/components/_mobile/HeaderNavigation.vue'),
		},
		mixins: [ Transition ],
		transition: 'layout-transition',
		data() {
			return {
				someAction: false,
			}
		},
		head(): any {
			return {
				link: [
					{ rel: 'icon', href: `/${ this.someAction ? 'IconAction' : 'Icon' }.svg` },
				]
			}
		},
		computed: {

			...mapState({
				UI:						state => (state as VuexModules).App.UI,
				LoginStatus:	state => (state as VuexModules).Auth.Auth.LoginStatus,
				Muted:				state => (state as VuexModules).Sound.global.mute,
			}),

		},
		mounted() {

			setTimeout(() => {

				if ( !this.LoginStatus ) { this.setRegNotification() }

			}, 6e5 );

		},
		methods: {

			...mapMutations({
				SetDeviceType: 						'SetDeviceType',
				ChangeNotificationState: 	'Notification/Change_Status'
			}),

			...mapActions({
				setNotification: 'Notification/Set_Notification',
			}),

			setRegNotification() {

				const C: NOTIFICATION_CONTENT = {
					message: 'Если вы ещё не зарегистрированны - То сейчас самое лучшее время!',
					description: 'Благодаря регистрации на сайте, вы получите личный кабинет с возможностью мониторинга состояния заказа, просмотр заявок, и возможность коментиривания и оценки контента.',
					link: '',
				}

				if ( !this.LoginStatus ) {
					this.setNotification(C)
				}

			}

		}
	})

</script>
