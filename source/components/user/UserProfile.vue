<template>

	<eccheuma-collapse class="user_profile-collapse"
		@collapsed="AnimateContainer"
		:active="UserProfileArea" 
		:options="{ duration: 500 }">

		<section class="user_profile-container" ref="UserProfileContainer">
			<div class="user_profile-info">

				<section class="user_profile-info-header">
					<h6>Профиль</h6>
					<span>Информация о балансе и заказе</span>
				</section>

				<section class="user_profile-info-body">
					<i :style="`background-image: url(${ UserState.UserImageID })`" ref="UserIcon" />
					<span>{{ UserState.UserName }}</span>
				</section>

				<section class="user_profile-info-footer">

					<h6>Информация</h6>

					<hr>

					<span>
						<div>Баланс: </div>
						<strong>{{ UserState.UserBalance }} ₽</strong>
					</span>
					<span>
						<div>Сообщений: </div>
						<strong>{{ MessagesCount }} ( Новых: {{ NewMessages }} )</strong>
					</span>

					<template v-if="ActiveRequest.length">
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
					</template>

					<span>
						<div>Заказов в прогрессе: </div>
						<strong>{{ RequestsQuantity }}</strong>
					</span>

				</section>

			</div>
			<div class="user_profile-content">

				<section class="user_profile-content-header">
					<h6>{{ ComponentInfo.Title }}</h6>
					<span><i class="fas fa-info-circle"/> Информация о балансе и заказе</span>
				</section>
				
				<transition name="UserProfileComponentTransition" mode="out-in">

					<component :is="CurentPreferencesComponent" :key="`${CurentPreferencesComponent}-Key`" />

				</transition>

			</div>
			<div class="user_profile-navigation">

				<section class="user_profile-navigation-header">
					<h6>Навигация</h6>
					<span>Выберите нужный пункт меню</span>
				</section>

				<section class="user_profile-navigation-body">

					<button v-for="(item, index) in PreferencesArea" 
									:key="`navigation-button-${ index }`"
									:class="{ active: CurentPreferencesComponent == item.Component }" 
									@click="AreaToggle( item.Component )">
									{{ item.Name }}
					</button>

					<button @click="Logout">Выход из аккаунта</button>

				</section>

			</div>
		</section>

	</eccheuma-collapse>

</template>

<style lang="scss">

.user_profile-collapse {
	position: absolute; z-index: 1000;
}

$HeaderHeight: 70vh;

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

		// position: absolute; z-index: 1000;
		width: calc(100vw - 10px); height: $HeaderHeight;

		overflow: hidden;

		text-align: center;

		backdrop-filter: blur(3px);
		background-color: rgba($color1,.9);

		display: grid; 
		grid-template: {
			columns: 2fr 5fr 2fr;
		}

	}

	&-info {

		hr {
			width: 100%;
			background-color: $color3;
		}

		padding: 2vh 0;

		border: {
			right: 1px solid $color3;
		} 

		&-header {

			padding: 0 1vw;
			text-align: center;

			h6 {
				display: block;
				color: $color5;
			}

			span {
				display: block;
				color: $color6;
			}

		}

		&-body {

			margin: 5vh 0;

			span {
				display: block;
				width: 100%;
				color: $color6;
				font: {
					weight: 700;
				}
			}

			i {
				$s: 80px;
				display: block;
				height: $s; width: $s;
				margin: 2vh auto;
				border-radius: 100%;
				border: 3px solid $color6;
				background-position: center center;
				background-size: cover;
				background-color: $color6;
				// transform: scale(0);
			}

		}

		&-footer {

			padding: 0 2vw;

			h6 {
				display: block;
				color: $color5;
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
				color: rgba($color6,.75);
				line-height: 10px;
				strong {
					color: $color6;
					font-weight: 700;
					text-align: right;
				}
			}

		}

	}

	&-content {

		padding: 2vh 2vw;

		&-header {

			h6 {
				display: block;
				color: $color5;
			}

			span {
				display: block;
				color: $color6;
			}

		}

	}

	&-navigation {

		$padY: 2vh;

		padding: $padY 0;

		border: {
			left: 1px solid $color3;
		} 

		&-header {
			
			h6 {
				display: block;
				color: $color5;
			}

			span {
				display: block;
				color: $color6;
			}

		}

		&-body {

			padding: 3vh 2vw;
			display: grid;
			height: calc(100% - #{ $padY * 2 });

			grid-template: {
				rows: repeat(12, auto);
			}

			.active {

				width: 75%;

				margin: { 
					bottom: 2vh;
				};

				background-color: transparent;
				color: $color5;
			}

			button {
				@include light-button { 
					margin: { bottom: 2vh };
					display: block;
					width: 100%;
					justify-self: center; 
					line-height: 0px;
				};
				&:last-of-type {
					grid-row: -1;
				}
			}

		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// declare module 'vue/types/vue' {
	// 	interface Vue {
	// 		$AnimeJS: any
	// 	}
	// }

	// VUEX
		import { mapState, mapMutations, mapActions, Mapper,  } from 'vuex'
		import type { VuexModules } from '~/types/VuexModules'

	// VUELIDATE
		import type { validationMixin } 						from "vuelidate"
		import 			{ email, required, minLength } 	from 'vuelidate/lib/validators'

	// MIXINS
		import EmitSound 			from '~/assets/mixins/EmitSound'
		import D_WorkStatus 	from '~/assets/mixins/filters/WorkStatus'
		// import D_UserStatus 	from '~/assets/mixins/filters/UserStatus'

	// TYPES
		type MODULES = 'Messages' | 'NameChange' | 'IconChange' | 'WorkRequests'

	// COMPONENTS
		import EccheumaCollapse from '~/components/common/EccheumaCollapse.vue'

	// ANIMATION STATES 

		type ICON_ANIMATION_STATES = 'init' | 'update' | 'close'

		const ANIMATION_VARIATIONS: {[K in ICON_ANIMATION_STATES]: anime.AnimeParams} = {
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
		mixins: [ EmitSound, D_WorkStatus ],
		components: {
			EccheumaCollapse,
			Messages: 		() => import('~/components/user/ProfileComponents/Messages.vue'),
			NameChange: 	() => import('~/components/user/ProfileComponents/NameChange.vue'),
			IconChange: 	() => import('~/components/user/ProfileComponents/IconChange.vue'),
			WorkRequests: () => import('~/components/user/ProfileComponents/WorkRequests.vue'),
		},
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
						Title: `Сообщения`,
						Sub: `Подсказка: Нажмите "Ctrl + Enter" для отправки сообщения.`,
					},
					NameChange: {
						Title: `Смена имени пользователя`,
						Sub: `Подсказка: Нажмите "Shift + Enter" для подтверждения.`,
					},
					IconChange: {
						Title: `Иконка профиля`,
						Sub: `Подсказка: Нажмите "Shift + Enter" для подтверждения.`,
					},
					WorkRequests: {
						Title: `Статус заказа`,
						Sub: `Данная сводка полезна для проверки. В случае чего, пишите в чат через сообщения.`,
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
				this.CurentPreferencesComponent = _component
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
					direction: 'linear',
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
		created() {

			this.Set_RequestQuantity(); 
			this.Set_RequestContent(); 

			this.FireBaseGetMessages(); 

		},
		mounted() {

			this.CheckMessages();
			
		},
	})

</script>