<template>
	<div class="user-container">
		<user-profile :status="true" />
	</div>
</template>

<style lang="scss" scoped>

.user-container {
	position: relative;
	width: 100%;
	height: 100vh;
	background-color: rgb(var(--color-mono-300));
	overflow-y: scroll;
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import { mapMutations } from 'vuex'

	import type { VuexMap } from '~/typescript/VuexMap'

	import UserProfile from '~/components/profile/Profile.vue'
	
	export default Vue.extend({
		components: {
			UserProfile
		},
		validate({ store, query }) {
			
			return ( store.state as VuexMap ).User.State.UserState.UserID === query.uid

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
