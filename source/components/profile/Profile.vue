<template>

	<collapse 
		class="user_profile-collapse"
		:active="UserProfileArea" 
		:options="{ duration: 500, emit: true }"
		@collapsed="(v) => status = v"
		>

		<section ref="UserProfileContainer" class="user_profile-container">

			<transition name="opacity-transition">
				<div v-show="status" class="user_profile-info">

					<section v-once class="user_profile-info-header">
						<h6>Профиль</h6>
						<span>Информация о балансе и заказе</span>
					</section>

					<hr v-once>

					<section class="user_profile-info-body">
						<i ref="UserIcon" :style="`background-image: url(${ UserState.UserImageID }); transform: scale(0)`" />
						<div class="user_profile-info-body-name">
							<tag :light="true">
								{{ UserState.UserName }}
							</tag>
							<span>{{ defineStatus(UserState.UserStatus) }}</span>
						</div>
					</section>

					<hr v-once>

					<section class="user_profile-info-footer">

						<h6>Информация</h6>
						<hr v-once>
						<div class="user_profile-info-footer-list">

							<span>
								<div>Баланс: </div>
								<strong>{{ UserState.UserBalance }} ₽</strong>
							</span>
							<span>
								<div>Сообщений: </div>
								<strong>{{ MessagesCount }} ( Новых: {{ NewMessages }} )</strong>
							</span>

							<!-- <template v-if="ActiveRequest.length">
								<span>
									<div>Тип заказа:  </div>
									<strong>{{ ActiveRequest[0].Service.Name || 'Не указан' }}</strong>
								</span>
								<span>
									<div>Статус заказа: </div>
									<strong>{{ DefineWorkStatus(ActiveRequest[0].Status) }}</strong>
								</span>
								<span>
									<div>Цена заказа: </div>
									<strong>{{ ActiveRequest[0].Service.Cost || 0 }} ₽</strong>
								</span>
							</template> -->

							<span>
								<div>Заказов в прогрессе: </div>
								<strong>{{ RequestsQuantity }}</strong>
							</span>

						</div>

					</section>

				</div>
			</transition>

			<transition name="opacity-transition">
				<div v-show="status" class="user_profile-content">

					<section class="user_profile-content-header">
						<h6>{{ ComponentInfo.Title }}</h6>
						<span>{{ ComponentInfo.Sub }}</span>
					</section>

					<hr v-once>
					
					<transition name="UserProfileComponentTransition" mode="out-in">

						<component :is="CurentPreferencesComponent" :key="`${CurentPreferencesComponent}-Key`" />

					</transition>

				</div>
			</transition>

			<transition name="opacity-transition">
				<div v-show="status" class="user_profile-navigation">

					<section v-once class="user_profile-navigation-header">
						<h6>Навигация</h6>
						<span>Выберите нужный пункт меню</span>
					</section>

					<hr v-once>

					<section class="user_profile-navigation-body">

						<common-button 
							v-for="(item, index) in PreferencesArea" 
							:key="`navigation-button-${ index }`"
							:indicator="Boolean(item.Component === 'Messages' && NewMessages)"
							:class="[
								{ status: CurentPreferencesComponent === item.Component }
							]"
							@click.native="AreaToggle( item.Component )"
							>
							{{ item.Name }}
						</common-button>

					</section>

					<hr v-once>

					<section v-once class="user_profile-navigation-footer">
						<common-button @click.native="Logout">
							Выход из аккаунта
						</common-button>
					</section>

				</div>
			</transition>

		</section>

	</collapse>

</template>

<style lang="scss">

	$padY: 2vh;
	$padX: 1vw;

	@mixin section-header {

		text-align: center;

		place-content: center;
		display: flex;
		flex-direction: column;

		height: 6vh;

		h6 {

			display: block;
			color: rgb(var(--color-mono-1000));
			font: {
				size: var(--font-size-36);
				family: var(--decor-font);
				// weight: 700;
			}

			letter-spacing: .15ch;
			line-height: var(--size-36);

		}

		span {
			display: block;
			color: rgb(var(--color-mono-500));
			font-size: var(--font-size-16);
			font-weight: 800;
		}

	}

	.user_profile-collapse {
		position: absolute; 
		z-index: 1020;
		top: $padY;
		left: $padX;
		width: calc(100% - #{ $padX * 2 } - #{ $GLOBAL-ScrollWidth });

		border-radius: var(--border-radius);

	}

	.UserProfileComponentTransition {
		&-enter {
			transform: translateY(-2vh);
			opacity: 0;
			&-active {
				transition: all 500ms ease-in-out;
			}
			&-to {
				transform: translateY(0px);
				opacity: 1;
			}
		}
		&-leave {
			transform: translateY(0px);
			opacity: 1;
			&-active {
				transition: all 500ms ease-in-out;
			}
			&-to {
				transform: translateY(2vh);
				opacity: 0;
			}
		}
	}

	.UserProfileTransition {
		&-enter {
			transform: translate3D(0, -100px, 0);
			opacity: 0;
			&-active {
				transition: all 500ms ease-in-out;
			}
			&-to {
				transform: translate3D(0, 0, 0);
				opacity: 1;
			}
		}
		&-leave {
			transform: translate3D(0, 0, 0);
			opacity: 1;
			&-active {
				transition: all 500ms ease-in-out;
			}
			&-to {
				transform: translate3D(0, -100px, 0);
				opacity: 0;
			}
		}
	}

	.user_profile {

		&-container {

			position: relative;
			width: 100%;
			height: calc(75vh - #{ $padY * 2 });

			overflow: hidden;

			backdrop-filter: blur(12px);
			background-color: rgba(var(--color-mono-200),.9);

			z-index: 1010;

			display: grid; 
			grid-template: {
				columns: 3fr 7fr 3fr;
				areas: 'info content nav'
			}

			border: {
				radius: inherit;
				color: var(--color-accent-edges-100);
				width: 1px;
				style: solid;
			}

			@media screen and ( max-width: $mobile-breakpoint ) {
				grid-template: {
					columns: 1fr;
					rows: auto auto auto;
				}
			}

			hr {
				width: 100%;
				background-color: rgb(var(--color-mono-400));
				margin: 0;
			}

		}

		&-info {

			grid-area: info;

			display: grid;
			grid-template: {
				rows: auto 1px 1fr 1px min-content;
			}

			row-gap: 2vh;
			padding: 2vh 1vw;

			border: {
				right: 1px solid rgb(var(--color-mono-400));
			} 

			&-header {

				@include section-header;

			}

			&-body {

				display: flex;
				place-items: center;
				place-content: center;
				flex-direction: column;

				row-gap: 2vh;

				i {
					display: block;
					height: clamp(100px,15vh,100%); 
					aspect-ratio: 1/1;
					border-radius: 100%;
					border: 5px solid var(--color-accent-edges-100);
					background-position: center center;
					background-size: cover;
					background-color: rgb(var(--color-mono-900));
				}

				&-name {
					span {
						&:last-child {
							display: block;
							text-align: center;
							margin-top: 1vh;
							color: rgb(var(--color-mono-600));
							font-size: var(--font-size-16);
							font-weight: 600;
						}
					}
				}

			}

			&-footer {

				@include gradient-border;

				background-color: rgb(var(--color-mono-300));
				border-radius: var(--border-radius);
				padding: 3vh 1.5vw;

				height: min-content;
				display: grid;
				row-gap: 1vh;

				place-content: center;

				@extend %pattern-lines;

				h6 {
					display: block;
					color: rgb(var(--color-mono-1000));
					font-size: var(--font-size-36);
					font-family: var(--decor-font);
					letter-spacing: .15ch;
					margin-bottom: 1vh;
				}

				hr {
					margin-block: .5vh;
				}

				span {
					display: inline-grid;
					grid-template-columns: 1fr auto;
					margin: { bottom: 1.5vh };
					text-align: left;
					width: 100%;
					font: {
						weight: 500;
						size: .65rem;
					}
					color: rgba(var(--color-mono-900),.75);
					line-height: 10px;
					strong {
						color: rgb(var(--color-mono-900));
						font-weight: 700;
						text-align: right;
					}
				}

			}

		}

		&-content {

			grid-area: content;
			display: grid;
			grid-template: {
				rows: auto 1px 1fr;
			}

			gap: 2vh;
			padding: 2vh 1vw;

			// height: 70vh;
			overflow: hidden;

			&-header {

				@include section-header;

			}

		}

		&-navigation {

			grid-area: nav;

			display: grid;
			gap: 2vh;

			grid-template: {
				rows: auto 1px 1fr 1px min-content;
			}

			padding: 2vh 1vw;

			border: {
				left: 1px solid rgb(var(--color-mono-400));
			} 

			hr {
				width: 100%;
				background-color: rgb(var(--color-mono-400));
				margin: 0;
			}

			&-header {
				
				@include section-header;

			}

			&-body {

				display: flex;
				flex-direction: column;
				place-content: center;
				row-gap: 1vh;

				align-items: center;

				button {
					width: 100%;
				}

				.active {
					width: 75%;
				}

			}

			&-footer {

				display: flex;
				flex-direction: column;
				width: 100%;

			}

		}

	}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState, mapActions } from 'vuex'

	// TYPES
	import type { AnimeAnimParams } from 'animejs';
	import type { VuexMap } 				from '~/typescript/VuexMap';

	// UTILS
	import { user } from '~/utils/status'

	// ENUMS
	import { User } from '~/typescript/User'

	// COMPONENTS
	import CommonButton	from '~/components/buttons/CommonButton.vue'
	import Collapse 		from '~/components/common/Collapse.vue'
	import Tag 					from '~/components/common/Tag.vue'

	// FUNCTION COMPONENTS
	import TransitionWrapper from '~/components/functional/TransitionWrapper.vue';

	// INTERFACE'N'TYPES
	type MODULES = 'Messages' | 'NameChange' | 'IconChange' | 'Orders';

	type COMPONENT_HEADER = {
		Title: string,
		Sub: String
	}

	const enum Title {
		messages 	= 'Сообщения',
		name			= 'Смена имени пользователя',
		icon 			= 'Смена иконки профиля',
		orders		= 'Статус заказа'
	}

	const enum Notation {
		send 		= 'Подсказка: Нажмите "Ctrl + Enter" для отправки сообщения.',
		confirm = 'Подсказка: Нажмите "Ctrl + Enter" для подтверждения.',
		avail 	= 'Данная сводка полезна для проверки. В случае чего',
	}

	// ANIMATION STATES 

	type ICON_ANIMATION_STATES = 'init' | 'update' | 'close'

	const ANIMATION_VARIATIONS: {[K in ICON_ANIMATION_STATES]: AnimeAnimParams } = {
		'init': {
			scale: [0, 1],
			delay: 500,
			duration: 250,
			easing: 'easeInOutCubic',
		},
		'update': {
			scale: [1, 0],
			direction: 'alternate',
			duration: 500,
			easing: 'easeInOutCubic',
		},
		'close': {
			scale: [1, 0],
			duration: 250,
			easing: 'easeInOutCubic',
		}
	}

	// MODULE
	export default Vue.extend({
		
		components: {
			Collapse,
			Tag,
			CommonButton,
			TransitionWrapper,
			Messages: 		() => import('~/components/profile/submodules/Messages/module.vue'),
			Orders: 			() => import('~/components/profile/submodules/Orders/module.vue'),
			NameChange: 	() => import('~/components/profile/submodules/NameChange.vue'),
			IconChange: 	() => import('~/components/profile/submodules/IconChange.vue'),
		},

		data() {
			return {

				CurentPreferencesComponent: 'Messages' as MODULES, 

				PreferencesArea: [

					{ Component: 'Messages', 			Name: 'Сообщения' 		},
					{ Component: 'IconChange', 		Name: 'Смена иконки'	},
					{ Component: 'Orders', 				Name: 'Запросы'				},
					{ Component: 'NameChange', 		Name: 'Изменить Имя'	},

				] as Array<{ Component: MODULES, Name: string }>,

				status: false,
				
			}
		},

		computed: {

			...mapState({
				// AUTH
				LoginStatus:	 		state => (state as VuexMap).Auth.Session.LoginStatus,
				// USER STATE
				UserProfileArea: 	state => (state as VuexMap).User.State.UserProfileArea,
				UserState:			 	state	=> (state as VuexMap).User.State.UserState,
				// MessageS
				MessagesCount: 		state => (state as VuexMap).User.Messages.Messages.length,
				NewMessages: 			state => (state as VuexMap).User.Messages.NewMessagesCount,
				// WORK REQUESTS
				RequestsQuantity: state => (state as VuexMap).User.WorkRequest.RequestQuantity,
				ActiveRequest: 		state => (state as VuexMap).User.WorkRequest.ActiveOrders,
			}),

			// COMPONENT_HEADER

			ComponentInfo(): COMPONENT_HEADER {

				switch (this.CurentPreferencesComponent) {

					case 'Messages': return {
						Title: Title.messages,
						Sub: Notation.send,
					}

					case 'NameChange': return {
						Title: Title.name,
						Sub: Notation.confirm,
					}

					case 'IconChange': return {
						Title: Title.icon,
						Sub: Notation.confirm,
					}

					case 'Orders': return {
						Title: Title.orders,
						Sub: Notation.avail,
					}

					default: return {
						Title: 'Название для компонента',
						Sub: 'Явно что-то пошло не так...'
					}

				}

			},

		},

		watch: {

			'UserState.UserImageID': {
				handler() {
					this.AnimateUserIcon('update'); 
				},
			},

			GetRequestsQuantity: {
				handler() {
					this.$store.dispatch('User/WorkRequest/setActiveRequest')
				}
			},

			status: {
				handler() {
					this.AnimateUserIcon('init')
				}
			},

		},

		created() {

			this.setRequestQuantity(); 
			this.setRequestContent(this.UserState.UserID); 

			this.getMessages();

		},

		mounted() {

			this.checkUnreaded();
			
		},

		methods: {

			...mapActions({
				// AUTH
				Logout: 							'Auth/Logout',
				// MessageS
				getMessages: 					'User/Messages/getMessages',
				checkUnreaded: 				'User/Messages/checkUnreaded',
				// WORK REQUESTS
				setRequestQuantity: 	'User/WorkRequest/setRequestQuantity',
				setRequestContent: 		'User/WorkRequest/setRequestContent',
			}),

			AreaToggle(component: MODULES) {
				this.CurentPreferencesComponent = component;
			},

			AnimateUserIcon(type: ICON_ANIMATION_STATES) {

				this.$AnimeJS({	

					targets: this.$refs.UserIcon,

					...ANIMATION_VARIATIONS[type],

				});

			},

			defineStatus(status: User.status) {
				return user.defineStatus(status)
			},

		},

	})

</script>
