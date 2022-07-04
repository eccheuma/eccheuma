<template>
	<section class="user_profile-component">
<<<<<<< HEAD

		<div class="user_profile-nameinput">
=======
		<div class="user_profile-component-name_change" :class="{ NonActive: nameValidation }">

>>>>>>> master
			<span>Любое имя длинее одного символа</span>
			<input 
				v-model="NewName" 
				type="text" 
				:placeholder="`Текущее имя: ${ State.UserName }`"
				@keypress.shift.enter="setUsername"
			>
		</div>

		<hr>

		<eccheuma-button>
			Отправить
		</eccheuma-button>

	</section>
</template>

<style lang="scss">

.user_profile {

	&-component {
		text-align: center;
		height: 100%;
	
		display: grid;
		grid-template: {
			columns: 1fr;
			rows: 1fr min-content auto
		}
	
		place-content: center;
		row-gap: 2vh;		
	
		button {
			width: min-content;
			height: min-content;
			justify-self: center;
			align-self: end;
		}
	}

	&-nameinput {

		margin: auto;

		span {
			line-height: 4vh;
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
	import { mapState } from 'vuex';

	// API
	import { database } from '~/api/database';

	// VUEX MODULE TYPE MAP
<<<<<<< HEAD
	import type { VuexMap } from '~/types/VuexMap';

	// COMPONENTS
	import EccheumaButton from '~/components/buttons/CommonButton.vue';
=======
	import type { VuexMap } 				from '~/types/VuexMap'
>>>>>>> master

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaButton
		},
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
