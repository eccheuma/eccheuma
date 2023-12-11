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

		<client-only>
			<template v-if="$isMobile">
				<section class="layout-mobile">

					<eccheuma-button v-if="LoginStatus == true && !$isMobile" @click.native="toggleProfileArea">
						Личный кабинет
					</eccheuma-button>

					<eccheuma-button v-else @click.native="toggleRegisterModal">
						Зарегистрироваться
					</eccheuma-button>

				</section>
			</template>
		</client-only>

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

	.layout-mobile {

		display: none;

		background: rgb(var(--color-mono-200));
    width: 100%;
    place-content: center;
    padding-top: 2vh;

		@media screen and ( max-width: $mobile-breakpoint ) {
			display: grid;
			grid-template: {
				columns: 75vw;
			};
			margin: auto;
		};

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

	import Vue from "vue";

	// VUEX
	import { mapState, mapActions, mapMutations } from "vuex";

	// COMPONENTS
	import HeaderCarousel from "~/components/layout/header/HeaderCarousel.vue";
	import HeaderTop 			from "~/components/layout/header/HeaderTop.vue";
	import Loader, { LoadStage } from "~/components/common/Loader.vue";
	import EccheumaButton		from "~/components/buttons/CommonButton.vue";

	// FUNCTIONAL COMPONENTS
	import HardwareAccelerationDecorator 	from "~/components/functional/HardwareAcceleration.vue";
	import TransitionWrapper 							from "~/components/functional/TransitionWrapper.vue";

	// NOTIFICATION DATA
	import { registration } from "~/assets/json/notifications.json";

	// TYPES
	import type { Notification } from "~/contracts/Notification";
	import type { VuexMap } from "~/contracts/VuexMap";
	
	Vue.component("TransitionWrapper", TransitionWrapper);

	// MODULE
	export default Vue.extend({ 
		components: {

			// FUNCTIONAL
			HardwareAccelerationDecorator,

			// PREDEFINED COMPONENTS //
			Loader,
			HeaderCarousel,
			EccheumaButton,
			HeaderTop,

			// ASYNC COMPONENTS //
			FooterComponent: 		() => import("~/components/layout/footer/view.vue"),
			DesktopNavigation:	() => import("~/components/layout/header/HeaderNavigation.vue"),
			ScrollBar: 					() => import("~/components/layout/scrollbar/view.vue"),

			Notification: 			() => import("~/components/common/Notification.vue"),
			// VkMessages: 				() => import('~/components/common/VK_Messages.vue'),

			Registration: 			() => import("~/components/registration/Registration.vue"),

			// MOBILE COMPONENTS
			MobileNavigation: 	() => import("~/components/layout/mobile/HeaderNavigation.vue"),

		},
		transition: {
			name: "layout-transition",
			mode: "out-in",
		},
		data() {
			return {
				ApplicationLoadStages: [
					{ LoadPoint: 0, 	Message: "Загрузка скриптов и данных" },
					{ LoadPoint: 25, 	Message: "Монтирование элементов" },
					{ LoadPoint: 90, 	Message: "Остаточная компоновка элементов" },
					{ LoadPoint: 100, Message: "Готово!" },
				] as Array<LoadStage>
			};
		},
		computed: {

			...mapState({
				UI					:	state => (state as VuexMap).App.UI,
				LoginStatus	:	state => (state as VuexMap).Auth.Session.LoginStatus,
			}),

		},
		mounted() {

			setTimeout(this.registrationNotify, 360_000);

		},
		methods: {

			...mapMutations({
				setDeviceType				: "setDeviceType",
				changeStatus				: "Notification/changeStatus",
				toggleProfileArea		: "User/State/toggleProfileArea",
				toggleRegisterModal	: "Auth/Register/toggleRegisterModal",
			}),

			...mapActions({
				createNotification: "Notification/createNotification",
			}),

			registrationNotify() {

				if ( !this.LoginStatus ) {
				
					this.createNotification(registration as Notification.struct);

				}

			}

		}
	});

</script>
