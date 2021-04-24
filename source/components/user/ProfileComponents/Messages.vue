<template>
	<section class="user_profile-component">

		<div class="user_profile-component-messages">

			<div v-for="item in Messages" :key="item.ID"
				:style="`order: ${ Messages.length - item.ID}`"
				@mouseenter="CheckMessage(item.ID, item.Read)"
				:class="[
					{ 'message-support': 		 item.UserID == 'SUPPORT' },
					{ 'message-owner': 	 item.UserID == 'Admin' },
					{ 'message-unread': !item.Read && UserState.UserName != item.From }
				]"
				class="user_profile-component-messages_item">

				<message :payload="{ From: item.From, Date: item.Date, Message: item.Message }" />

			</div>

		</div>

		<div class="user_profile-component-textarea">

			<textarea v-model="Message" @input="EmitSound(`Off`)" 
				@keydown.ctrl.enter="SendMessage"
				placeholder="Напишите что нибудь!">
			</textarea>

			<button @click="SendMessage"> Отправить </button>

		</div>

	</section>
</template>

<style lang="scss">

.user_profile-component {

	display: grid;
	grid-template: {
		columns: 1fr;
		rows: 7fr 3fr;
	}

	row-gap: 3vh;

	height: 60vh;

	&-messages {

		overflow-y: scroll;
		padding: 0 2vw;

		&::-webkit-scrollbar {
			&-track {
				border-radius: .7rem;
			}
		}

		&_item {
			border-radius: .7rem;
			border: 1px solid rgb(var(--color-3));
			padding: 2vh 1vw;
			margin: 3vh 0;
			color: rgb(var(--color-6));
		}

		.message {
			&-owner {
				border: 1px solid rgb(var(--color-4)) !important
			}
			&-support {
				border: 1px solid var(--color-Warning) !important
			}
			&-unread {
				border: 1px solid rgba(var(--color-4), .25);
				animation: unread 1s infinite alternate;
				@keyframes unread {
					0% {
						border: 1px solid rgba(var(--color-4), .25)
					}
					100% {
						border: 1px solid rgba(var(--color-4), 1)
					}
				}
			}	
		}

	}

	&-textarea {
		button {
			
			@include light-button { 
				display: block;
				width: 50%;
				font-size: 12px;
				padding: 6px 20px;
				margin: 2vh auto 0;
			}
		}
		textarea {
			resize: none;
			display: block;
			width: 100%;
			height: 10vh;
			border-radius: .7rem; 
			padding: 15px 15px;
			font-size: .8rem;
			font-weight: 700;
			background-color: rgb(var(--color-5));
			@media screen and ( max-width: $mobile-breakpoint ) {
				height: 20vh;
			}
		}
	}

}



</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapState, mapActions } from 'vuex'
		import type { VuexModules } from '~/types/VuexModules'

	// TYPES
		import type { Message as MessageTYPE } from '~/store/User/Messages'

	// VUELIDATE
		import { required } from 'vuelidate/lib/validators'
	
	// MIXINS
		import EmitSound from '~/assets/mixins/EmitSound'

	// COMPONENTS
		import Message from '~/components/user/ProfileComponents/_message.vue'

	// MODULE
	export default Vue.extend({
		mixins: [ EmitSound ],
		components: {
			Message
		},
		data() {
			return {
				PrevMessage: '',
				Message: '',
			}
		},
		validations: {

			Message: { required },

		},
		watch: {
			StoreMessages: {
				handler() {
					this.$store.dispatch('User/Messages/CheckNewMessage')
				}
			}
		},
		computed: {
			...mapState({
				// MODULES
				UserState: 							state	=> ( state as VuexModules ).User.State.UserState,
				Messages:								state => ( state as VuexModules ).User.Messages.Messages,
				GetRequestsQuantity:		state => ( state as VuexModules ).User.WorkRequest.RequestQuantity
			}),
		},
		methods: {
			...mapActions({
				MarkAsReaded:					'User/Messages/MarkAsReaded',
				FirebaseSendMessage:	'User/Messages/FireBaseSendMessage',
			}),
			CheckMessage(ID: MessageTYPE['ID'], readed: boolean) {
				if ( !readed ) { 
					this.MarkAsReaded(ID);
				}
			},
			SendMessage() {
				if ( this.PrevMessage !== this.Message ) {

					const M: MessageTYPE = {
						ID: this.Messages.length + 1,
						UserID: this.UserState.UserID,
						Date: Date.now(),
						From: this.UserState.UserName,
						Message: this.Message,
						Read: false
					}
	
					this.FirebaseSendMessage(M)

					this.PrevMessage = this.Message; this.Message = '';

					this.EmitSound(`Translate`, { rate: 1.25, volume: .5 })   

				}
			},
		}
	})

</script>