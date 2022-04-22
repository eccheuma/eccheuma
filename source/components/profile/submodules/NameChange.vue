<template>
	<section class="user_profile-component">
		<div class="user_profile-component-name_change" :class="{ NonActive: nameValidation }">

			<span>Любое имя длинее одного символа</span>
			<input 
				v-model="NewName" 
				type="text" 
				:placeholder="`Текущее имя: ${ State.UserName }`"
				@keypress.shift.enter="setUsername"
			>

		</div>
	</section>
</template>

<style lang="scss">

.user_profile-component {

	height: 100%;

	&-name_change {

		text-align: center;

		display: grid;
		grid-template: {
			columns: 1fr;
			rows: min-content min-content
		}

		place-content: center;

		span {
			height: 3vh;
		}

		input {
			margin: auto;
			text-align: center;
			font-weight: 700;
			font-size: 12px;
			padding: 5px 10%;
			color: rgb(var(--color-mono-1000));
			background-color: rgb(var(--color-mono-300));
			border: 1px solid rgb(var(--color-mono-400));
			border-radius: var(--border-radius);
			width: 75%;
		}
	}	
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// VUEX
	import { mapState } from 'vuex'

	// API
	import { database } from '~/api/database';

	// VUEX MODULE TYPE MAP
	import type { VuexMap } 				from '~/types/VuexMap'

	// MODULE
	export default Vue.extend({
		data() {
			return {
				NewName: '',
			}
		},
		computed: {
			...mapState({
				State: state => (state as VuexMap).User.State.State,
			}),

			nameValidation(): boolean {
				return this.NewName.length > 1;
			}

		},
		methods: {
			setUsername() {
				
				database.update(`Users/${ this.State.UserID }/state`, { UserName: this.NewName })

			},
		}
	})

</script>
