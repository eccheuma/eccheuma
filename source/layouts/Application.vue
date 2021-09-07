<template>
	<eccheuma-layout key="Application" ref="ApplicationNode" :class="`ui-theme-${ UI }`">

		<section ref="fixed" class="fixed-node">

			<hardware-acceleration-decorator>
				<page-loader :stages="ApplicationLoadStages" :ignite="true" />
			</hardware-acceleration-decorator>

			<client-only>

				<notification />
				<portal-target name="Modal" :transition="MIXIN_Transition('opacity-transition')" slim />
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
				$GLOBAL-AsideColumnsWidth 
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

		--color-mono-000: 255,255,255;
    --color-mono-100: 230,230,230;
    --color-mono-200: 255,255,255;
    --color-mono-300: 240,240,240;
    --color-mono-400: 180,180,180;
    --color-mono-500: 65,65,65;
    --color-mono-600: 54,54,54;
    --color-mono-700: 65,65,70;
    --color-mono-800: 40,40,40;
    --color-mono-900: 28,28,28;

		transition-duration: .75s;
		background-color: rgb(var(--color-mono-100));
		color: rgb(var(--color-mono-800));

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

	// // CRUSOR
	// import Crusoris 	from '~/assets/modules/Crusoris/index';

	// import '~/assets/modules/crusoris/index.css';

	// MIXINS
	import Transition from '~/assets/mixins/transitions/Opacity'

	// COMPONENTS
	import HeaderCarousel from '~/components/header/HeaderCarousel.vue'
	import HeaderTop 			from '~/components/header/HeaderTop.vue'
	import PageLoader 		from '~/components/common/Loader.vue'

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator from '~/components/functional/HardwareAcceleration.vue';

	// TYPES
	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification'

	import type { VuexModules } from '~/typescript/VuexModules'
	
	// MODULE
	export default Vue.extend({ 
		components: {

			// Predefined components ==================================== //
			HardwareAccelerationDecorator,
			PageLoader,
			HeaderCarousel,
			HeaderTop,

			// Async components ========================================= //
			Registration: 			() => import('~/components/user/Registration.vue'),
			DesktopNavigation:	() => import('~/components/header/HeaderNavigation.vue'),
			ScrollBar: 					() => import('~/components/common/ScrollBar.vue'),
			Notification: 			() => import('~/components/common/Notification.vue'),
			FooterComponent: 		() => import('~/components/common/Footer.vue'),
			// VkMessages: 				() => import('~/components/common/VK_Messages.vue'),

			/// Mobile components ======================================= //
			MobileNavigation: 	() => import('~/components/_mobile/HeaderNavigation.vue'),
			
		},
		mixins: [ Transition ],
		transition: {
			name: 'layout-transition',
			mode: 'out-in',
		},
		data() {
			return {
				someAction: false,

				// CrusorisInstance: undefined as undefined | Crusoris,

				ApplicationLoadStages: [
					{ LoadPoint: 0, 	Message: 'Загрузка скриптов и данных' },
					{ LoadPoint: 15, 	Message: 'Загрузка внешних API' },
					{ LoadPoint: 30, 	Message: 'Монтирование элементов' },
					{ LoadPoint: 80, 	Message: 'Остаточная компоновка элементов' },
					{ LoadPoint: 100, Message: 'Готово!' },
				]

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

			// if ( !this.CrusorisInstance ) {

			// 	this.CrusorisInstance = new Crusoris(this.$refs.fixed as HTMLElement);

			// 	this.$nextTick(() => {
			// 		this.CrusorisInstance!.init();
			// 	})

			// }
			
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
