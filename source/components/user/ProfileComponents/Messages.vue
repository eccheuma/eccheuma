<template>
	<section class="user_profile-component">

		<div class="user_profile-component-body">

			<template v-for="(message, index) in Messages">
				<intesection-component 
					:key="index" 
					:style="`order: ${ Messages.length - index }`" 
					:ready="ReadyToRead"
					:ignite="false"
					@isIntersecting.once="observeIntesection(message)"
					>
					<message :payload="message" />
				</intesection-component>
			</template>

		</div>

		<div class="user_profile-component-textarea">

			<textarea 
				v-model="UserMessage" 
				placeholder="Напишите что нибудь!" 
				@keydown.ctrl.enter="sendMessage"
			/>

			<eccheuma-button @click.native="sendMessage">
				Отправить
			</eccheuma-button>

		</div>

	</section>
</template>

<style lang="scss">

.user_profile-component {

	display: grid;

	grid-template: {
		columns: 1fr;
		rows: 1fr min-content;
	}

	row-gap: 3vh;

	height: auto;
	overflow: hidden;

	&-body {

		display: flex;
		flex-direction: column;
		row-gap: 1vh;

		overflow-y: scroll;
		padding: 0 2vw;

		border-bottom: 1px solid rgb(var(--color-mono-300));

		&::-webkit-scrollbar {
			&-track {
				border-radius: .7rem;
			}
		}

		.message {
			&-owner {
				border: 1px solid rgb(var(--color-mono-500)) !important
			}
			&-support {
				border: 1px solid var(--color-accent-warning) !important
			}
			&-unread {
				border: 1px solid rgba(var(--color-mono-500), .25);
				animation: unread 1s infinite alternate;
				@keyframes unread {
					0% {
						border: 1px solid rgba(var(--color-mono-500), .25)
					}
					100% {
						border: 1px solid rgba(var(--color-mono-500), 1)
					}
				}
			}	
		}

	}

	&-textarea {

		display: flex;
		flex-direction: column;
		row-gap: 2vh;

		align-items: center;
		padding: 0vh 2vw;

		textarea {
			resize: none;
			display: block;
			width: 100%;
			height: 10vh;
			border-radius: .7rem; 
			padding: .7rem;
			font-size: .8rem;
			font-weight: 700;
			background-color: rgb(var(--color-mono-200));
			border: 1px solid rgb(var(--color-mono-400));
			@media screen and ( max-width: $mobile-breakpoint ) {
				height: 20vh;
			}
		}

		button {
			width: 10vw;
		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUELIDATE
	import { required } from 'vuelidate/lib/validators';

	// FIREBASE
	import firebase from 'firebase/app';
	import 'firebase/database';

	// VUEX
	import { mapState, mapActions } from 'vuex';
	import type { VuexModules } from '~/typescript/VuexModules';

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// COMPONENTS
	import EccheumaButton		from '~/components/buttons/CommonButton.vue'
	import Message 					from '~/components/user/ProfileComponents/Message.vue'

	import IntesectionComponent from '~/components/functional/intersectionComponent.vue'

	// TYPES
	import type { Message as MessageType } from '~/store/User/Messages';

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaButton, 
			Message,
			IntesectionComponent
		},
		mixins: [ EmitSound ],
		data() {
			return {

				UserPrevMessage: '',
				UserMessage: '',

				MessageNotification: true,
				ReadyToRead: false,

			}
		},
		validations: {

			UserMessage: { required },

		},
		computed: {

			...mapState({
				UserState: 							state	=> ( state as VuexModules ).User.State.UserState,
				Messages:								state => ( state as VuexModules ).User.Messages.Messages,
				GetRequestsQuantity:		state => ( state as VuexModules ).User.WorkRequest.RequestQuantity
			}),

		},
		watch: {
			Messages: {
				handler() {
					this.sendNotification(this.Messages[this.Messages.length - 1])
				}
			}
		},
		mounted() {

			this.$nextTick(() => { this.ReadyToRead = true });

		},
		methods: {

			...mapActions({
				GetLocalTime: 				'GetLocalTime',
				MarkAsReaded:					'User/Messages/MarkAsReaded',
				FirebaseSendMessage:	'User/Messages/FireBaseSendMessage',
			}),

			observeIntesection(message: MessageType) {

				this.checkMessage(message);

			},

			checkMessage({ ID, Read, UserID }: MessageType) {

				console.log('check message initiate')

				if ( UserID !== this.UserState.UserID && !Read ) { 
					this.MarkAsReaded(ID);
				}

			},

			sendMessage() {
				if ( this.UserPrevMessage !== this.UserMessage ) {

					const M: MessageType = {
						ID: this.Messages.length + 1,
						UserID: this.UserState.UserID,
						Date: Date.now(),
						From: this.UserState.UserName,
						Message: this.UserMessage,
						Read: false
					}
	
					this.FirebaseSendMessage(M)

					this.UserPrevMessage 	= this.UserMessage; 
					this.UserMessage 			= '';

				}
			},

			async sendNotification({ Message, UserID, From, Read }: MessageType ) {
				
				if ( UserID !== this.UserState.UserID && !Read ) {

					const ICON = await firebase.database().ref(`Users/${ UserID }/state/UserImageID`).once('value');

					// eslint-disable-next-line no-undef
					const CONTENT: NotificationOptions = {
						body: `${ From }: ${ Message }`,
						image: require('~/assets/images/NotificationBadge.png'),
						icon: ICON.val(),
						silent: true,
					}

					new Notification('Eccheuma | Новое сообщение', CONTENT)

				}

			}

		}
	})

</script>
