<template>
	<div class="auth_profile-container">

		<section class="auth_profile-header" :style="`background-image: url(${ State.UserImageID })`">
			<i :style="`background-image: url(${ State.UserImageID })`" />
			<div class="auth_profile-header-info">
				<tag theme="light">
					{{ State.UserName }}
				</tag>
				<span>{{ defineStatus(State.UserStatus) }}</span>
			</div>
		</section>

		<section class="auth_profile-body">

			<template v-for="(area, index) in profileAreas">
				<div v-if="area" :key="index" class="auth_profile-body-section">
					<strong>{{ area.title }}</strong>
					<span>{{ area.value }}</span>
					<icon :name="area.icon" />
				</div>
			</template>

		</section>

		<section v-once class="auth_profile-footer ">
			<eccheuma-button @click.native="logout()">
				Выйти
			</eccheuma-button>
		</section>

	</div>
</template>

<style lang="scss">

.auth_profile {
	&-container {

		overflow: {
			y: hidden;
			x: hidden;
		}

		border: {
			radius: var(--border-radius);
		}

		background: {
			color: rgb(var(--color-mono-200));
		}

	}

	&-header {

		display: grid;
		position: relative;
		place-content: center;
		justify-items: center;

		gap: 2vh;
		padding-block: 2vh;

		color: rgb(var(--color-mono-900));
		background: {
			repeat: no-repeat;
			size: calc(100% - 1.4rem) auto;
			position: center;
		}

		&-info {
			span:last-of-type {
				font-size: var(--font-size-14);
				margin: 0.5vh;
			}
		}

		&:before {

			content: '';

			position: absolute;
			width: 100%; height: 100%;

			background: {
				color: rgba(var(--color-mono-1000), 1);
			}

			mix-blend-mode: color;
			z-index: 1;

		}

		&:after {

			content: '';

			position: absolute;
			width: 100%; height: 100%;

			background: radial-gradient(
				closest-side, 
				rgba(var(--color-mono-200), .75) 0%, 
				rgba(var(--color-mono-200), 1) 95%
			);

			z-index: 1;

		}

		i {

			// height: clamp(100px, 15vh, 100%);
			height: 100px;
			aspect-ratio: 1/1;
			z-index: 2;

			background: {
				size: cover;
				repeat: no-repeat;
				position: center;
			}

			border: {
				radius: 100%;
				width: 4px;
				style: solid;
				color: var(--color-accent-edges-100);
			}

		}

		&-info {
			z-index: 2;
			display: grid;
			row-gap: 1vh;
			text-align: center;
		}

	}

	&-body {

		width: 85%;
    margin: 0 auto;

		padding: 3vh 0;

		&-section {

			display: inline-grid;

			width: 100%;

			margin-bottom: 2vh;

			grid-template: {
				columns: 4fr 1fr;
				areas: 	'title title'
								'value info'
			}

			row-gap: .5vh;

			strong {
				grid: {
					column: title;
					row: 		title;
				}

				font: {
					size: var(--font-size-14);
					weight: 700;
				}

				color: rgb(var(--color-mono-500))

			}

			span {

				grid: {
					column: value;
					row: 		value;
				}

				padding: 1vh 1vw;

				color: rgb(var(--color-mono-900));

				border: 1px solid rgb(var(--color-mono-400));
				border: {
					radius: var(--border-radius);
				}

				font: {
					size: var(--font-size-14);
					weight: 600;
				}

			}

			i {

				fill: rgb(var(--color-mono-900));

			}

		}

	}

	&-footer {

		display: inline-grid;

		width: 100%;

		padding: 3vh 0;

		border-top: 1px solid rgb(var(--color-mono-400));

		button {
			width: 75%;
			margin: auto;
		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue';

// VUEX
	import { mapState, mapActions } from 'vuex';

// UTILS
	import { user, work } from '~/utils/status';

// COMPONENTS
	import EccheumaButton from '~/components/buttons/CommonButton.vue';
	import Tag 						from '~/components/common/Tag.vue';
	import Icon						from '~/components/common/Icon.vue';

// TYPES
	import type { VuexMap } from '~/types/VuexMap';

// NAMESPACE
	import { User } from '~/types/User';

	type PROFILE_AREA = {
		title: string
		value: string | number
		icon: string
		info?: string
	}

// MODULE
	export default Vue.extend({
		components: {
			Icon,
			Tag,
			EccheumaButton,
		},
		computed: {
			...mapState({

				State				: state => (state as VuexMap).User.State.State,
				Currency		: state => (state as VuexMap).User.State.Currency,
				NewMessages	: state => (state as VuexMap).User.Messages.NewMessagesCount,
				Messages		: state => (state as VuexMap).User.Messages.Data,
				Lang				: state => (state as VuexMap).App.Lang

			}),

			profileAreas(): { [ K in keyof User.struct ]?: PROFILE_AREA } | { Messages: PROFILE_AREA } {

				// ! Refactor target.
				const LastMessage = this.Messages.length ? [ ...this.Messages ].pop()?.message : '';

				return {
					UserWallet: {
						title: 'Баланс',
						value: `${ this.State.UserWallet[this.Currency] || 0 } ₽`,
						info: 'Ваш текущий баланс.',
						icon: 'Service',
					},
					UserWorkStatus: {
						title: 'Статус последнего заказа',
						value: work.defineStatus(this.State.UserWorkStatus, this.Lang),
						info: 'Текущий статус последнего заказа заказа',
						icon: 'Fire',
					},
					Messages: {
						title: 'Сообщения',
						value: this.NewMessages,
						info: `Последнее сообщение: "${ LastMessage?.slice(0, 65) }"`,
						icon: 'Message',
					}
				};
			}

		},
		methods: {

			...mapActions({
				logout: 'Auth/Logout/Logout'
			}),

			defineStatus(status: User.status) {
				return user.defineStatus(status, this.Lang);
			}

		}
	});

</script>
