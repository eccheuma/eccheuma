<template>
	<div class="auth_wrapper">

		<Loader />

		<!-- <form :class="themeChange && LocalThemeStatus ? 'auth_dark' : 'auth' "> -->
		<form class="auth">
			<div class="auth_header">
				<!-- Тело пользователя -->
				<template v-if="LoginStatus">
					<div class="auth_header_user">
						<div class="auth_header_user_wrap">
							<span
								:style="`background-image: url(${ UserState.UserImageID })`" 
								class="auth_user_icon" 
							/>
							<p>{{ UserState.UserName }}</p>
							<p>{{ DefineUserStatus(UserState.UserStatus) }}</p>
						</div>
						<div 
							class="auth_header_user_bg"
							:style="`background-image: url(${ UserState.UserImageID })`" 
						/>
					</div>
				</template>
				<!-- Тело регистрации -->
				<template v-else>
					<div class="auth_header_register">
						<i class="fas fa-user" />
						<i class="fas fa-user" />
						<p>Авторизация</p>     
					</div>
				</template>    
			</div>
			<div class="auth_body">
				<transition name="AuthTransition">
					<!-- Тело пользователя -->
					<template v-if="LoginStatus">
						<div class="auth_user">
							<span>
								Новые сообщения: <p>{{ NewMessages }} сообщений</p>
								<i id="AuthArea-3" class="fas fa-info-circle" />
								<!-- <b-popover 
									target="AuthArea-3" 
									triggers="hover" 
									:delay="{ show: 250, hide: 0 }"
									placement="top">
									Количество новых сообщений.
								</b-popover> -->
							</span>
							<span>
								Баланс: <p>{{ UserState.UserBalance }}  ₽</p>
								<i id="AuthArea-1" class="fas fa-info-circle" />
								<!-- <b-popover 
									target="AuthArea-1" 
									triggers="hover" 
									:delay="{ show: 250, hide: 0 }"
									placement="top">
									Ваш текущий баланс. 
								</b-popover> -->
							</span>
							<span>Статус Заказа: <p>{{ DefineWorkStatus(UserState.UserWorkStatus) }}</p>
								<i 
									id="AuthArea-2"
									class="fas" 
									:class="[
										UserState.UserWorkStatus == 0 ? 'fa-check auth_user_work-None' : '',
										UserState.UserWorkStatus == 1 ? 'fa-check auth_user_work-Progress' : '',
										UserState.UserWorkStatus == 2 ? 'fa-exclamation-circle auth_user_work-Done' : '',
										UserState.UserWorkStatus == 3 ? 'fa-check-double auth_user_work-Delivery' : '',
									]" 
								/>
								<!-- <b-popover 
									target="AuthArea-2" 
									triggers="hover" 
									:delay="{ show: 250, hide: 0 }"
									placement="top"
								>
									{{ DefineWorkStatus(UserState.UserWorkStatus) }}
								</b-popover> -->
							</span>
						</div>
					</template>
					<!-- Тело регистрации -->
					<template v-else>
						<div class="auth_register">
							<div class="auth_body_form">

								<div v-if="AuthError.length">
									<p>{{ DefineAuthError(AuthError) }}</p>
									<hr>
								</div>

								<span>Ваш логин и емайл</span>
								<input
									v-model="User.email"
									:class="$v.User.email.$invalid ? 'Input_Valid' : 'Input_Invalid' "
									type="email" 
									placeholder="example@gmail.com"
								>

								<span>Пароль</span>
								<input 
									v-model="User.password"
									:class="!$v.User.password.$invalid ? 'Input_Valid' : 'Input_Invalid' "
									type="password" 
									placeholder="Не менее шести знаков"
								>

							</div>
							<div class="auth_social mt-3">
								<p>Войти с помощью соц. сетей</p>
								<div class="container">
									<div class="row justify-content-center no-gutters">
										<div class="col">
											<i class="fab fa-vk NonActive" />
										</div>
										<div class="col">
											<i class="fab fa-facebook-f NonActive" />
										</div>
										<div class="col">
											<i class="fab fa-telegram NonActive" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>
				</transition>
			</div>
			<div class="auth_footer">
				<template v-if="!LoginStatus ">
					<button
						class="mb-2"
						:class="{ NonActive: $v.User.$invalid }"
						@click.prevent="Auth('Auth/Login/SignIn', 'Авторизация')"
						>
						Войти
					</button>
					<button
						style="font-size: .65rem"
						@click.prevent="ToggleRegisterModal"
						>
						Зарегистрироваться
					</button>
				</template>
				<template v-else>

					<nuxt-link v-if="UserState.UserID == __SELF_KEY__" to="/admin" class="mb-2">
						Админ панель
					</nuxt-link>

					<nuxt-link v-if="$isMobile" :to="`/user-panel?uid=${ UserState.UserID }`" class="mb-2">
						Личный кабинет
					</nuxt-link>

					<button @click.prevent="Auth('Auth/Logout/Logout', 'Выход из Аккаунта')">
						Выйти из Аккаунта
					</button>
					
				</template>
			</div>        
		</form>
	</div>
</template>

<style lang="sass">

.NonActive
	transition: all .75s ease-in-out
	pointer-events: none
	opacity: .25

.AuthTransition-enter 
	transform: translateX(100px)
	filter: opacity(0)
	&-active
		filter: opacity(0) 
	&-to
		transition: all .75s ease
		filter: opacity(1)

.Input
	&_Valid
		box-shadow: 0px 0px 0px 2px rgba(var(--color-Success),.75)
	&_Invalid
		box-shadow: 0px 0px 0px 2px rgba(var(--color-Wrong),.75)
		animation: Input_Invalid .25s 4 alternate
		@keyframes Input_Invalid
			0%
				transform: translateY(0px)
			100% 
				transform: translateY(4px)

.auth_user_icon
	display: block
	height: 70px    
	width: 70px 
	margin: 0px auto 10px
	background-size: cover
	background-position: center
	background-color: rgb(var(--color-5))
	border: 3px solid rgb(var(--color-3))
	border-radius: 10rem
	animation: auth_user_icon .25s 1 
	@keyframes auth_user_icon
		0%
			opacity: 0
			transform: scale(0) 
		100% 
			opacity: 1
			transform: scale(1)
	
.auth
	position: relative
	overflow: hidden
	background-color: rgb(var(--color-6))
	color: rgb(var(--color-3))
	border-radius: .7rem
	&_wrapper
		transition: all .75s ease
		position: relative
		padding: 10px 4px
	&_header
		overflow: hidden
		text-align: center
		border-bottom: 1px solid rgba(var(--color-4),.25)
		&_user
			position: relative
			padding: 20px 0px
			&_bg
				position: absolute
				top: 0
				height: 100%
				width: 100%
				background-size: cover
				background-position: center
				background-repeat: no-repeat
				z-index: 1
				filter: saturate(0) contrast(.5) opacity(.35) brightness(1.25)
				box-shadow: inset 0px 0px 50px 25px rgb(var(--color-6))
			&_wrap
				position: relative
				z-index: 20
				span
					margin-bottom: 15px
					border: 3px solid rgb(var(--color-6))
					filter: drop-shadow(0px 1vh 0px rgba(var(--color-1), .25))
				i
					font-size: 50px
					color: rgb(var(--color-3))
				p
					text-shadow: 0px 1px 0px rgb(var(--color-6))
					color: rgb(var(--color-3))
					margin: 0px 0px 0px
					font-size: 1rem
					font-weight: 700
					&:nth-of-type(2)
						font-size: var(--font-size-4)
		&_register
			position: relative
			padding: 20px 0px
			i 
				&:nth-child(1) 
					font-size: 30px
					margin: 10px 0 10px
					color: rgb(var(--color-4))
					border-radius: 3rem 
				&:nth-child(2) 
					position: absolute
					font-size: 70px
					top:  0
					left: -30px
					color: rgb(var(--color-6))
					text-shadow: 1px 0px 1px rgb(var(--color-4))
					opacity: .25
					transform: scale(2.75)
					// z-index: -1 
			p
				color: rgb(var(--color-4))
				margin: 0
				font-size: 14px
				font-weight: 700
	&_body
		padding: 30px 20px
		min-height: 240px
		&_form
			p
				background-color: rgb(var(--color-6))
				border: 3px solid var(--color-Warning)
				border-radius: .7rem
				padding: 10px 15px
				width: 100%
				text-align: center
				font-size: 12px
				font-weight: 600
		a
			display: block
			margin: 4px
			font-size: 10px
			font-weight: 700
			text-align: center 
		span
			display: block
			color: rgb(var(--color-4))
			font-size: 10px
			font-weight: 700
			padding: 0 10px
		input
			outline: none
			text-align: center
			width: 100%
			padding: 2px
			margin-bottom: 10px
			font-size: 10px
			font-weight: 700
			border-radius: .7rem
			border: 1px solid rgba(var(--color-4),.25)
			background-color: transparent
			&:focus
				background-color: rgba(#50c6f1,.1)
	&_user
		&_work
			&-None
				color: rgb(var(--color-5))
			&-Progress
				color: var(--color-Warning)
				animation: auth_user_work-Progress 1s infinite
				animation-direction: alternate
				@keyframes auth_user_work-Progress
					0%
						opacity: .5
					100% 
						opacity: 1
			&-Done
				color: var(--color-Success)
				animation: auth_user_work-Done .5s infinite
				animation-direction: alternate
				@keyframes auth_user_work-Done
					0%
						transform: scale(1)
					100% 
						transform: scale(1.25)
			&-Delivery
				color: var(--color-Success)
		span
			display: block
			color: rgb(var(--color-4))
			font-size: 10px
			font-weight: 700
			padding: 0px 5px
			// text-align: center
			i
				padding-left: 10px
				font-size: 17px
				transform: translateY(1px)
				cursor: pointer
			p
				display: inline-block
				width: 85%
				border: 1px solid rgba(var(--color-4),.5)
				border-radius: .7rem
				padding: 4px 10px
				margin: 5px 0px 10px
				text-align: right
				font-size: .7rem
				color: rgb(var(--color-3))
				font-weight: 700
	&_footer
		padding: 30px 0px
		border-top: 1px solid rgba(var(--color-4),.25)
		button, p, a
			margin: 0 10%
			width: 80%
			border-radius: .7rem  
			display: block
			text-align: center
			color: rgb(var(--color-3))
			background-color: transparent
			line-height: 25px
			font-size: 10px
			font-weight: 700
			cursor: pointer
			transition-duration: .2s
			@extend %button_switch
	&_social
		border-top: 1px solid rgba(var(--color-4),.25)
		height: 100%
		padding: 15px 0px 0px
		outline: none
		p
			text-align: center
			font-size: 10px
			font-weight: 700    	
		i
			display: block
			padding: 5px 10px
			margin: 0px 10px
			text-align: center
			outline: none
			border-radius: .7rem
			background-color: transparent
			color: rgb(var(--color-3))
			font-size: 14px
			cursor: pointer
			transition-duration: .2s
			@extend %button_switch
		
</style>

<script lang="ts">

	import Vue from 'vue'

	import { mapState, mapMutations } from 'vuex'

	// VUELIDATE
		import { email, required, minLength } from 'vuelidate/lib/validators'

	// MIXINS
		import EmitSound 			from '~/assets/mixins/EmitSound'
		import D_AuthError 		from '~/assets/mixins/filters/AuthError'
		import F_WorkStatus 	from '~/assets/mixins/filters/WorkStatus'
		import F_UserStatus 	from '~/assets/mixins/filters/UserStatus'

	// COMPONENTS
		import Loader from '~/components/common/Loader.vue'

	// TYPES

		// VUEX MODULE TYPE MAP
		import type { VuexModules } from '~/types/VuexModules'

		// AUTH TYPES
		import type { REGISTER_FORM } 	from '~/store/Auth/Auth.ts'

		type AuthMethod = 'Auth/Logout/Logout' | 'Auth/Login/SignIn'

	// MODULE
	export default Vue.extend({
		components: {
			Loader
		},
		mixins: [ EmitSound, F_WorkStatus, F_UserStatus, D_AuthError ],
		data() {
			return {

				User: {
					email: '',
					password: '',
				} as REGISTER_FORM

			}
		},
		validations: {
			User: {
				email: { email, required },
				password: { required, minLength: minLength(6) }
			}
		},
		computed: {

			...mapState({
				LoginStatus: 		( state: any ) => ( state as VuexModules ).Auth.Auth.LoginStatus,
				AuthError: 			( state: any ) => ( state as VuexModules ).Auth.Auth.AuthError,
				LoaderMessage: 	( state: any ) => ( state as VuexModules ).Loader.Message,
				LoaderStatus:		( state: any ) => ( state as VuexModules ).Loader.Status,
				UserState: 			( state: any ) => ( state as VuexModules ).User.State.UserState,
				NewMessages:		( state: any ) => ( state as VuexModules ).User.Messages.NewMessagesCount
			}),

		},
		watch: {
			LoginStatus: {
				handler() {
					this.LoginStatus 
						? this.EmitSound('In', { rate: 1 }) 
						: this.EmitSound('In', { rate: .75 })
				}
			},
			User: {
				handler() {
					this.EmitSound('Tap', { rate: 1.5, volume: .5 })
				},
				deep: true
			},
		},
		methods: {

			...mapMutations({
				ToggleRegisterModal: 'Auth/Register/ToggleRegisterModal',
				Change_LoaderMessage: 		'Loader/Loader_ChangeLoadMessage',
			}),

			Auth(method: AuthMethod, message: string) {

				this.Change_LoaderMessage(message)

				const RegisterForm: REGISTER_FORM = {
					email: this.User.email,
					password: this.User.password
				}

				this.$store.dispatch(method, RegisterForm)
				
			},

		},
	})

</script>
