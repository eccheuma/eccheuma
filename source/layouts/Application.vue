<template>
	<div key="Application"  id="ApplicationLayout" ref="ApplicationNode" :class="DarkUI ? `theme_dark` : `theme_light`">

			<client-only>
				
				<vk-messages />

				<!-- Модальный портал -->
				<PortalTarget  name="Modal" :transition="MIXIN_Transition('Fading')" slim />

				<!-- Лоадер -->
				<Page-Loader />

				<!-- Модуль регистрации -->
				<Registration />

			</client-only>

			<!-- Верхняя шапка -->
			<Header-Top />

			<client-only>

				<!-- Нотификация -->
				<Notification />

				<!-- Профиль пользователя -->
				<User-Profile v-if="LoginStatus == true && !$isMobile"></User-Profile>

			</client-only>

			<!-- Карусель -->
			<Header-Carousel/>

			<!-- Навигация -->

			<template v-if="$isMobile">
				<mobile-navigation />
			</template>

			<template v-else>
				<header-navigation :search="true" :background="true"/>
			</template>

			<!-- Основной контент -->	
			<section class="content-wrapper">

				<scroll-bar v-if="!$isMobile"/>

				<nuxt class="content-container"></nuxt>

			</section>

			<!-- Футер -->
			<Footer/>

	</div>    
</template>

<style lang="scss">

* { 
	&::-webkit-scrollbar {
		width: 10px;
		&-track {
			background-color: $color1;
			// border: 1px solid $color3;
		}
		&-thumb {
			border-radius: 2rem;
			background-color: $color4;
			border: 3px solid $color1;
			&:hover {
				background-color: $color5;
			}
		}
		&-button {
			height: 0;
		}
	}
}

.AppNoScroll {
	position: fixed;
	height: 100vh;
	overflow: hidden;
}

.content {
	&-wrapper {
		width: 100vw;
		min-height: 100vh;
		position: relative; 
	}
	&-container {
		width: 90vw;
		margin: 0 auto;
		@media screen and ( max-width: $MobileBreakPoint ) {
			width: 100vw;
		}
	}
}

.theme {
	&_light {
		transition-duration: .75s;
		background-color: $color6;
	}
	&_dark {
		transition-duration: .75s;
		background-color: $color1;
	}
}


</style>

<script lang="ts">

/*⠄⠄⠄⢰⣧⣼⣯⠄⣸⣠⣶⣶⣦⣾⠄⠄⠄⠄⡀⠄⢀⣿⣿⠄⠄⠄⢸⡇⠄⠄ 
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
	import type { I_CONTENT, CurentState as NotificationState } from '~/store/Notification.ts'

	// MODULE
	export default Vue.extend({ 
		mixins: [ Transition ],
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
			Footer: 					() => import('~/components/common/Footer.vue'),
			/// Mobile components ========================================= //
			MobileNavigation: () => import('~/components/_mobile/HeaderNavigation.vue'),
		},
		computed: {
			...mapState({
				DarkUI:				( state: any ): boolean => state.ScrollBar.DarkUI,
				LoginStatus:	( state: any ): boolean => state.Auth.Auth.LoginStatus,
				Muted:				( state: any ): boolean => state.Sound.Global.Mute,
				AppScroll:		( state: any ): boolean => state.AppScroll
			}),
			LocalThemeStatus() {
				return localStorage.theme
			},
		},
		methods: {
			...mapMutations({
				SetDeviceType: 'SetDeviceType',
				ChangeNotificationState: 'Notification/Change_Status'
			}),
			...mapActions({
				Set_Notification: 'Notification/Set_Notification'
			}),
			RegisterRequestNotification() {

				const CONTENT: I_CONTENT = {
					message: 'Если вы ещё не зарегистрированны - То сейчас самое лучшее время!',
					description: 'Благодаря регистрации на сайте, вы получите личный кабинет с возможностью мониторинга состояния заказа, просмотр заявок, и возможность коментиривания и оценки контента.',
					link: '',
				}

				if( this.LoginStatus ) {
					this.Set_Notification( CONTENT )
				}

			}
		},
		mounted() {

			if ( !this.Muted ) {
				setTimeout(() => {
					this.$store.dispatch( 'Sound/Set_GlobalSoundProperty', 1 )
				}, 750);
			}

			setTimeout(() => this.RegisterRequestNotification(), 6e5 );

		}
	})

</script>