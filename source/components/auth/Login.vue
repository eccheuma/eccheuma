<template>
	<div class="auth_login-container" @mouseenter.once="inFocus = true" @keydown.enter.prevent="sendForm()">

		<section class="auth_login-header">

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
							{ invalid: $v.Form.email.$invalid && $v.Form.email.$dirty },
							{ valid:	!$v.Form.email.$anyError && $v.Form.email.$dirty },
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
							{ invalid: $v.Form.password.$invalid && $v.Form.password.$dirty },
							{ valid: !$v.Form.password.$anyError && $v.Form.password.$dirty }
						]"
						@input="inputSound"
						@change.once="$v.Form.password && $v.Form.password.$touch()"
					>
				</template>
			</div>

			<div class="auth_login-body-social">

				<span>
					Войти с помощью соц. сетей
				</span>

				<hr>

				<div class="auth_login-body-social-wrap">
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
				line-height: 21px;

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

		&-wrap {

			margin: auto;

			display: block;

			color: rgb(var(--color-3));

			text: {
				align: center;
			}

			i {
				@include icon-size(10vh);
				background-color: rgb(var(--color-3));
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

			i {
				background-color: rgb(var(--color-3));
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
			line-height: 21px;
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
	import type { VuexModules } from '~/typescript/VuexModules'

	// OTHER TYPES
	import type { REGISTER_FORM } from '~/store/Auth/Auth'

	// COMPONENTS
	import Icon 					from '~/components/Icon.vue';

// MODULE
	export default Vue.extend({
		components: {
			Icon,
		},
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
		created() {
			this.setSounds([
				{
					file: 'Tap',
					name: 'InputIncrement',
					settings: { rate: 1.10 },
				},
				{
					file: 'Tap',
					name: 'InputDecrement',
					settings: { rate: 0.95 },
				},
			])
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

					this.playSound(this.Sounds.get(input.data ? 'InputIncrement' : 'InputDecrement'))

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
