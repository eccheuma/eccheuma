<template>
	<eccheuma-layout key="Application" ref="ApplicationNode" :class="`ui-theme-${ UI }`">

		<section ref="fixed" class="fixed-node">

			<hardware-acceleration-decorator v-once>
				<loader :stages="ApplicationLoadStages" :ignite="true" />
			</hardware-acceleration-decorator>

			<client-only>

				<notification />
				<portal-target name="Modal" transition="transition-wrapper" slim />
				<registration />

			</client-only>

		</section>

		<header-top />
		<header-carousel />

		<mobile-navigation v-if="$isMobile" />
		<desktop-navigation v-else :search="true" :background="true" />

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
		columns: $GLOBAL-BodySize;
		rows: 10vh 75vh $GLOBAL-HeaderHeight;
	};

	--crusoris-circle-color: var(--color-accent-edges-100);
	--crusoris-dot-color: var(--color-accent-edges-300);
	--crusoris-transition-duration: 333ms;

	.fixed-node {
		position: absolute;
	}

	&:before {

		content: '';
		width: $GLOBAL-BodySize;
		height: 1px;
		position: fixed;
		bottom: 0px;

		background: linear-gradient(90deg, var(--color-accent-edges-100), var(--color-accent-edges-200), var(--color-accent-edges-100));
		z-index: 9999;

		cursor: pointer;

	}

}

.content {
	&-wrapper {

		display: grid;
		grid-template: {
			columns: 
				minmax(min-content, #{ $GLOBAL-AsideColumnsWidth }) 
				minmax(min-content, 1440px) 
				$GLOBAL-AsideColumnsWidth; 
			rows: 1fr;
		}

		column-gap: 1vw;

		width: $GLOBAL-BodySize;
		min-height: 100vh;
		justify-content: space-between;
		
	}
	&-container {

		width: auto;
		margin: 0 auto;

		border: {
			right: 1px solid rgb(var(--color-mono-300));
			left: 1px solid rgb(var(--color-mono-300));
		}

		// Mobile
		@media screen and ( max-width: $mobile-breakpoint ) {
			width: $GLOBAL-BodySize;
		}

	}
}

.ui-theme {
	&-light {

		--color-mono-000: var(--mono-1000);
    --color-mono-100: var(--mono-1000);
    --color-mono-200: var(--mono-900);
    --color-mono-300: var(--mono-800);
    --color-mono-400: var(--mono-700);
    --color-mono-500: var(--mono-500);
    --color-mono-600: var(--mono-500);
    --color-mono-700: var(--mono-400);
    --color-mono-800: var(--mono-400);
		--color-mono-900: var(--mono-400);
    --color-mono-1000: var(--mono-100);

		transition-duration: .75s;
		background-color: rgb(var(--color-mono-100));
		color: rgb(var(--color-mono-900));

	}
	&-dark {
		transition-duration: .75s;
		background-color: rgb(var(--color-mono-100));
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

	// COMPONENTS
	import HeaderCarousel from '~/components/layout/header/HeaderCarousel.vue'
	import HeaderTop 			from '~/components/layout/header/HeaderTop.vue'
	import Loader 				from '~/components/common/Loader.vue'

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator 	from '~/components/functional/HardwareAcceleration.vue';
	import TransitionWrapper 							from '~/components/functional/TransitionWrapper.vue'

	// TYPES
	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification'

	import type { VuexModules } from '~/typescript/VuexModules'
	
	Vue.component('TransitionWrapper', TransitionWrapper)

	// MODULE
	export default Vue.extend({ 
		components: {

			// FUNCTIONAL
			HardwareAccelerationDecorator,
			// eslint-disable-next-line vue/no-unused-components

			// PREDEFINED COMPONENTS //
			Loader,
			HeaderCarousel,
			HeaderTop,

			// ASYNC COMPONENTS //
			FooterComponent: 		() => import('~/components/layout/Footer.vue'),
			DesktopNavigation:	() => import('~/components/layout/header/HeaderNavigation.vue'),
			ScrollBar: 					() => import('~/components/layout/ScrollBar.vue'),

			Notification: 			() => import('~/components/common/Notification.vue'),
			// VkMessages: 				() => import('~/components/common/VK_Messages.vue'),

			Registration: 			() => import('~/components/registration/Registration.vue'),

			// MOBILE COMPONENTS //
			MobileNavigation: 	() => import('~/components/mobile/HeaderNavigation.vue'),

		},
		transition: {
			name: 'layout-transition',
			mode: 'out-in',
		},
		data() {
			return {
				ApplicationLoadStages: [
					{ LoadPoint: 0, 	Message: 'Загрузка скриптов и данных' },
					{ LoadPoint: 25, 	Message: 'Монтирование элементов' },
					{ LoadPoint: 80, 	Message: 'Остаточная компоновка элементов' },
					{ LoadPoint: 100, Message: 'Готово!' },
				]

			}
		},
		// head(): any {
		// 	return {
		// 		link: [
		// 			{ rel: 'icon', href: `/${ this.someAction ? 'IconAction' : 'Icon' }.svg` },
		// 		]
		// 	}
		// },
		computed: {

			...mapState({
				UI:						state => (state as VuexModules).App.UI,
				LoginStatus:	state => (state as VuexModules).Auth.Session.LoginStatus,
				Muted:				state => (state as VuexModules).Sound.global.mute,
			}),

		},
		methods: {

			...mapMutations({
				setDeviceType: 						'setDeviceType',
				changeNotificationState: 	'Notification/changeNotificationState',
			}),

			...mapActions({
				setNotification: 'Notification/setNotification',
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
