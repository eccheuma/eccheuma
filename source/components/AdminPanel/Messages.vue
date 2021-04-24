<template>
	<div class="CMS">
		<div class="CMS_Messages">
			<div class="row">
				<h1>Hello mate's!</h1>
			</div>
			<div class="row">
				<input 
					type="text" 
					v-model="SeachUser">
			</div>
			<div class="row justify-content-center p-4 CMS_Messages-UserList">
				<div
					v-for="prop in Store_CMS_GetUsersState"
					:key=prop.state.UserID 
					:class="[
						{ 'd-none': prop.state.UserName.toLowerCase() != SeachUser.toLowerCase() && SeachUser != '' }
					]"
					@click="GetMessagesOfUser(prop.state.UserID)" 
					class="col-auto">
					<i :style="`background-image: url(${prop.state.UserImageID})`"></i>
					<span class="my-3">{{ prop.state.UserName }}</span>
				</div>
			</div>
			<template v-if="UserPicked">
				<div
					class="row justify-content-center CMS_Messages-Wrapper">
					<div
						v-for="prop in Store_CMS_GetUsersState[CurentUser].messages"
						:key="prop.ID"
						class="col-10 mb-2 CMS_Messages-Item">
							<span>{{ prop.from }}<p>{{ prop.time }}</p></span>
							<p class="mt-1">{{ prop.message }}</p>
					</div>
				</div>
				<div
					class="row justify-content-center mt-3 py-3 px-4 CMS_Messages-Textarea">
					<div class="col-8">
						<textarea
							@keydown.ctrl.enter="SendMessage" 
							v-model="Message"></textarea>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>

	import firebase from 'firebase/app'
	import 'firebase/database'

	export default {
		data() {
			return {

				SeachUser: '',

				UserPicked: false,
				CurentUser: null,

				PrevMessage: null,
				Message: null,

				ImagesURL: {
					bob: `sisodfeffiosdfiosd`
				}

			}
		},
		computed: {
			Store_CMS_GetUsersState() {
				return this.$store.state.AdminPanel.GetUsers.UsersState
			},
			CurentDate() {

				const options = {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				};

				return Intl.DateTimeFormat('ru-RU', options).format()
				
			},
			CurentTime() {

				const options = {
					hour: '2-digit',
					minute: '2-digit',
				}

				return Intl.DateTimeFormat('ru-RU', options).format()
				
			},
		},
		methods: {
			GetMessagesOfUser(ID) {

				this.CurentUser = ID
				this.UserPicked = true

			},
			async SendMessage() {

				let MC = null

				await firebase.database()
					.ref(`Users/${this.CurentUser}/messages`)
					.on('value', data => {
						MC = data.numChildren()
					})
				
				if ( this.PrevMessage != this.Message ) {

					const prop = {
						ID: MC,
						UserID: 'Admin',
						time: `${this.CurentDate} в ${this.CurentTime}`,
						from: 'Escape from Mordorland',
						message: this.Message,
						read: false
					}

					firebase.database()
						.ref(`Users/${this.CurentUser}/messages/Hash_${MC}`)
						.set(prop)

					this.PrevMessage = this.Message
				

				}
			},
		},
		mounted() {
			this.$store.dispatch('AdminPanel/GetUsers/CMS_SetUsersState')
		},
	}
</script>

<style lang="sass">

.CMS
	width: 100%	

.CMS_Messages
	color: rgb(var(--color-6))
	background-color: rgb(var(--color-2))
	h1
		color: rgb(var(--color-6))
		text-align: center
		display: block
		width: 100%
	input
		text-align: center
		font-weight: 700
		font-size: 12px
		padding: 5px 10%
		margin: 0px 25%
		color: rgb(var(--color-6))
		background-color: rgb(var(--color-2))
		border: 1px solid rgb(var(--color-3))
		border-radius: .7rem
		width: 100%
	&-Item
		border-radius: .7rem
		border: 1px solid rgb(var(--color-3))
		padding: 10px 20px
		max-height: 300px
	&-Textarea
		textarea
			resize: none
			display: block
			width: 100%
			height: 90px
			border-radius: .7rem
			padding: 15px 15px
			font-size: .8rem
			font-weight: 700
	&-Wrapper
		color: rgb(var(--color-6))
		padding: 20px 40px
		overflow-y: scroll
		height: calc(40vh - 40px)
		@media screen and ( max-width: $mobile-breakpoint )
			height: 100vh
		p
			text-align: left
			font-weight: 700
			font-size: 12px
			color: rgb(var(--color-6))
		span
			text-align: left
			font-weight: 700
			font-size: 12px
			p
				color: rgb(var(--color-4))
				float: right
				display: inline-block
	&-UserList
		span
			display: block
			text-align: center
			font-size: 12px
			color: rgb(var(--color-6))
		i
			display: block
			margin: 0 auto
			height: 80px
			width: 80px
			border-radius: 100%
			border: 3px solid rgb(var(--color-6))
			background-position: center center
			background-size: cover
			animation: UserProfile_Icon 1s 1
			@keyframes UserProfile_Icon
				0%
					transform: scale(0)
				50%
					transform: scale(0)
				100% 
					transform: scale(1)

</style>