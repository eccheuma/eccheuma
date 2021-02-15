<template>
	<section class="user_profile-component">

		<div class="user_profile-component-requests">
			<template v-for="(item, index) in WorkRequests">
				<div class="user_profile-component-request_item" :key="`item-${ index }`"
					:class="[
						{'status-pending'		: item.Status === 1 },
						{'status-progress' 	: item.Status === 2 },
						{'status-complete' 	: item.Status === 3 },
					]">

					<section>
						<span>Тип заказа: <p>{{ item.Service.Name }}</p></span>
						<span>Цена: <p>{{ item.Service.Cost * item.Quantity }} ₽</p></span>
						<span>Состояние: <p>{{ DefineWorkStatus(item.Status) }}</p></span>
						<span>Количество: <p>{{ item.Quantity }}</p></span>
					</section>

					<section>
						<i/>
					</section>

				</div>
			</template>
		</div>

	</section>
</template>

<style lang="scss">

.user_profile-component {
	&-requests {

		padding: 3vh 5vw;

		.status {
			&-pending {
				border: 1px solid $color4;
			}
			&-progress {
				border: 1px solid $colorWarning;
			}
			&-complete {
				border: 1px solid rgba($colorSuccess, .25);
				animation: unread 1s infinite alternate;
				@keyframes unread {
					0% {
						border: 1px solid rgba($colorSuccess, .25)
					}
					100% {
						border: 1px solid rgba($colorSuccess, 1)
					}
				}
			}	
		}

	}	
	&-request_item {

		display: grid;
		grid-template: {
			columns: 8fr 2fr
		}

		background-color: $color1;
		padding: 20px 40px;
		border-radius: .7rem;
		font-size: 12px;
		font-weight: 700;
		p {
			display: inline;
			text-align: right;
			color: $color5;
		}
		span {
			display: block;
			text-align: left;
			color: $color4;
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES 
	import type { REQUEST_STATUS } from '~/types/Services.ts'

	// MIXINS
	import F_WorkStatus 	from '~/assets/mixins/filters/WorkStatus'

	export default Vue.extend({
		mixins: [ F_WorkStatus ],
		computed: {
			...mapState({
				WorkRequests: state => ( state as VuexModules ).User.WorkRequest.Requests
			})
		},
		methods: {
			...mapActions({
				Set_RequestContent: 'User/WorkRequest/Set_RequestContent'
			}),
		},
		mounted() {
			this.Set_RequestContent()
		},
	})

</script>