<template>

	<eccheuma-collapse 
		class="user_profile-collapse"
		:active="UserProfileArea" 
		:options="{ duration: 500 }"
		@collapsed="AnimateContainer"
		>

		<section ref="UserProfileContainer" class="user_profile-container">

			<div class="user_profile-info">

				<section class="user_profile-info-header">
					<h6>Профиль</h6>
					<span>Информация о балансе и заказе</span>
				</section>

				<hr>

				<section class="user_profile-info-body">
					<i ref="UserIcon" :style="`background-image: url(${ UserState.UserImageID }); transform: scale(0)`" />
					<div class="user_profile-info-body-name">
						<tag :light="true">
							{{ UserState.UserName }}
						</tag>
						<span>{{ DefineUserStatus(UserState.UserStatus) }}</span>
					</div>
				</section>

				<hr>

				<section class="user_profile-info-footer">

					<h6>Информация</h6>
					<hr>
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

			<div class="user_profile-content">

				<section class="user_profile-content-header">
					<h6>{{ ComponentInfo.Title }}</h6>
					<span><i class="fas fa-info-circle" /> Информация о балансе и заказе</span>
				</section>

				<hr>
				
				<transition name="UserProfileComponentTransition" mode="out-in">

					<component :is="CurentPreferencesComponent" :key="`${CurentPreferencesComponent}-Key`" />

				</transition>

			</div>

			<div class="user_profile-navigation">

				<section class="user_profile-navigation-header">
					<h6>Навигация</h6>
					<span>Выберите нужный пункт меню</span>
				</section>

				<hr>

				<section class="user_profile-navigation-body">

					<eccheuma-button 
						v-for="(item, index) in PreferencesArea" 
						:key="`navigation-button-${ index }`"
						:indicator="item.Component === 'Messages' && NewMessages"
						:class="[
							{ active: CurentPreferencesComponent === item.Component }
						]"
						@click.native="AreaToggle( item.Component )"
						>
						{{ item.Name }}
					</eccheuma-button>

				</section>

				<hr>

				<section class="user_profile-navigation-footer">
					<eccheuma-button @click.native="Logout">
						Выход из аккаунта
					</eccheuma-button>
				</section>

			</div>

		</section>

	</eccheuma-collapse>

</template>

<style lang="scss">

@mixin section-header {

	text-align: center;

	place-content: center;
	display: flex;
	flex-direction: column;

	height: 10vh;

	h6 {

		display: block;
		color: rgb(var(--color-mono-900));
		font: {
			size: var(--font-size-36);
			family: var(--decor-font);
			// weight: 700;
		}

		letter-spacing: .25ch;
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
	position: absolute; z-index: 1020;
}

.UserProfileComponentTransition {
	&-enter {
		transform: translateY(-100px);
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
			transform: translateY(100px);
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
		width: calc(100vw - 10px);
		height: 75vh;

		overflow: hidden;

		text-align: center;

		backdrop-filter: blur(3px);
		background-color: rgba(var(--color-mono-200),.9);

		z-index: 1010;

		display: grid; 
		grid-template: {
			columns: 3fr 7fr 3fr;
			areas: 'info content nav'
		}

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template: {
				columns: 1fr;
				rows: auto auto auto;
			}
		}

		* > {
			opacity: 0;
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

		row-gap: 10px;
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
				border: 3px solid rgb(var(--color-mono-800));
				background-position: center center;
				background-size: cover;
				background-color: rgb(var(--color-mono-800));
			}

			&-name {
				span {
					&:last-child {
						display: block;
						margin-top: 1vh;
						color: rgb(var(--color-mono-600));
						font-size: var(--font-size-16);
						font-weight: 800;
					}
				}
			}

		}

		&-footer {

			background-color: rgb(var(--color-mono-300));
			border-radius: var(--border-radius);
			padding: 3vh 1.5vw;

			height: min-content;
			display: grid;
			row-gap: 1vh;

			place-content: center;

			h6 {
				display: block;
				color: rgb(var(--color-mono-900));
				font-size: var(--font-size-36);
				font-family: var(--decor-font);
				letter-spacing: .25ch;
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
				color: rgba(var(--color-mono-800),.75);
				line-height: 10px;
				strong {
					color: rgb(var(--color-mono-800));
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

		row-gap: 10px;
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
		row-gap: 10px;

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
		import type { VuexModules } 		from '~/typescript/VuexModules'

	// MIXINS
		import D_WorkStatus 	from '~/assets/mixins/filters/WorkStatus'
		import F_UserStatus 	from '~/assets/mixins/filters/UserStatus'

	// COMPONENTS
		import EccheumaCollapse from '~/components/common/EccheumaCollapse.vue'
		import EccheumaButton		from '~/components/buttons/CommonButton.vue'
		import Tag 							from '~/components/common/Tag.vue'

		type MODULES = 'Messages' | 'NameChange' | 'IconChange' | 'WorkRequests'

	// ANIMATION STATES 

		type ICON_ANIMATION_STATES = 'init' | 'update' | 'close'

		const ANIMATION_VARIATIONS: {[K in ICON_ANIMATION_STATES]: AnimeAnimParams } = {
			'init': {
				scale: [0, 1],
				delay: 250,
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
			EccheumaCollapse,
			Tag,
			EccheumaButton,
			Messages: 		() => import('~/components/user/ProfileComponents/Messages.vue'),
			NameChange: 	() => import('~/components/user/ProfileComponents/NameChange.vue'),
			IconChange: 	() => import('~/components/user/ProfileComponents/IconChange.vue'),
			WorkRequests: () => import('~/components/user/ProfileComponents/WorkRequests.vue'),
		},
		mixins: [ D_WorkStatus, F_UserStatus ],
		data() {
			return {

				CurentPreferencesComponent: 'Messages' as MODULES, 

				PreferencesArea: [

					{ Component: 'Messages', 			Name: 'Сообщения' 		},
					{ Component: 'NameChange', 		Name: 'Изменить Имя'	},
					{ Component: 'IconChange', 		Name: 'Смена иконки'	},
					{ Component: 'WorkRequests', 	Name: 'Запросы'				},

				] as Array<{ Component: MODULES, Name: string }>,
				
			}
		},
		computed: {

			...mapState({
				// AUTH
				LoginStatus:	 		state => (state as VuexModules).Auth.Auth.LoginStatus,
				// USER STATE
				UserProfileArea: 	state => (state as VuexModules).User.State.UserProfileArea,
				UserState:			 	state	=> (state as VuexModules).User.State.UserState,
				// MESSAGES
				MessagesCount: 		state => (state as VuexModules).User.Messages.Messages.length,
				NewMessages: 			state => (state as VuexModules).User.Messages.NewMessagesCount,
				// WORK REQUESTS
				RequestsQuantity: state => (state as VuexModules).User.WorkRequest.RequestQuantity,
				ActiveRequest: 		state => (state as VuexModules).User.WorkRequest.ActiveRequests,
			}),

			ComponentInfo(): { Title: string, Sub: string } {

				const T = {
					Messages: {
						Title: 'Сообщения',
						Sub: 'Подсказка: Нажмите "Ctrl + Enter" для отправки сообщения.',
					},
					NameChange: {
						Title: 'Смена имени пользователя',
						Sub: 'Подсказка: Нажмите "Shift + Enter" для подтверждения.',
					},
					IconChange: {
						Title: 'Смена иконки профиля',
						Sub: 'Подсказка: Нажмите "Shift + Enter" для подтверждения.',
					},
					WorkRequests: {
						Title: 'Статус заказа',
						Sub: 'Данная сводка полезна для проверки. В случае чего, пишите в чат через сообщения.',
					},
				}

				return T[this.CurentPreferencesComponent]

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
					this.$store.dispatch('User/WorkRequest/Set_ActiveRequest')
				}
			},
		},
		created() {

			this.Set_RequestQuantity(); 
			this.Set_RequestContent(); 

			this.FireBaseGetMessages(); 

		},
		mounted() {

			this.CheckMessages();
			
		},
		methods: {

			...mapActions({
				// AUTH
				Logout: 							'Auth/Logout',
				// MESSAGES
				FireBaseGetMessages: 	'User/Messages/FireBaseGetMessages',
				CheckMessages: 				'User/Messages/CheckMessages',
				// WORK REQUESTS
				Set_RequestQuantity: 	'User/WorkRequest/Set_RequestQuantity',
				Set_RequestContent: 	'User/WorkRequest/Set_RequestContent',
			}),

			AreaToggle( _component: MODULES ) {
				this.CurentPreferencesComponent = _component;
			},

			AnimateUserIcon(type: ICON_ANIMATION_STATES) {

				this.$AnimeJS({	

					targets: this.$refs.UserIcon,

					...ANIMATION_VARIATIONS[type],

				});

			},

			AnimateContainer(active: boolean) {
				
				this.$AnimeJS({
					targets: (this.$refs.UserProfileContainer as HTMLElement).children,
					opacity: active ? [0, 1] : [1, 0],
					duration: 500,
					easing: 'easeInOutCubic',
					complete: () => {
						switch (active) {

							case true: 
								this.AnimateUserIcon('init'); break;
						
							case false: 
								this.AnimateUserIcon('close'); break;

						}
					}
				})

			},

		},
	})

</script>
