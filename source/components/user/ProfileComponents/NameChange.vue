<template>
	<section class="user_profile-component">
		<div class="user_profile-component-name_change">

			<!-- :class="{ NonActive: $v.NewName.$invalid }" -->
			<!-- <span>Любое имя длинее одного символа</span> -->
			<input v-model="NewName" type="text" 
				@keypress.shift.enter="SetNewUserName"
				:placeholder="`Текущее имя: ${ UserState.UserName }`">

		</div>
	</section>
</template>

<style lang="scss">

.user_profile-component {
	&-name_change {

		display: grid;
		grid-template: {
			columns: 1fr;
			rows: 1fr
		}

		height: 60vh;

		span {
			height: 3vh;
		}

		input {
			margin: auto;
			text-align: center;
			font-weight: 700;
			font-size: 12px;
			padding: 5px 10%;
			color: rgb(var(--color-mono-900));
			background-color: rgb(var(--color-mono-300));
			border: 1px solid rgb(var(--color-mono-400));
			border-radius: .7rem;
			width: 75%;
		}
	}	
}


</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapState, mapActions } from 'vuex'

	// VUEX MODULE TYPE MAP
		import type { VuexModules } from '~/typescript/VuexModules'

	// TYPES
		import { USER_STATE } from '~/typescript/User'

	// VUELIDATE
		import type { validationMixin } 						from "vuelidate"
		import 			{ email, required, minLength } 	from 'vuelidate/lib/validators'

	// MODULE
	export default Vue.extend({
		data() {
			return {
				NewName: '',
			}
		},
		computed: {
			...mapState({
				UserState: state => (state as VuexModules).User.State.UserState,
			}),
		},
		validations: {
			NewName: { minLength: minLength(1), required },
		},
		methods: {
			...mapActions({
				FirebaseChange: 'User/State/FireBaseChange'
			}),
			SetNewUserName() {

				const Property: {prop: string, entity: keyof USER_STATE} = {
					prop: this.NewName,
					entity: 'UserName' 
				}

				if( !this.$v.NewName.$invalid ) {
					this.FirebaseChange(Property)
				}

			},
		}
	})

</script>