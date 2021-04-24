<template>
	<eccheuma-layout key="Application" ref="ApplicationNode" :class="`ui-theme-${ UI }`">

		<!-- Лоадер -->
		<page-loader />

		<client-only>
			
			<!-- Модальный портал -->
			<portal-target name="Modal" :transition="MIXIN_Transition('opacity-transition')" slim />

			<!-- Модуль регистрации -->
			<registration />

		</client-only>

		<!-- Верхняя шапка -->
		<Header-Top />

		<client-only>

			<!-- Нотификация -->
			<notification />

			<!-- Профиль пользователя -->
			<user-profile v-if="LoginStatus == true && !$isMobile" />

		</client-only>

		<!-- Карусель -->
		<header-carousel />

		<!-- Навигация -->

		<template v-if="$isMobile">
			<mobile-navigation />
		</template>

		<template v-else>
			<header-navigation :search="true" :background="true" />
		</template>

		<!-- Основной контент -->	
		<section class="content-wrapper">

			<scroll-bar v-if="!$isMobile" />

			<nuxt class="content-container" />

		</section>

		<!-- Футер -->
		<footer-component />

		<client-only>
			<vk-messages />
		</client-only>

	</eccheuma-layout>    
</template>

<style lang="scss">

eccheuma-layout {
	display: block;
}

.AppNoScroll {
	position: fixed;
	height: 100vh;
	overflow: hidden;
}

.content {
	&-wrapper {

		display: grid;
		grid-template: {
			columns: 3vw auto 3vw;
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
		background-color: rgb(var(--color-1));
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
	import type { NOTIFICATION_CONTENT } from '~/types/Notification.ts'

	import type { VuexModules } from '~/types/VuexModules.ts'

	// MODULE
	export default Vue.extend({ 
		components: {
			PageLoader,
			HeaderCarousel,
			HeaderTop,
			// Async components ========================================= //
			UserProfile: 			() => import('~/components/user/UserProfile.vue'),
			Registration: 		() => import('~/components/user/Registration.vue'),
			HeaderNavigation: () => import('~/components/header/HeaderNavigation.vue'),
			VkMessages: 			() => import('~/components/common/VK_Messages.vue'),
			ScrollBar: 				() => import('~/components/common/ScrollBar.vue'),
			Notification: 		() => import('~/components/common/Notification.vue'),
			FooterComponent: 	() => import('~/components/common/Footer.vue'),
			/// Mobile components ========================================= //
			MobileNavigation: () => import('~/components/_mobile/HeaderNavigation.vue'),
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
				Muted:				state => (state as VuexModules).Sound.Global.Mute,
				AppScroll:		state => (state as VuexModules).AppScroll
			}),
			LocalThemeStatus() {
				return localStorage.theme
			},
		},
		mounted() {

			if ( !this.Muted ) {
				setTimeout(() => {
					this.$store.dispatch( 'Sound/Set_GlobalSoundProperty', 1 )
				}, 750);
			}

			setTimeout( this.setRegisterNatification, 6e5 );

		},
		methods: {

			...mapMutations({
				SetDeviceType: 'SetDeviceType',
				ChangeNotificationState: 'Notification/Change_Status'
			}),

			...mapActions({
				Set_Notification: 'Notification/Set_Notification'
			}),

			setRegisterNatification() {

				const C: NOTIFICATION_CONTENT = {
					message: 'Если вы ещё не зарегистрированны - То сейчас самое лучшее время!',
					description: 'Благодаря регистрации на сайте, вы получите личный кабинет с возможностью мониторинга состояния заказа, просмотр заявок, и возможность коментиривания и оценки контента.',
					link: '',
				}

				if ( !this.LoginStatus ) {
					this.Set_Notification(C)
				}

			}

		}
	})

</script>
