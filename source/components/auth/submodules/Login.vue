<template>
	<div class="auth_login-container" @mouseenter.once="inFocus = true" @keydown.enter.prevent="sendForm()">

		<section v-once class="auth_login-header">

			<!-- <i class="fas fa-user" /> -->

			<div class="auth_login-header-wrap">
				<icon name="Auth" />
				<span>Авторизация</span>  
			</div>

		</section>

		<section class="auth_login-body">

			<div class="auth_login-body-email">
				<span>Ваш email</span>
				<template v-if="$v.Form.email">
					<input 
						v-model="Form.email"
						type="email"
						:class="[
							{ invalid: $v.Form.email.$invalid 
								&& $v.Form.email.$dirty 
								&& Form.email.length 
							},
							{ valid: !$v.Form.email.$anyError 
								&& $v.Form.email.$dirty 
								&& Form.email.length 
							},
						]"
						@input="inputSound"
						@change.once="$v.Form.email && $v.Form.email.$touch()"
					>
				</template>
			</div>

			<div class="auth_login-body-password">
				<span>Ваш пароль</span>
				<template v-if="$v.Form.password">
					<input 
						v-model="Form.password"
						type="password"
						:class="[
							{ invalid: $v.Form.password.$invalid && $v.Form.password.$dirty && Form.password.length },
							{ valid: !$v.Form.password.$anyError && $v.Form.password.$dirty && Form.password.length }
						]"
						@input="inputSound"
						@change.once="$v.Form.password && $v.Form.password.$touch()"
					>
				</template>
			</div>

			<caption-card 
				v-if="AuthError" 
				:status="[
					{ 'error': AuthError === 'auth/invalid-email' }
				]"
			>
				<template #type>
					Ошибка входа
				</template>
				<template #desc>
					{{ DefineAuthError(AuthError) }}
				</template>
			</caption-card>

			<div class="auth_login-body-social">

				<span>
					Войти с помощью соц. сетей
				</span>

				<hr v-once>

				<div v-once class="auth_login-body-social-wrap">
					<button>
						<icon name="VK" />
					</button>
					<button>
						<icon name="Telegramm" />
					</button>
					<button>
						<icon name="Google" />
					</button>
				</div>

			</div>

		</section>

		<section class="auth_login-footer">

			<eccheuma-button 
				:class="[
					{ disabled: $v.Form.$anyError }
				]"
				@click.native="sendForm()"
				>
				Войти
			</eccheuma-button>

			<eccheuma-button v-once @click.native="toggleRegisterModal()">
				Зарегистрироваться
			</eccheuma-button>
			
		</section>

	</div>
</template>

<style lang="scss">

	.auth_login {

		&-container {
			overflow: {
				x: hidden;
			}
		}

		&-header {

			position: relative;
			display: flex;

			min-height: 20vh;
		
			border: {
				bottom: 1px solid rgb(var(--color-mono-300));
			}

			&-wrap {

				margin: auto;
				padding-bottom: 2vh;

				display: block;

				text: {
					align: center;
				}

				i {
					@include icon-size(10vh);
					fill: rgb(var(--color-mono-900));
				}

				> span {

					display: block;
					color: rgb(var(--color-mono-900));

					&:nth-of-type(1) {
						font: {
							size: var(--font-size-36);
							family: var(--decor-font);
						}

						letter-spacing: .15ch;
						line-height: var(--size-36);
					}

				}
			}

		}

		&-body {

			display: inline-grid;
			width: 100%;

			padding: 2vh 0;

			span {
				display: block;
				color: rgb(var(--color-mono-900));
				margin: { bottom: .5vh };
				font: {
					size: var(--font-size-14);
					weight: 600;
				}
			}

			input {

				width: 100%;

				color: rgb(var(--color-mono-900));
				background-color: rgb(var(--color-mono-300));
				border: 2px solid var(--color-accent-edges-100);

				border: {
					radius: var(--border-radius);
				}

				padding: .5vh 1vw;

				font: {
					size: var(--font-size-14);
					weight: 600;
				}

				line-height: 3vh;

				transition-duration: 500ms;
				&:focus {
					outline: 0px solid transparent;
					border-color: var(--color-accent-edges-300);
				}
			}

			.valid {
				border: 2px solid var(--color-accent-pass) !important;
			}

			.invalid {
				border: 2px solid var(--color-accent-error) !important;
			}

			&-email {
				justify-self: center;
				width: 75%;
				margin-bottom: 1vh;
			}

			&-password {
				justify-self: center;
				width: 75%;
				margin-bottom: 1vh;
			}

			&-social {

				@include gradient_border;
				@extend %pattern-lines;

				margin: 2vh 0 0;
				padding: 2vh 0;
				background-color: rgb(var(--color-mono-300));

				> hr {
					margin: 1vh 15%;
				}

				span {

					text: {
						align: center;
					}

				}

				i {
					fill: rgb(var(--color-mono-900));
				}

				&-wrap {
					margin: 2vh auto;
					width: 75%;
					display: flex;
					justify-content: space-between;
				}

				button {
					@include push-button {

						padding: 4px 10%;
						line-height: 21px;

						background: {
							color: transparent;
						}
					}
				}

			}

		}
		
		&-footer {

			border-top: 1px solid rgb(var(--color-mono-300));
			padding: 2vh 0;

			button {
				width: 75%;
				margin: 1vh auto;
			}

			.disabled {
				opacity: .25;
				pointer-events: none;
			}
		}

	}

</style>

<script lang="ts">

import Vue from 'vue'

// VUEX
	import { mapState, mapMutations, mapActions } from 'vuex'

// VUELIDATE
	import { email, required, minLength } from 'vuelidate/lib/validators'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'
	import F_AuthErrors from '~/assets/mixins/filters/AuthError'

// TYPES 

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/typescript/VuexMap'

	// OTHER TYPES
	import type { REGISTER_FORM } from '~/store/Auth/Session'

	// COMPONENTS
	import EccheumaButton from '~/components/buttons/CommonButton.vue';
	import Icon 					from '~/components/common/Icon.vue';
	import CaptionCard 		from '~/components/common/Caption.vue'

// MODULE
	export default Vue.extend({
		components: {
			EccheumaButton,
			CaptionCard,
			Icon,
		},
		mixins: [ EmitSound, F_AuthErrors ],
		data() {
			return {

				inFocus: false,

				Form: {
					email: '',
					password: '',
				} as REGISTER_FORM

			}
		},
		validations: {
			Form: {
				email: 		{ email, required },
				password: { required, minLength: minLength(6) }
			}
		},
		computed: {

			...mapState({
				LoginStatus: 	state => (state as VuexMap).Auth.Session.LoginStatus,
				AuthError: 		state => (state as VuexMap).Auth.Session.AuthError,
			})

		},
		mounted() {

			if ( process.browser ) {

				this.setSounds([
					{ file: 'Off', name: 'Input::Increment', settings: { rate: 0.65, volume: .25 } },
					{ file: 'Off', name: 'Input::Decrement', settings: { rate: 0.50, volume: .25 } },
				])

			}

		},
		methods: {

			...mapActions({
				signIn: 'Auth/Login/SignIn'
			}),

			...mapMutations({
				toggleRegisterModal: 'Auth/Register/ToggleRegisterModal',
			}),

			inputSound(input: InputEvent) {
				if ( this.inFocus ) {
					this.playSound(this.Sounds.get(input.data ? 'Input::Increment' : 'Input::Decrement'))
				}
			},

			sendForm() {

				if ( !this.$v.Form.$anyError ) {
					this.signIn(this.Form)
				}

			}

		}
	})

</script>
