<template>
	<div class="auth_login-container" @mouseenter.once="inFocus = true">

		<section class="auth_login-header">

			<i class="fas fa-user" />

			<div class="auth_login-header-wrap">
				<i class="fas fa-user" />
				<span>Авторизация</span>  
			</div>

		</section>

		<section class="auth_login-body">

			<div class="auth_login-body-email">
				<span>Ваш email</span>
				<input 
					v-model="Form.email"
					type="email"
					:class="[
						{ invalid: $v.Form.email.$invalid && $v.Form.email.$dirty },
						{ valid: !$v.Form.email.$anyError && $v.Form.email.$dirty },
					]"
					@input="inputSound"
					@change.once="$v.Form.email.$touch()"
				>
			</div>

			<div class="auth_login-body-password">
				<span>Ваш пароль</span>
				<input 
					v-model="Form.password"
					type="password"
					:class="[
						{ invalid: $v.Form.password.$invalid && $v.Form.password.$dirty },
						{ valid: !$v.Form.password.$anyError && $v.Form.password.$dirty }
					]"
					@input="inputSound"
					@change.once="$v.Form.password.$touch()"
				>
			</div>

			<div class="auth_login-body-social">

				<span>
					Войти с помощью соц. сетей
				</span>

				<hr>

				<div class="auth_login-body-social-wrap">
					<button>
						<i class="fab fa-vk" />
					</button>
					<button>
						<i class="fab fa-facebook-f" />
					</button>
					<button>
						<i class="fab fa-telegram" />
					</button>
				</div>

			</div>

		</section>

		<section class="auth_login-footer">

			<button 
				:class="[
					{ disabled: $v.Form.$anyError }
				]"
				@click="sendForm()"
				>
				Войти
			</button>

			<button @click="toggleRegisterModal()">
				Зарегистрироваться
			</button>
			
		</section>

	</div>
</template>

<style lang="scss">

.auth_login {

	&-container {

		margin: 4px;

		background: {
			color: rgb(var(--color-6));
		}

		border: {
			radius: .7rem;
		}

		overflow: {
			x: hidden;
		}

		button {
			@include push-button {

				padding: 4px 10%;

				background: {
					color: transparent;
				}
			}
		}

	}

	&-header {

		position: relative;
		display: flex;

		min-height: 15vh;

		border: {
			bottom: 1px solid rgb(var(--color-5));
		}

		> i {
			
			$s: 15vh;

			position: absolute;
			color: rgb(var(--color-5));

			top: 0; left: -#{$s / 4};

			font: {
				size: $s;
			}

		}

		&-wrap {

			margin: auto;

			display: block;

			color: rgb(var(--color-3));

			text: {
				align: center;
			}

			i {

				margin: { bottom: 1vh };

				font: {
					size: 2rem;
					weight: 700;
				}
			}

			span {
				display: block;
				font: {
					size: .75rem;
					weight: 700;
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
			color: rgb(var(--color-4));
			margin: { bottom: .5vh };
			font: {
				size: .65rem;
				weight: 600;
			}
		}

		input {

			width: 100%;

			border: 1px solid rgb(var(--color-5));
			border: {
				radius: .7rem;
			}

			padding: .5vh 1vw;

			font: {
				size: .65rem;
				weight: 600;
			}

			&:focus {
				outline: 0px solid transparent;
			}
		}

		.valid {
			border: 1px solid var(--color-Success);
		}

		.invalid {
			border: 1px solid var(--color-Wrong);
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

			margin: 2vh 0 0;

			hr {
				margin: 1vh 15%;
			}

			span {

				text: {
					align: center;
				}

			}

			&-wrap {
				margin: 2vh auto;
				width: 75%;
				display: flex;
				justify-content: space-between;
			}

		}

	}
	
	&-footer {

		padding: 2vh 0;

		border: {
			top: 1px solid rgb(var(--color-5));
		}

		button {
			width: 75%;
			margin: 1vh auto;
			display: block;
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

// TYPES 

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// OTHER TYPES
	import type { REGISTER_FORM } 	from '~/store/Auth/Auth.ts'

// MODULE
	export default Vue.extend({
		mixins: [ EmitSound ],
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
				LoginStatus: 	state => (state as VuexModules).Auth.Auth.LoginStatus,
			})

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
					input.data 
						? this.EmitSound('Tap', { rate: 1.10 }) 
						: this.EmitSound('Tap', { rate: 0.95 }) 
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
