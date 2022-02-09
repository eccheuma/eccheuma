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
			<span v-if="Warning.length">{{ Warning }}</span>
		</div>
		<hr v-once>
		<div class="user_profile-component-picture-predefined">
			<h6>Выбрать из стандартных</h6>
			<section class="user_profile-component-picture-predefined-icons">
				<template v-for="(url, i) in SelectableIcon">
					<i :key="i" :style="`background-image: url(${ url })`" @click="NewIcon = url" />
				</template>
			</section>
		</div>
		<hr v-once>
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
			border: 3px solid rgb(var(--color-mono-900));
			background-position: center center;
			background-size: cover;
			background-color: rgb(var(--color-mono-900));
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
				border: 3px solid rgb(var(--color-mono-900));
				background-position: center center;
				background-size: cover;
				background-color: rgb(var(--color-mono-900));
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

	// IMPORTED TYPES
	import type { AnimeAnimParams, AnimeInstance } from 'animejs'

	// VUEX
	import { mapState } from 'vuex'
	import type { VuexModules } from '~/typescript/VuexModules'

	// API
	import { storage } from '~/api/storage';
	import { database } from '~/api/database';

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

				Warning: String(),
				Mode: undefined as MODE,
				Pending: false,

				CustomIconName: String(),
				NewIcon: String(),

				SelectableIcon: Array<string>(),

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

			getDefaultIcons() {

				storage.list('UserIcons').then(response => {

					if ( response?.error ) throw response.error;

					if ( response?.data === null ) throw new Error('response error');

					response.data.forEach(file => {

						if ( file.metadata ) {

							const URL = storage.reference(`UserIcons/${ file.name }`);

							if ( URL ) {
								this.SelectableIcon.push(URL);
							} else { 
								throw new Error(`[getDefaultIcons]: File on relative path "UserIcons/${ file.name }" not exist`) 
							}

						}

					})

				})

			},

			async uploadIcon() {

				this.Pending = true;
				this.NewIcon = '';

				const EL = this.$refs.CustomIcon as HTMLInputElement
				const N = EL.value.split( /\\/g ).pop()?.split( /\./g ) as EXTENSIONS;

				const PATH	= 'UserIcons/ID'
				const ID 		= this.UserState.UserID
				const EXT 	= N?.[1]; 

				if ( EL.files && ID && EXT ) {

					const FILE = new File([ EL.files[0] ], ID);
					const DIST = `${ PATH }/${ FILE.name }::${ FILE.size.toString(36).toUpperCase() }.${ EXT }`;

					if ( FILE.size >= 15e5 ) {

						this.Warning = `File size limit is 1.5MB. Your is: ${ parseFloat(Number(FILE.size / 10e5).toPrecision(3)) }MB`; 
						this.Pending = false;

						return;

					}

					await storage.upload(DIST, FILE, { contentType: FILE.type })

					const URL = storage.reference(DIST);

					this.Pending = false;

					if ( URL ) { this.NewIcon = URL }

				} else { this.Warning = 'File not loaded'; this.Pending = false }

			},

			updateIcon() {

				database.update(`Users/${ this.UserState.UserID }/state`, { UserImageID: this.NewIcon });

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
