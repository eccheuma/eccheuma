<template>
	<div class="user_profile-component-picture">

		<div class="user_profile-component-picture-user">
			<i ref="iconPreview" :style="`background-image: url(${ NewIcon || UserState.UserImageID })`" />
			<input 
				v-show="false" 
				id="CustomImage" 
				ref="CustomIcon" 
				type="file" 
				accept=".png, .jpg, .webp" 
				@change="uploadIcon"
				>
			<common-button type="label" for="CustomImage">
				Загрузить своё
			</common-button>
		</div>
		<hr>
		<div class="user_profile-component-picture-predefined">
			<h6>Выбрать из стандартных</h6>
			<section class="user_profile-component-picture-predefined-icons">
				<template v-for="(url, i) in SelectableIcon">
					<i :key="i" :style="`background-image: url(${ url })`" @click="NewIcon = url" />
				</template>
			</section>
		</div>
		<hr>
		<div class="user_profile-component-picture-footer">
			<common-button :class="{ disabled: !NewIcon || NewIcon === UserState.UserImageID || Pending }" @click.native="updateIcon">
				Подтвердить
			</common-button>
		</div>

	</div>
</template>

<style lang="scss">

.ICON-PENDING {
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

.user_profile-component-picture {
	display: grid;
	grid-template: {
		rows: 50% 1px auto 1px min-content
	}

	row-gap: 10px;

	&-user {

		display: flex;
		flex-direction: column;
		place-items: center;

		gap: 2vh;

		i {
			display: inline-block;
			height: 100%; 
			aspect-ratio: 1/1;
			border-radius: 100%;
			border: 3px solid rgb(var(--color-mono-800));
			background-position: center center;
			background-size: cover;
			background-color: rgb(var(--color-mono-800));
		}
	}

	&-predefined {

		display: flex;
		flex-direction: column;
		place-items: center;

		gap: 2vh;

		&-icons {

			margin: auto;

			display: flex;
			place-content: center;
			width: 100%;
			height: 100%;

			gap: 1vw;

			i {
				display: inline-block;
				height: clamp(45px,10vh,100%); 
				aspect-ratio: 1/1;
				border-radius: 100%;
				border: 3px solid rgb(var(--color-mono-800));
				background-position: center center;
				background-size: cover;
				background-color: rgb(var(--color-mono-800));
			}
		}

	}

	&-footer {
		display: flex;
		flex-direction: column;
		place-items: center;
		gap: 1vh;
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// FIREBASE
	import firebase from 'firebase/app'
	import 'firebase/database'

	// IMPORTED TYPES
	import type { AnimeAnimParams, AnimeInstance } from 'animejs'

	// VUEX
	import { mapState, mapActions } from 'vuex'
	import type { VuexModules } from '~/typescript/VuexModules'

	// COMPONENT
	import CommonButton from '~/components/buttons/CommonButton.vue'

	// TYPES 
	type EXTENSIONS = [ string, 'png' | 'jpg' | 'jpeg' | 'webp' ];
	type MODE				= 'custom' | 'predefined' | undefined;

	// VARIABLES 
	const DefaultIconAnimation: AnimeAnimParams = {
		opacity: [1, 0],
		scale: [1, .9],
		duration: 500,
		direction: 'alternate',
		easing: 'easeInOutQuad',
		autoplay: false,
	}

	export default Vue.extend({
		components: {
			CommonButton
		},
		data() {
			return {

				Animations: new Map() as Map<string, AnimeInstance>,

				Warning: '',
				Mode: undefined as MODE,
				Pending: false,

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
		watch: {
			Mode: 'animatePredefinedIcons',
			Pending: {
				handler(value) {

					const PA = this.Animations.get('iconPending')!;
								PA.play();

					if ( !value ) {
						PA.update = ({ progress }) => { 
							if ( progress === 0 ) { PA.pause() }
						}
					} else {
						PA.update = undefined
					}

				}
			}
		},
		created() {
			this.getDefaultIcons()
		},
		mounted() {

			this.Animations.set('iconPending', this.$AnimeJS({

				targets: this.$refs.iconPreview,
				loop: true,

				...DefaultIconAnimation,

			}))

		},
		methods: {

			...mapActions({
				FireBaseChange: 'User/State/FireBaseChange'
			}),

			async getDefaultIcons() {

				const REFS = await firebase.storage().ref('UserIcons').list().then( res => res.items )

				REFS.forEach((item) => {

					firebase.storage()
						.ref(`UserIcons/${ item.name }`)
						.getDownloadURL()
						.then(( url: string ) => {
							this.SelectableIcon.push(url)
						})

				})

			},

			async uploadIcon() {

				this.Pending = true;
				this.NewIcon = '';

				const EL 	= this.$refs.CustomIcon as HTMLInputElement

				const N = EL.value.split( /\\/g ).pop()?.split( /\./g ) as EXTENSIONS

				const PATH	= 'UserIcons/ID'
				const NAME 	= this.UserState.UserID
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

						this.Warning = error

					}

				} else {

					this.Warning = 'File not loaded' 
					
				}

				const tempI 		= new Image();
							tempI.src = this.NewIcon;

				tempI.decode().then(() => {
					this.Pending = false;
				})

			},

			updateIcon() {

				const Property = {
					prop: this.NewIcon,
					entity: 'UserImageID' 
				}

				this.FireBaseChange(Property)

			},

			updatePreviewImage( element: any ) {

				const N = element.value.split( /\\/g ).pop().split( /\./g ) as EXTENSIONS

				this.CustomIconName = `${ N[0] }.${ N[1] }`;

				this.updateIcon()

			},

			animatePredefinedIcons() {

				console.log('TEST');

				this.$AnimeJS({
					targets: this.$refs.icons,
					duration: 1000,
					easing: 'easeInOutQuad',
					delay: this.$AnimeJS.stagger(100),
					translateY: [40, 0],
					opacity: [0, 1],
				})
			},

			changeMode(mode: MODE) {

				this.Mode = mode;

			}
			
		},
	})

</script>
