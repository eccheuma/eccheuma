<template>
	<section class="auth_wrapper" :class="`interface-${ UI }`">

		<loader />

		<component :is="!LoginStatus ? 'AuthLogin' : 'AuthProfile'" />

	</section>
</template>

<style lang="scss">

.auth_wrapper {
	position: relative;
	color: rgb(var(--color-1));
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
	import type { VuexModules } from '~/types/VuexModules.ts'

// MODULE
	export default Vue.extend({
		components: {
			Loader,
			AuthLogin,
			AuthProfile,
		},
		computed: {
			...mapState({

				// UserInterface
				UI:							state => (state as VuexModules).App.UI,

				// LOADER
				LoaderMessage: 	state => ( state as VuexModules ).Loader.Message,
				LoaderStatus:		state => ( state as VuexModules ).Loader.Status,

				// USER
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus
			})
		}
	})
	
</script>
