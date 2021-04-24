<template>
	<div class="user-container">
		<user-profile :status="true"></user-profile>
	</div>
</template>

<style lang="sass" scoped>

.user
	&-container
		position: relative
		width: 100%
		height: 100vh
		background-color: rgb(var(--color-2))
		overflow-y: scroll

</style>

<script lang="ts">

	import Vue from 'vue'

	import { mapMutations } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	import UserProfile from '~/components/user/UserProfile.vue'
	
	export default Vue.extend({
		components: {
			UserProfile
		},
		validate({ store, query }) {
			
			return ( store.state as VuexModules ).User.State.UserState.UserID === query.uid

		},
		mounted() {
			this.ToggleProfileArea()
		},
		methods: {
			...mapMutations({
				ToggleProfileArea: 'User/State/Toggle_UserProfileArea'
			}),
		}
	})

</script>
