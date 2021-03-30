<template>

	<transition name="opacity-transition">
		<div class="registration-wrap" v-if="RegistrationModal"  
			@click.self="ChangeModalStatus"
			@keydown.shift.enter="Auth"
			:class="{ glassy: CLIENT_RENDER_CHECK && $PIXI.utils.isWebGLSupported() }">

			<loader
				:ElementLoad="LoaderStatus.Load"
				:ElementLoadComplete="LoaderStatus.Loaded">
				{{ LoaderMessage }}
			</loader>

			<section class="registration-container">

				<div class="registration-header">

					<span>
						{{ AuthError ? 'Ошибка в форме' : 'Форма регистрации' }}
					</span>

					<template v-if="AuthError">
						<span>{{ DefineError(AuthError) }}</span>
					</template>

				</div>
				<div class="registration-body">

					<section>
						<span>Имя пользователя</span>
						<span>( Не меньше 3 символов )</span>
						<input 
							@input.once="$v.Name.$touch()"
							:class="[
								{ valid: 	!$v.Name.$invalid && $v.Name.$dirty },
								{ invalid: $v.Name.$invalid && $v.Name.$dirty },
							]"
							v-model="Name" 
							type="name" placeholder="LoliBomberAF">
					</section>

					<section>
						<span>Электронная почта</span>
						<span>( Должно соответствовать шаблону ' ***** @ **** . ** ' )</span>
						<input
							@input.once="$v.Email.$touch()"
							:class="[
								{ valid: 	!$v.Email.$invalid && $v.Email.$dirty },
								{ invalid: $v.Email.$invalid && $v.Email.$dirty },
							]"
							v-model="Email" 
							type="email" placeholder="LoliBomberAF@gmail.com">
					</section>


					<!-- $v.Password.$invalid ? 'invalid' : 'valid' -->

					<section>
						<span>Придумайте пароль</span>
						<span>( Не меньше 6 символов латиницой )</span>
						<input
							@input.once="$v.Password.$touch()"
							:class="[
								{ valid: 	!$v.Password.$invalid && $v.Password.$dirty },
								{ invalid: $v.Password.$invalid && $v.Password.$dirty },
							]"
							v-model="Password" 
							type="password">
					</section>

				</div>
				<div class="registration-footer">
					<button 
						@click="Auth" 
						:class="{ disabled: $v.$dirty && $v.$anyError }">
						
						Отправить форму

					</button>
				</div>
			</section>

		</div>
	</transition>

</template>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapState, mapMutations, mapActions } from 'vuex'
		import type { VuexModules } from '~/types/VuexModules'

	// TYPES & INTERFACES & ENUMS
		import type { REGISTER_FORM, AUTH_ERRORS } from '~/store/Auth/Auth'

	// VUELIDATE
		import { email, required, minLength, alphaNum } from 'vuelidate/lib/validators'

	// COMPONENTS
		import Loader from '~/components/common/Loader.vue'

	// MODULE
		export default Vue.extend({
			data() {
				return {

					ElementLoad: true,
					ElementLoadComplete: true,

					Email: '',
					Password: '',
					Name: '',

				}
			},
			components: {
				Loader
			},
			validations: {

				Email: { email, required },
				Password: { required, alphaNum, minLength: minLength(6) },
				Name: { required, minLength: minLength(3) },

			},
			computed: {

				...mapState({

					LoginStatus: 				state => (state as VuexModules).Auth.Auth.LoginStatus,

					RegistrationModal: 	state => ( state as VuexModules ).Auth.Register.Modal,
					AuthError: 					state => ( state as VuexModules ).Auth.Auth.AuthError,
					LoaderMessage: 			state => ( state as VuexModules ).Loader.Message,
					LoaderStatus: 			state => ( state as VuexModules ).Loader.Status,
				}),

			},
			watch: {
				LoginStatus: {
					handler() {
						this.ChangeModalStatus(false)
					},
					deep: true
				}
			},
			methods: {

				...mapMutations({
					ChangeModalStatus: 'Auth/Register/ToggleRegisterModal',
					ChangeLoadMessage: 'Loader/Loader_ChangeLoadMessage',
				}),

				...mapActions({
					Register: 'Auth/Register/Register',
				}),

				DefineError(e: AUTH_ERRORS): string {

					enum ERROR {
						'auth/network-request-failed'	= 'Ошибка соединения',
						'auth/user-not-found' 				= 'Пользователя с такой почтой не существует',
						'auth/invalid-email' 					= 'Поле не соответствует критериям почты',
						'auth/wrong-password'					=	'Неверный пароль',
						'auth/email-already-in-use' 	= 'Данная почта занята другим пользователем',
					}

					return ERROR[e] ?? e

				},
				
				Auth() {

					this.ChangeLoadMessage('Отправка формы')

					const FORM: REGISTER_FORM  = {
						email: this.Email,
						password: this.Password,
						name: this.Name,
					} 

					this.Register(FORM)

				}

			}
		})

</script>

<style lang="scss">

.glassy {
	backdrop-filter: blur(5px)
}

.registration {
	&-wrap {
		position: fixed; top: 0; left: 0; z-index: 10000;
		width: 100vw; height: 100vh;
		background-color: rgba(var(--color-1), .9);
		&:before {
			content: '';
			position: absolute; top: 0; left: 0;  z-index: -1;
			width: 100vw; height: 100vh; opacity: .5;
			background: {
				image: url('~assets/images/SVG/Stripes.svg');
				size: 20px;
			}
			mix-blend-mode: multiply;
			@media screen and ( max-width: var(--mobile-breakpoint)) {
				mix-blend-mode: unset;
			}
		}
	}
	&-container {

		$w: 75vw; $h: 90vh;

		position: absolute; 
		top: #{(100vh - $h) / 2}; 
		left: #{(100vw - $w) / 2}; 
		width: $w; height: $h;
		background-color: rgb(var(--color-1));

		display: grid;
		grid-template: {
			columns: 100%;
			rows: 1fr 6fr 1fr;
		}

		border-radius: .7rem; overflow: hidden;
		border: 1px solid rgb(var(--color-3))

	}
	&-header {

		@include gradient_border(bottom);

		display: flex;

		padding: 2vh 0;
		width: 100%;

		color: rgb(var(--color-6));

		span {

			margin: auto;

			&:nth-of-type(1) {
				font: {
					size: 1rem;
					weight: 700;
				}
			}
			&:nth-of-type(2) {
				font: {
					size: .75rem;
					weight: 500;
				}
			}
		}
	}
	&-body {

    display: inline-grid;
		align-content: center;

		padding: 0 25%;
		color: rgb(var(--color-6));
		background-color: rgb(var(--color-2));

		.invalid {
			border: 1px solid var(--color-Wrong)
		}

		.valid {
			border: 1px solid var(--color-Success)
		}

		section {

			padding: 2vh 0;

			span {
				margin: { left: 3ch };
				&:nth-of-type(1) {
					font: {
						weight: 700;
					}
				}
				&:nth-of-type(2) {
					color: rgb(var(--color-4));
				}
			}
			input {
				display: block;
				outline: none;
				width: 90%;
				border-radius: .7rem;
				background-color: rgb(var(--color-1));
				border: 1px solid rgb(var(--color-3));
				color: rgba(var(--color-6), .75);
				font-weight: 700;
				font-size: var(--font-size-4);
				padding: 1vh 15px;
				margin: { bottom: 1vh; top: 1vh };
			}
		}

	}
	&-footer {

		@include gradient_border(top);

		display: flex;

		.disabled {
			pointer-events: none;
			opacity: .25;
		}

		button {
			@include light-button {
				width: 25vw; height: min-content; margin: auto;
			}
		}
	}
}

</style>