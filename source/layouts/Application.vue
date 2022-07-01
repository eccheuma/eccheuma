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

			<nuxt class="content-container" />

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
					1fr
					$GLOBAL-AsideColumnsWidth; 
				rows: 1fr;
			}

			column-gap: 1vw;

			min-height: 100vh;
			justify-content: space-between;
			
		}
		&-container {

			width: 100%;
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

			// transition-duration: .75s;
			background-color: rgb(var(--color-mono-100));
			color: rgb(var(--color-mono-900));

		}
		&-dark {
			// transition-duration: .75s;
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
*/

	import Vue from 'vue'

	// VUEX
	import { mapState, mapActions, mapMutations } from 'vuex'

	// COMPONENTS
	import HeaderCarousel from '~/components/layout/header/HeaderCarousel.vue'
	import HeaderTop 			from '~/components/layout/header/HeaderTop.vue'
	import Loader, { LoadStage } from '~/components/common/Loader.vue'

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator 	from '~/components/functional/HardwareAcceleration.vue';
	import TransitionWrapper 							from '~/components/functional/TransitionWrapper.vue';

	// TYPES
	import type { Notification } from '~/types/Notification'

	import type { VuexMap } from '~/types/VuexMap'
	
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
				] as Array<LoadStage>
			}
		},
		computed: {

			...mapState({
				UI:						state => (state as VuexMap).App.UI,
				LoginStatus:	state => (state as VuexMap).Auth.Session.LoginStatus,
			}),

		},
		mounted() {

			setTimeout(this.setRegNotification, 360_000);

		},
		methods: {

			...mapMutations({
				setDeviceType: 						'setDeviceType',
				changeStatus: 	'Notification/changeStatus',
			}),

			...mapActions({
				createNotification: 'Notification/createNotification',
			}),

			setRegNotification() {

				if ( !this.LoginStatus ) {

					const C: Notification.struct = {
						message: 'Если вы ещё не зарегистрированны - То сейчас самое лучшее время!',
						description: 'Благодаря регистрации на сайте, вы получите личный кабинет с возможностью мониторинга состояния заказа, просмотр заявок, и возможность коментиривания и оценки контента.',
					}
				
					this.createNotification(C);

				}

			}

		}
	})

</script>
