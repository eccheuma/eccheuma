<template>
	<section class="auth_wrapper">

		<loader />

		<component :is="!LoginStatus ? 'AuthLogin' : 'AuthProfile'" />

	</section>
</template>

<style lang="scss">

.auth_wrapper {

	@include component-shadow;

	position: relative;
	color: rgb(var(--color-mono-200));
	border-radius: .7rem;
	overflow: hidden;
	width: 100%;
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'

	// COMPONENTS
	import Loader from '~/components/common/Loader.vue'

	import AuthLogin 			from '~/components/auth/Login.vue'
	import AuthProfile 		from '~/components/auth/Profile.vue'

	// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'

	// MODULE
	export default Vue.extend({
		components: {
			Loader,
			AuthLogin,
			AuthProfile,
		},
		computed: {

			...mapState({

				UI:							state => ( state as VuexModules ).App.UI,

				LoaderMessage: 	state => ( state as VuexModules ).Loader.Message,
				LoaderStatus:		state => ( state as VuexModules ).Loader.Status,
				LoginStatus: 		state => ( state as VuexModules ).Auth.Auth.LoginStatus,

			})

		}
	})
	
</script>
