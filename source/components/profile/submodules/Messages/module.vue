<template>
	<section class="user_profile-component">

		<transition-group name="opacity-transition" class="user_profile-component-body">
			<template v-for="(message, index) in Messages">
				<intesection-component 
					:key="message.date" 
					:style="`order: ${ Messages.length - index }`" 
					:ready="ReadyToRead"
					:ignite="false"
					@isIntersecting.once="observeIntesection(message)"
					>
					<message-component :payload="message" />
				</intesection-component>
			</template>
		</transition-group>

		<div class="user_profile-component-textarea">

			<textarea 
				v-model="UserMessage" 
				placeholder="Напишите что нибудь!" 
				@keydown.ctrl.enter="sendMessage"
			/>

			<section>
				<input id="messageNotificationChecker" v-model="MessageNotification" type="checkbox" name="Оповещать о сообщениях">
				<label for="messageNotificationChecker">Оповещать о сообщениях</label>
			</section>

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
		padding-right: $GLOBAL-ScrollWidth;

		&::-webkit-scrollbar {
			&-track {
				border-radius: var(--border-radius);
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
			border-radius: var(--border-radius); 
			padding: .7rem;
			font-size: .8rem;
			font-weight: 600;
			background-color: rgb(var(--color-mono-200));
			color: rgb(var(--color-mono-900));
			border: 2px solid var(--color-accent-edges-100);
			@media screen and ( max-width: $mobile-breakpoint ) {
				height: 20vh;
			}

			transition-duration: 250ms;
			&:focus {
				border: 2px solid var(--color-accent-edges-300);
				outline: none;
			}

		}

		button {
			width: 10vw;
		}

		section {
			display: inline-flex;
			place-items: center;
			gap: 1vw;

			label {
				line-height: normal;
				margin: 0;
				padding-top: 1px;
			}

		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUELIDATE
	import { required } from 'vuelidate/lib/validators';

	// VUEX
	import { mapState, mapActions } from 'vuex';
	import type { VuexMap } from '~/typescript/VuexMap';

	// API
	import { database } from '~/api/database'

	// UTILS
	import { utils } from '~/utils'

	// MIXINS
	import HashGenerator 	from '~/assets/mixins/HashGenerator';
	import EmitSound 			from '~/assets/mixins/EmitSound';

	// COMPONENTS
	import EccheumaButton		from '~/components/buttons/CommonButton.vue'
	// eslint-disable-next-line import/order
	import MessageComponent from './submodules/Message.vue'

	import IntesectionComponent from '~/components/functional/intersectionComponent.vue'

	// TYPES
	import type { Message as MessageNamespace } from '~/typescript/Message';

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaButton, 
			MessageComponent,
			IntesectionComponent
		},
		mixins: [ EmitSound, HashGenerator ],
		data() {
			return {

				UserPrevMessage: '',
				UserMessage: '',

				MessageNotification: false,
				ReadyToRead: false,

			}
		},
		validations: {

			UserMessage: { required },

		},
		computed: {

			...mapState({
				State: 							state	=> ( state as VuexMap ).User.State.State,
				Messages:								state => ( state as VuexMap ).User.Messages.Data,
				GetRequestsQuantity:		state => ( state as VuexMap ).User.WorkRequest.RequestQuantity
			}),

		},
		watch: {
			Messages: {
				handler() {
					if ( this.MessageNotification ) {
						this.sendNotification(this.Messages[this.Messages.length - 1])
					}
				}
			},
			UserMessage: {
				handler(n, o) {
					this.playSound(this.Sounds.get(n.length > o.length ? 'Input::Increment' : 'Input::Decrement'));
				}
			},
			MessageNotification: {
				handler(value) {
					if ( value ) {
						this.requestNotificationPermission();
					}
				}
			}
		},
		created() {

			this.setSounds([
				{ file: 'Off', name: 'Input::Increment', settings: { rate: 0.65, volume: .25 } },
				{ file: 'Off', name: 'Input::Decrement', settings: { rate: 0.50, volume: .25 } },
			])

		},
		mounted() {
			this.$nextTick(() => { this.ReadyToRead = true });
		},
		methods: {

			...mapActions({
				vuex_markAsReaded:	'User/Messages/markAsReaded',
				vuex_sendMessage:	'User/Messages/sendMessage',
			}),

			observeIntesection(message: MessageNamespace.struct) {

				this.checkMessage(message);

			},

			checkMessage({ ID, readed, userID }: MessageNamespace.struct) {

				console.log('vuex_markAsReaded')

				if ( userID !== this.State.UserID && readed === false ) { 
					this.vuex_markAsReaded(ID); console.log('vuex_markAsReaded VALID')
				}

			},

			sendMessage() {
				if ( this.UserPrevMessage !== this.UserMessage ) {

					const M: MessageNamespace.struct = {
						ID				: utils.hashGenerator(),
						userID		: this.State.UserID,
						date			: Date.now(),
						from			: this.State.UserName,
						message		: this.UserMessage,
						readed		: false
					}
	
					this.vuex_sendMessage(M)

					this.UserPrevMessage 	= this.UserMessage; 
					this.UserMessage 			= '';

				}
			},

			requestNotificationPermission() {
				Notification.requestPermission().then((perm) => {
					this.MessageNotification = perm === 'granted'
				})
			},

			async sendNotification({ message, userID, from, readed }: MessageNamespace.struct ) {
				
				if ( userID !== this.State.UserID && readed === false ) {

					// eslint-disable-next-line no-undef
					const CONTENT: NotificationOptions = {
						body: `${ from }: ${ message }`,
						image: require('~/assets/images/NotificationBadge.png'),
						icon: await database.get<string>(`Users/${ userID }/state/UserImageID`),
						silent: true,
					}

					new Notification('Eccheuma | Новое сообщение', CONTENT)

				}

			}

		}
	})

</script>
