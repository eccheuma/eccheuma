<template>
	<section class="user_profile-component">
		<section class="user_profile-component-notification">
			<input id="messageNotificationChecker" v-model="MessageNotification" type="checkbox" name="Оповещать о сообщениях" />
			<label for="messageNotificationChecker">Оповещать о сообщениях</label>
		</section>

		<transition-group name="opacity-transition" class="user_profile-component-body">
			<template v-for="(message, index) in Messages">
				<intesection-component
					:key="message.date"
					:style="`order: ${Messages.length - index}`"
					:ready="ReadyToRead"
					:ignite="false"
					@isIntersecting.once="observeIntesection(message)">
					<message-component :payload="message" />
				</intesection-component>
			</template>
		</transition-group>

		<div class="user_profile-component-textarea">
			<textarea v-model="UserMessage" placeholder="Напишите что нибудь!" @keydown.ctrl.enter="sendMessage" />

			<eccheuma-button @click.native="sendMessage"> Отправить </eccheuma-button>
		</div>
	</section>
</template>

<style lang="scss" scoped>
	.user_profile-component {
		display: grid;

		grid-template: {
			columns: 1fr;
			rows: auto 1fr min-content;
		}

		row-gap: 1vh;

		height: auto;
		overflow: hidden;

		&-body {
			display: flex;
			flex-direction: column;
			row-gap: 1vh;

			overflow-y: scroll;
			padding: 1px $GLOBAL-ScrollWidth 1px $GLOBAL-ScrollWidth * 2;

			&::-webkit-scrollbar {
				&-track {
					border-radius: var(--border-radius);
				}
			}

			.message {

				$BORDER_SIZE: 3px;

				&-owner {
					border: $BORDER_SIZE solid rgb(var(--color-mono-500)) !important;
				}
				&-support {
					border: $BORDER_SIZE solid var(--color-accent-warning) !important;
				}
				&-unread {
					border: $BORDER_SIZE solid rgba(var(--color-mono-500), 0.25);
					animation: unread 1s infinite alternate;
					@keyframes unread {
						0% {
							border: $BORDER_SIZE solid rgba(var(--color-mono-500), 0.25);
						}
						100% {
							border: $BORDER_SIZE solid rgba(var(--color-mono-500), 1);
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
				padding: 0.7rem;
				font-size: 0.8rem;
				font-weight: 600;
				background-color: rgb(var(--color-mono-200));
				color: rgb(var(--color-mono-900));
				border: 2px solid var(--color-accent-edges-100);
				@media screen and (max-width: $mobile-breakpoint) {
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

		&-notification {
			@include gradient-border;

			padding: 0.5vh 1vw;
			background-color: rgb(var(--color-mono-200));
			display: flex;
			place-content: center;

			gap: calc(min(0.5vw, 4px));

			@extend %pattern-lines;

			label {
				margin: 2px 0px 0px;
				font-size: var(--font-size-16);
				font-weight: 700;
				color: rgb(var(--color-mono-500));
			}
		}
	}
</style>

<script lang="ts">
	import Vue from "vue";

	// VUEX
	import { mapState, mapActions } from "vuex";
	import type { VuexMap } from "~/contracts/VuexMap";

	// API
	import { database } from "~/api/database";

	// UTILS
	import { Result, utils } from "~/utils";

	// MIXINS
	import EmitSound from "~/assets/mixins/EmitSound";

	// COMPONENTS
	import EccheumaButton from "~/components/buttons/CommonButton.vue";
	import MessageComponent from "./submodules/Message.vue";

	import IntesectionComponent from "~/components/functional/intersectionComponent.vue";

	// TYPES
	import type { Message as MessageContract } from "~/contracts/Message";
	import type { User } from "~/contracts/User";

	// ERROR
	const enum ComponentErrors {
		REPEATED_MESSAGE = "RM",
	}

	// MODULE
	export default Vue.extend({
		mixins: [ EmitSound ],
		components: {
			EccheumaButton,
			MessageComponent,
			IntesectionComponent,
		},
		data() {

			return {
				message: {
					current: String(),
					prev: String(),
				},

				MessageNotification: Notification.permission === "granted",
				ReadyToRead: false,
			};
		
		},
		computed: {
			...mapState({
				UserState		: state => (state as VuexMap).User.State.State,
				Messages		: state => (state as VuexMap).User.Messages.Data,
			}),
		},
		watch: {
			Messages: {
				handler() {

					if (this.MessageNotification) this.sendNotification(this.Messages[this.Messages.length - 1]);
				
				},
			},
			UserMessage: {
				handler(n, o) {

					this.playSound(this.Sounds.get(n.length > o.length ? "Input::Increment" : "Input::Decrement"));
				
				},
			},
			MessageNotification: {
				handler(value) {

					if (value) this.requestNotificationPermission();
				
				},
			},
		},
		created() {

			this.setSounds([
				{ file: "Off", name: "Input::Increment", settings: { rate: 0.65, volume: 0.25 } },
				{ file: "Off", name: "Input::Decrement", settings: { rate: 0.5, volume: 0.25 } },
			]);

		},
		mounted() {

			requestIdleCallback(() => {

				this.ReadyToRead = true;

			});

		},
		methods: {
			...mapActions({
				vuex_markAsReaded: "User/Messages/markAsReaded",
				vuex_sendMessage: "User/Messages/sendMessage",
			}),

			observeIntesection(message: MessageContract.struct) {

				this.checkMessage(message);

			},

			checkMessage({ userID, readed, uid }: MessageContract.struct) {

				if (uid !== this.UserState.uid && readed === false) this.vuex_markAsReaded(userID);

			},

			sendMessage(): Result<void> {

				if (this.UserPrevMessage === this.UserMessage) return Error(ComponentErrors.REPEATED_MESSAGE);

				this.vuex_sendMessage({
					ID: utils.randHashGenerator(),
					uid: this.UserState.uid,
					date: Date.now(),
					from: this.UserState.name,
					message: this.UserMessage,
					readed: false,
				});

				this.message.prev = this.message.current;
				this.message.current = "";

			},

			requestNotificationPermission() {

				Notification.requestPermission().then((perm) => {

					this.MessageNotification = perm === "granted";

				});

			},

			async sendNotification({ message, uid, from }: MessageContract.struct) {

				if (uid === this.UserState.uid) return;

				new Notification("Eccheuma | Новое сообщение", {
					body: `${from}: ${message}`,
					image: require("~/assets/images/NotificationBadge.png"),
					icon: await database.get<User.struct["image"]>(`users/${uid}/state/image`),
					silent: true,
				});
				
			},
		},
	});

</script>
