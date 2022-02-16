<template>
	<section class="auth_wrapper">

		<loader
			:stages="authLoadStages" 
			:ignite="false"
			:forcedStage="actualStage"
			:controllable="true"
			style="position: absolute" 
			/>

		<transition name="opacity-transition" mode="out-in">
			<component :is="!LoginStatus ? 'AuthLogin' : 'AuthProfile'" />
		</transition>

	</section>
</template>

<style lang="scss">

.auth_wrapper {

	@include component-shadow;
	
	@extend %card-container;

	position: relative; z-index: 1;
	color: rgb(var(--color-mono-200));
	border-radius: var(--border-radius);
	overflow: hidden;
	width: 100%;
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'

	// COMPONENTS
	import Loader, { LoadStage } from '~/components/common/Loader.vue'

	import AuthLogin 			from '~/components/auth/submodules/Login.vue'
	import AuthProfile 		from '~/components/auth/submodules/Profile.vue'

	// TYPES
	import type { VuexMap } from '~/typescript/VuexMap'

	// MODULE
	export default Vue.extend({
		components: {
			Loader,
			AuthLogin,
			AuthProfile,
		},
		data() {
			return {

				actualStage: -1,

				authLoadStages: [
					{ LoadPoint: 0, 	Message: 'Отправка формы' },
					{ LoadPoint: 100, Message: 'Вход' },
				] as LoadStage[],

			}
		},
		computed: {

			...mapState({
				AuthError: 		state => ( state as VuexMap ).Auth.Session.AuthError,
				LoginStatus: 	state => ( state as VuexMap ).Auth.Session.LoginStatus,
				LoginAction:	state => ( state as VuexMap ).Auth.Login.inAction,
			}),

		},
		watch: {
			LoginAction: {
				handler(value) {
					if (value) {
						this.actualStage = 0;
					}
				}
			},
			LoginStatus: {
				handler(value) {
					if (value) {
						this.actualStage = 1;
					}
				}
			}
		},

	})
	
</script>
