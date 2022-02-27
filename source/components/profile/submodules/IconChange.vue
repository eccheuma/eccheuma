<template>
	<div class="user_profile-component-picture">

		<div class="user_profile-component-picture-user">
			<i ref="iconPreview" :style="`background-image: url(${ NewIcon || State.UserImageID })`" />
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
			<common-button :class="{ disabled: !NewIcon || NewIcon === State.UserImageID }" @click.native="updateIcon">
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

	// VUEX
	import { mapState } from 'vuex'
	import type { VuexMap } from '~/typescript/VuexMap';

	// API
	import { storage } from '~/api/storage';
	import { database } from '~/api/database';

	// UTILS
	import { utils } from '~/utils'

	// LANG
	import { getLocale } from '~/lang'

	// COMPONENT
	import CommonButton from '~/components/buttons/CommonButton.vue'

	const enum loadStatus {
		start,
		pending,
		error,
		done,
	}

	// VARIABLES 
	const SIZE_LIMIT = 15e5;

	export default Vue.extend({
		components: {
			CommonButton
		},
		data() {
			return {

				Warning	: String(),
				Loading	: loadStatus.done,

				NewIcon: String(),

				SelectableIcon: Array<string>(),

			}
		},
		computed: {
			...mapState({

				State	: state => (state as VuexMap).User.State.State,
				Lang	: state => (state as VuexMap).App.Lang,

			}),
		},
		watch: {
			Loading: {
				handler(value: loadStatus) {

					switch (value) {
						case loadStatus.start: 
							this.animateIcon({ direction: 'reverse' }); console.log('start'); break;
						case loadStatus.pending: 
							this.animateIcon({ direction: 'alternate', iterations: Infinity }); console.log('pending'); break;
						case loadStatus.error: 
							this.animateIcon({ direction: 'normal', duration: 100, iterations: 3 }); console.log('error'); break;
						case loadStatus.done: 
							this.animateIcon({ direction: 'normal', iterations: 1 }); console.log('done'); break;
					}

				}
			}
		},
		async mounted() {

			this.SelectableIcon = await this.getDefaultIcons()

		},
		methods: {

			async getDefaultIcons(): Promise<Array<string>> {

				const response = await storage.list('UserIcons');

				if ( typeof response === 'string' ) return new Array(0);

				return response.files
					.map(({ path }) => storage.reference(path))
					.filter(x => x) as Array<string>;

			},

			async uploadIcon(event: InputEvent) {

				const { files, value,  } = event.target as HTMLInputElement;

				if ( !files || files.length === 0 ) return;

				this.Loading = loadStatus.start;
				this.NewIcon = String();

				const EXTENSION = utils.getExtension(value);

				if ( typeof EXTENSION !== 'string' ) throw EXTENSION;

				const FILE = new File([ files[0] ], this.State.UserID);
				const DIST = `UserIcons/ID/${ FILE.name }::${ FILE.size.toString(36).toUpperCase() }.${ EXTENSION }`;

				if ( FILE.size >= SIZE_LIMIT ) {

					this.Warning = `${ getLocale(this.Lang).fileInput.sizeStrict }: ${ parseFloat(Number(FILE.size / 10e5).toPrecision(3)) }МБ`; 
					this.Loading = loadStatus.error;

					return;

				}

				await this.setIcon(DIST, FILE);

				this.Loading = loadStatus.done;
				this.Warning = String();

			},

			async setIcon(path: string, file: File) {

				this.Loading = loadStatus.pending;

				await storage.upload(path, file, { contentType: file.type })

				// TS can't correct work with logical assigment...
				this.NewIcon ||= storage.reference(path) as string;

			},

			updateIcon() {

				database.update(`Users/${ this.State.UserID }/state`, { UserImageID: this.NewIcon });

			},

			animateIcon(params: KeyframeAnimationOptions) {

				const element = (this.$refs.iconPreview as HTMLElement);

				element.getAnimations().forEach(animation => animation.cancel())

				element.animate([
					{ opacity: 0 },
					{ opacity: 1 },
				], {

					duration: 500,

					...params,

				})

			}
			
		},
	})

</script>
