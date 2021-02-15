<template>
	<section class="service_wrapper">

		<div class="service_container">
			<div class="service_container_header">
				<h5>{{ payload.title }}</h5>
				<p>{{ payload.subTitle }}</p>
			</div>
			<div class="service_container_body">
				<div class="col-sm-12 col-lg-12 mb-4">
					<p
						class="service_container_body_desc col-12">
						{{ payload.description }}
					</p>
				</div>
				<div
					class="service_container_body_types"
					:class="'col-sm-6 col-lg-12 mt-3'">
						<h6>Цены</h6>
						<hr>
						<div class="container p-2">
							<div class="row mb-2 p-1" v-for="( item, i ) in Services" :key="`cost-${i}`">
								<span class="col mr-auto">{{ item.Name }}</span>
								<span class="col-4">от {{ item.Cost }} ₽</span>
							</div>
						</div>
				</div>
				<div
					class="service_container_body_price"
					:class="'col-sm-6 col-lg-12 mt-3'">
						<h6>Срок исполнения</h6>
						<hr>
						<div class="container p-2">
							<div class="row mb-2 p-1" v-for="( item, i ) in Services" :key="`time-${i}`" >
								<span class="col mr-auto">{{ item.Name }}</span>
								<span class="col-4">от {{ item.Time }}</span>
							</div>
						</div>
				</div>
			</div>
			<div class="service_container_footer">

				<span @click="ToggleModal(true)" :class="{ disabled: !LoginStatus }">Заказать</span>
				<p v-if="!LoginStatus">
					" Euren die lebt lied vom naht schwebet verschwand euch lebens. Schmerz wie auf dem besitze. Lebens herauf und tränen fühl.. "

					<span
						style="font-size: .65rem"
						@click.prevent="ToggleRegisterModal">
						Зарегистрироваться
					</span>
				</p>

			</div>
		</div>

		<transition name="OpacityTransition">
			<service-modal v-if="Modal" @close-modal="ToggleModal(false)" :service-type="payload.path"/>
		</transition>

	</section>
</template>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapState, mapMutations } from 'vuex'
	import type { VuexModules } from '~/types/VuexModules.ts'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

	// TYPES 
	import type { SERVICE, SERVICES_CARD } from '~/types/Services.ts'

	// COMPONENTS
	import ServiceModal from './ServiceModal.vue'

	// MODULE
	export default Vue.extend({
		props: {
			payload: {
				required: true
			} as PropOptions<SERVICES_CARD>
		},
		components: {
			ServiceModal
		},
		data() {
			return {

				Services: [] as SERVICE[],

				Modal: false,

			}
		},
		computed: {
			...mapState({
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus
			})
		},
		methods: {

			...mapMutations({
				ToggleRegisterModal: 'Auth/Register/ToggleRegisterModal',
			}),

			ToggleModal(value: boolean) {
				this.Modal = value
			}
		},
		created() {

			firebase.database()
				.ref(`Service/${ this.payload.path }`)
				.on('value', data => {

					this.Services = Object.values(data.val()) as SERVICE[]

				})

		}
	})

</script>

<style lang="sass">

.disabled
	pointer-events: none;
	opacity: .25;

.service_wrapper
	width: 100%

.service_container
	display: block
	width: 100%
	padding: 0
	border-radius: .7rem
	margin: 0px 0px 20px
	background-color: $color2
	color: $color5
	&_main
		background-color: $color1   
	&_header
		background-color: $color2
		border-radius: .7rem
		box-shadow: 0px 3px 0px 0px rgba($color1,.25)
		padding: 20px 0px 10px 0px
		text-align: center
		p  
			font-weight: 700
			font-size: 12px
			color: $color4   
	&_body
		padding: 20px 10px
		&_desc
			min-height: 100px
		&_price
			min-height: 250px
		&_types
			min-height: 260px
		span
			color: $color5
			font-size: 12px
			font-weight: 700
		.row
			border-radius: .7rem
			background-color: rgba($color3,.25)
		p
			display: block
			width: 100%
			text-align: left
			font-size: 12px
			font-weight: 400
			opacity: .50    
		h6
			display: block
			text-align: center
			padding-top: 10px
			font-weight: 700
	&_footer
		padding: 40px
		text-align: center
		p
			padding: 3vh 0;
			color: $color4
		span
			cursor: pointer
			padding: 6px 4vw
			border-radius: .8rem
			color: $color1
			background-color: $color5
			border: 1px solid $color3
			box-shadow: 0px 0px 0px 2px $color5
			font-size: 12px
			font-weight: 700
			transition-duration: .25s
			&:hover 
				padding: 6px 5vw
				text-decoration: none
				color: $color5
				background-color: $color2
				border: 1px solid $color3
				box-shadow: 0px 0px 0px 2px $color5
</style>