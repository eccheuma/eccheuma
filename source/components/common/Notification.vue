<template>
	<transition name="notification-transition">
		<section v-if="Notification.status" ref="NotificationNode" class="notification-container">
			<div class="notification-icon">
				<i class="fas fa-exclamation" />
				<i class="fas fa-exclamation" />
			</div>
			<div class="notification-text">
				<span>{{ Notification.content.message }}</span>
				<span>{{ Notification.content.description }}</span>
				<template v-if="Notification.content.link">
					<a :href="Notification.content.link">
						Подробнее тут.
					</a>
				</template>
			</div>
			<div class="notification-button">
				<eccheuma-button @click.native="ChangeNotificationState(!Notification.status)">
					Скрыть уведомление
				</eccheuma-button>
			</div>
		</section>
	</transition>
</template>

<script lang="ts">

	import Vue from 'vue'

	import { mapMutations, mapState } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	export default Vue.extend({
		components: {
			EccheumaButton: () => import('~/components/common/EcchuemaButton.vue')
		},
		computed: {
			...mapState({
				Notification: ( state: any ) => ( state as VuexModules ).Notification
			}),
		},
		methods: {
			...mapMutations({
				ChangeNotificationState: 'Notification/Change_Status' 
			})
		}
	})

</script>

<style lang="scss">

.notification {
	&-transition {
		&-enter {

			transform: translateY(-100px);

			&-active {
				transition: transform 500ms ease-in-out
			}

			&-to {
				transform: translateY(0px);
			}

		}
		&-leave {

			transform: translateY(-100px);

			&-active {
				transition: transform 500ms ease-in-out
			}

			&-to {
				transform: translateY(0px);
			}

		}
	}
	&-container {

		@include gradient_border(both);

		position: fixed;
		top: 0px;

		overflow: {
			y: hidden;
		}

		width: 100vw;
		z-index: 1020;

		padding: 2vh 3vw;

		background: {
			color: rgb(var(--color-1));
		}

		display: grid;
		grid-template: {
			columns: 1fr 8fr 3fr;
		}

		color: rgb(var(--color-5));

	}
	&-icon {

		position: relative;
		display: flex;

		i {
			&:nth-child(1) {

				position: relative;
				z-index: 1;

				margin: 0 auto;

				padding: 15px 19px;

				border: 2px solid rgb(var(--color-3));
				border: {
					radius: 2rem;
				}

				color: rgb(var(--color-4));
				font: {
					size: 1rem;
				}

				background: {
					color: rgb(var(--color-2));
				}

				animation: NotificationFlicker 3s infinite alternate;
				@keyframes NotificationFlicker {
					0% {
						border: 2px solid rgb(var(--color-3));
						color: rgb(var(--color-4));
					}
					100% {
						border: 2px solid rgb(var(--color-6));
						color: rgb(var(--color-6));
					}
				}

			}
			&:nth-child(2) {

				$s: 120px;

				position: absolute;

				z-index: 0; 
				
				top: calc(50% - #{$s / 2}); left: 0;

				color: rgb(var(--color-3));

				font: {
					size: $s;
				}				

				transform: rotate(30deg);

			}
		}
	}
	&-text {
		justify-self: center;
		align-self: center;
	}
	&-button {

		justify-self: center;
		align-self: center;

		button {
			@include light-button {
				width: 100%;
			}
		}
	}
}

</style>
