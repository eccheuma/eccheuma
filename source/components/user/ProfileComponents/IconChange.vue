<template>
	<div class="user_profile-component-icon">

		<button @click="CustomIconArea = !CustomIconArea">
			{{ CustomIconArea ? 'Выбрать из стандартных' : 'Загрузить своё изображение' }}
		</button>

		<i 
			:class="{ PENDING }"
			:style="`background-image: url(${ !NewIcon.length ? UserState.UserImageID : NewIcon }`" 
		/>

		<div class="user_profile-component-sections">
			
			<transition-group name="page_transition">

				<template v-if="!CustomIconArea">
					<section key="icon-area-0" class="user_profile-component-icon-prepared" >

						<span>
							Zu nun und euch zug ernsten. Nebel früh und gleich walten, macht seelen wie träne geneigt kommt, versuch träne.
						</span>

						<template v-if="SelectableIcon.length">
							<i 
								v-for="(item, index) in SelectableIcon" 
								:key="index"
								:style="`background-image: url(${ item })`" 
								@click="NewIcon = item" />
						</template>

						<button @click="UploadProfileImage" :class="{ NonActive: !NewIcon }">Подтвердить</button>

					</section>
				</template>

				<template v-else>
					<section key="icon-area-1" class="user_profile-component-icon-input">

						<span>
							Zu nun und euch zug ernsten. Nebel früh und gleich walten, macht seelen wie träne geneigt kommt, versuch träne gestalten die ist das. Einst ertönt dem vom und in mich. Entwöhntes aus irrt der der was die geisterreich die gleich..
						</span>

						<section>

							<input type="file" id="CustomIcon" 
								accept=".png, .jpg, .jpeg, .webp"
								ref="CustomIcon" 
								v-show="false" 
								@change="UpdatePreviewImage($refs.CustomIcon)">

							<label for="CustomIcon" class=TEST>
								{{ CustomIconName.length ? CustomIconName : 'Файл не выбран' }}
							</label>

						</section>

						<button 
							@click="UploadProfileImage" 
							:class="[
								{ PENDING },
								{ NonActive: !CustomIconName.length },
							]">
							Отправить
						</button>

					</section>
				</template>

			</transition-group>

		</div>

	</div>
</template>

<style lang="scss" scoped>

.PENDING {
	pointer-events: none;
	animation: PENDING 500ms infinite alternate;
	@keyframes PENDING {
		0% {
			opacity: .5;
		}
		100% {
			opacity: .25;
		}
	}
}

.user_profile-component {
	&-sections {
		overflow-y: hidden;
	}
	&-icon {

		display: grid;
		grid-template: {
			columns: 1fr;
			rows: 2fr 3fr 5fr;
		}

		height: 60vh; overflow-y: hidden;

		> button {
			@include light-button { 
				display: block;
				width: 50%;
				margin: auto;
			}
		}

		i {
			$s: 120px;
			margin: auto;
			height: $s;
			width: $s;
			border-radius: 100%;
			border: 3px solid $color3;
			background-position: center;
			background-size: cover;
			background-color: $color6;
		}

		&-prepared {

			height: 80px;

			span {
				display: block;
				margin: 3vh 5vw;
				color: $color5;
				font: {
					size: .75rem;
				}
			}

			button {
				@include light-button { 
					display: block;
					width: 50%;
					margin: 3vh auto 0;
				};
			}

			i {
				$s: 50px;
				cursor: pointer;
				display: inline-block;
				margin: auto 10px;
				height: $s;
				width: $s;
				border-radius: 100%;
				border: 2px solid $color6;

				background: {
					color: $color6;
					position: center;
					size: cover;
				}
				
				transition-duration: .25s;
				&:hover {
					transform: scale(1.25);
				}
			}
			
		}

		&-input {

			margin: 3vh 0;
			padding: 0 5vw;

			span {
				color: $color5;
				font: {
					size: .75rem;
				}
			}

			label {
				@include light-button { 
					display: block;
					width: 50%;
					margin: 3vh auto;
					justify-self: center; 
					align-self: center;
				};
			}

			button {
				@include light-button { 
					display: block;
					width: 50%;
					margin: auto;
				};
			}

		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// FIREBASE
	import firebase from "firebase/app"
	import 'firebase/database'

	// VUEX
	import { mapState, mapActions } from 'vuex'
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES 
	type EXTENSIONS = [ string, 'png' | 'jpg' | 'jpeg' | 'webp' ]

	export default Vue.extend({
		data() {
			return {

				PENDING: false,

				Warning: '',

				CustomIconArea: false,

				CustomIconName: '' as string,
				NewIcon: '' as string,

				SelectableIcon: [] as string[]

			}
		},
		computed: {
			...mapState({

				UserState: state	=> (state as VuexModules).User.State.UserState,

			}),
		},
		methods: {

			...mapActions({
				FireBaseChange: 'User/State/FireBaseChange'
			}),

			async GetImagesList() {

				const REFS = await firebase.storage().ref(`UserIcons`).list().then( res => res.items )

				REFS.map( item => {

					firebase.storage()
						.ref(`UserIcons/${ item.name }`)
						.getDownloadURL()
						.then(( url: string ) => {
							this.SelectableIcon.push(url)
						})

				})

			},
			UploadProfileImage() {

				const Property = {
					prop: this.NewIcon,
					entity: 'UserImageID' 
				}

				this.FireBaseChange(Property)

			},
			async SetCustomIcon() {

				this.PENDING = true;

				const EL 	= this.$refs.CustomIcon as HTMLInputElement

				const N = EL.value.split( /\\/g ).pop()?.split( /\./g ) as EXTENSIONS

				const PATH	= 'UserIcons/ID'
				const NAME 	= N?.[0];
				const EXT 	= N?.[1]; 

				if ( EL.files && NAME && EXT ) {

					const FILE = new File([ EL.files[0] ], NAME);
					const META = { contentType: `image/${ EXT }` };

					try {

						await firebase.storage()
							.ref(`${ PATH }`)
							.child(`${ NAME }.${ EXT }`)
							.put(FILE, META)

						const URL = await firebase.storage()
							.ref(`${ PATH }/${ NAME }.${ EXT }`)
							.getDownloadURL()

						if ( URL ) { this.NewIcon = URL }
						
					} catch ( error ) { 
						
						console.log(error);

					}

				} else {

					this.Warning = 'File not loaded' 
					
				}

				this.PENDING = false;

			},
			UpdatePreviewImage( element: any ) {

				const N = element.value.split( /\\/g ).pop().split( /\./g ) as EXTENSIONS

				this.CustomIconName = `${ N[0] }.${ N[1] }`;

				this.SetCustomIcon()

			},
			
		},
		created() {
			this.GetImagesList()
		}
	})

</script>