<template>
	<div class="auth_profile-container">
		<section class="auth_profile-header" :style="`background-image: url(${ UserState.UserImageID })`">
			<i :style="`background-image: url(${ UserState.UserImageID })`" />
			<strong>{{ UserState.UserName }}</strong>
			<span>{{ DefineUserStatus(UserState.UserStatus) }}</span>
		</section>
		<section class="auth_profile-body">

			<template v-for="(area, index) in profileAreas">
				<div v-if="area" :key="index" class="auth_profile-body-section">
					<strong>{{ area.title }}</strong>
					<span>{{ area.value }}</span>
					<i class="fas fa-info-circle">
						<!-- <popover>
							{{ area.info }}
						</popover> -->
					</i>
				</div>
			</template>

		</section>
		<section class="auth_profile-footer">

			<template v-if="$isMobile">
				<nuxt-link tag="button" :to="`/user-panel?uid=${ UserState.UserID }`">
					Личный Кабинет
				</nuxt-link>
			</template>

			<nuxt-link v-if="UserState.UserID === __SELF_KEY__" tag="button" to="/admin">
				Админ Панель
			</nuxt-link>
			<button @click="logout()">
				Выйти
			</button>
		</section>
	</div>
</template>

<style lang="scss">

.auth_profile {
	&-container {

		color: rgb(var(--color-mono-300));

		overflow: {
			y: hidden;
			x: hidden;
		}

		border: {
			radius: .7rem;
		}

		background: {
			color: rgb(var(--color-mono-200));
		}

	}

	&-header {

		position: relative;

		min-height: 20vh;
		min-width: 100%;

		padding: 2vh 0;

		display: inline-grid;

		justify-content: center;
		align-content: center;

		color: rgb(var(--color-mono-800));

		overflow: hidden;

		background: {
			repeat: no-repeat;
			size: cover;
			position: center;
		}

		&:before {

			content: '';

			position: absolute;
			width: 100%; height: 100%;

			background: {
				color: rgba(var(--color-mono-900), 1);
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
				rgba(var(--color-mono-200), 1) 100%
			);

			z-index: 1;
		}

		i {

			$s: 80px;

			z-index: 2;

			width: $s; height: $s;

			justify: {
				self: center;
			}

			margin: {
				bottom: 1vh;
			}

			background: {
				repeat: no-repeat;
				size: cover;
				position: center;
			}

			border: 3px solid rgb(var(--color-mono-800));
			border: {
				radius: 100%;
			}

		}

		span {

			z-index: 2;

			text-align: center;
			display: block;

			font: {
				weight: 600;
				size: .65rem;
			}
		}

		strong {

			z-index: 2;

			text-align: center;
			display: block;

			font: {
				size: var(--font-size-3);
			}
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
					size: var(--font-size-6);
					weight: 700;
				}

				color: rgb(var(--color-mono-500))

			}

			span {

				grid: {
					column: value;
					row: 		value;
				}

				padding: .5vh 1vw;

				color: rgb(var(--color-mono-800));

				border: 1px solid rgb(var(--color-mono-400));
				border: {
					radius: .7rem;
				}

				font: {
					size: var(--font-size-5);
					weight: 600;
				}

			}

			i {

				cursor: pointer;

				grid: {
					column: info;
					row: 		info;
				}

				justify-self: center;
				align-self: center;

				color: rgb(var(--color-mono-500));

				font: {
					size: 1rem;
				}

				transition: color, transform 250ms ease-in-out;
				&:hover {
					color: rgb(var(--color-mono-300));
					transform: scale(1.25);
				}
			}

		}

	}

	&-footer {

		display: inline-grid;

		width: 100%;

		padding: 3vh 0;

		border-top: 1px solid rgb(var(--color-mono-400));

		button {
			@include push-button {

				margin: .5vh auto;

				width: 75%;
				background: {
					color: transparent;
				}

			}
		}
	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapActions } from 'vuex'

// COMPONENTS
	import Popover from '~/components/common/Popover.vue'

// MIXINS 
	import F_UserStatus from '~/assets/mixins/filters/UserStatus.ts'
	import F_WorkStatus from '~/assets/mixins/filters/WorkStatus'

// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'
	import type { USER_STATE 	} from '~/typescript/User.ts' 

	type PROFILE_AREA = {
		title: string
		value: string | number
		info?: string
	}

// MODULE
	export default Vue.extend({
		components: {
			Popover,
		},
		mixins: [ F_UserStatus, F_WorkStatus ],
		computed: {
			...mapState({

				UserState: 			state => ( state as VuexModules ).User.State.UserState,
				NewMessages:		state => ( state as VuexModules ).User.Messages.NewMessagesCount,
				Messages: 			state => ( state as VuexModules ).User.Messages.Messages

			}),

			profileAreas(): { [K in keyof USER_STATE]?: PROFILE_AREA } | { Messages: PROFILE_AREA } {

				const LastMessage = this.Messages.length ? [ ...this.Messages ].pop()?.Message : ''

				return {
					UserBalance: {
						title: 'Баланс',
						value: `${ this.UserState.UserBalance } ₽`,
						info: 'Ваш текущий баланс.'
					},
					UserWorkStatus: {
						title: 'Статус заказа',
						value: this.DefineWorkStatus(this.UserState.UserWorkStatus),
						info: 'Текущий статус последнего заказа заказа'
					},
					Messages: {
						title: 'Сообщения',
						value: this.NewMessages,
						info: `Последнее сообщенее: "${ LastMessage?.slice(0, 65) }"`
					}
				}
			}

		},
		methods: {

			...mapActions({
				logout: 'Auth/Logout/Logout'
			}),

		}
	})

</script>