<template>
	<section class="auth_wrapper">

		<!-- <loader 
			v-if="loader"
			:stages="authLoadStages" 
			:controllable="true"
			:ignite="true" 
			:forcedStage="Number(LoginStatus)" 
			style="position: absolute"
			@active="shutdownLoader"
		/> -->

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
	// import Loader, { LoadStage } from '~/components/common/Loader.vue'

	import AuthLogin 			from '~/components/auth/Login.vue'
	import AuthProfile 		from '~/components/auth/Profile.vue'

	// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'

	// MODULE
	export default Vue.extend({
		components: {
			// Loader,
			AuthLogin,
			AuthProfile,
		},
		data() {
			return {

				// loader: true,

				// authLoadStages: [
				// 	{ LoadPoint: 0, Message: 'Отправка формы' },
				// 	{ LoadPoint: 100, Message: 'Вход' },
				// ] as LoadStage[],

			}
		},
		computed: {

			...mapState({
				LoginStatus: 		state => ( state as VuexModules ).Auth.Auth.LoginStatus,
				// LoginAction:		state => ( state as VuexModules ).Auth.Login.inAction,
			})

		},
		// watch: {
		// 	LoginAction: {
		// 		handler() {
		// 			this.loader = true;
		// 		}
		// 	}
		// },
		// methods: {
		// 	shutdownLoader() {
		// 		this.loader = false;
		// 	}
		// }
	})
	
</script>
