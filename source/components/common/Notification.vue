<template>
	<transition name="notification-transition">
		<section v-if="Notification.status" ref="NotificationNode" class="notification-container">
			<div class="notification-icon">
				<icon name="Info" />
				<span>
					<icon name="Info" />
				</span>
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
				<common-button @click.native="changeStatus(!Notification.status)">
					Скрыть уведомление
				</common-button>
			</div>
		</section>
	</transition>
</template>

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

			transform: translateY(0px);

			&-active {
				transition: transform 500ms ease-in-out
			}

			&-to {
				transform: translateY(-100px);
			}

		}
	}

	&-container {

		@include gradient_border(block);

		position: fixed;
		top: 0px;

		overflow: {
			y: hidden;
		}

		width: $GLOBAL-BodySize;
		min-height: 15vh;
		z-index: 1020;

		padding: 2vh 3vw;

		background: {
			color: rgb(var(--color-mono-200));
		}

		display: grid;
		grid-template: {
			columns: 1fr 8fr 3fr;
		}

		color: rgb(var(--color-mono-900));

	}

	&-icon {

		position: relative;
		display: flex;

		align-self: center;

		>i {

			position: absolute;

			z-index: 0; 
			
			top: 0; left: 0;
			transform: rotate(30deg) scale(8);

			fill: rgb(var(--color-mono-300));

		}

		span {

			display: block;
			margin: auto;
			padding: 1vh;
			background: rgb(var(--color-mono-200));
			border: 3px solid rgb(var(--color-mono-400));
			border-radius: 100%;
			z-index: 1000;

			i {
				@include icon-size(5vh);
				fill: rgb(var(--color-mono-400));
				transform: translateY(-2px);
			}
		}

	}

	&-text {

		justify-self: left;
		align-self: center;

		span {
			display: block;
			margin-bottom: .25vh;
			&:nth-child(1) {
				font: {
					size: var(--font-size-24);
					weight: 700;
				}
			};
			&:nth-child(2) {
				font: {
					size: var(--font-size-16);
					weight: 500;
					width: 65ch;
				}
			};
		}

	}

	&-button {

		justify-self: center;
		align-self: center;

	}

}

</style>

<script lang="ts">

	import Vue from 'vue';

	import { mapMutations, mapState } from 'vuex';

	import type { VuexMap } from '~/types/VuexMap';

	// COMPONENTS 
	import Icon 									from '~/components/common/Icon.vue';

	export default Vue.extend({
		components: {
			Icon,
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		computed: {
			...mapState({
				Notification: state => ( state as VuexMap ).Notification
			}),
		},
		methods: {
			...mapMutations({
				changeStatus: 'Notification/changeStatus' 
			})
		}
	});

</script>
