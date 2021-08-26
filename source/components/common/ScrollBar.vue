<template>
	<div class="scroll_panel-container">

		<template v-if="LoginStatus">

			<section id="ScrollMessage" class="scroll_panel-messages">

				<icon :name="NewMessages ? 'Unread' : 'Message'" />

				<span>{{ NewMessages }}</span>
				
			</section>

			<hr>

		</template>

		<section class="scroll_panel-mute">
			<span
				:class="[{ active: GlobalHowler.mute && !GlobalHowler.inChange }, { change: GlobalHowler.inChange }]"
				@click="globalMute(!GlobalHowler.mute)"
			>
				<!-- <i class="fas" :class="GlobalHowler.mute ? `fa-volume-mute` : `fa-volume-up`" /> -->

				<icon name="Mute" />

			</span>
		</section>

		<hr>

		<section class="scroll_panel-switch">

			<icon name="Theme" />

			<div 
				id="ScrollTheme" 
				class="scroll_panel-switch-checker"
				:class="{ active: UI === 'dark' }" 
				@click="changeTheme(UI === 'light' ? 'dark' : 'light')"
				>
				<span class="switch" />
			</div>

		</section>

		<hr>

		<section class="scroll_panel-arrows">

			<icon name="Arrow" @click.native="scrollPage(0)" />

			<icon name="Arrow" @click.native="scrollPage(9999)" />

		</section>

	</div>
</template>

<style lang="scss">

.scroll_panel {
	&-container {

		position: sticky; 
		top: 0; 
		left: 0;

		display: flex;
		align-items: stretch;
		flex-direction: column;
		justify-content: flex-end;

		row-gap: 10px; 

		height: 100vh; 
		width: 100%;

		padding: 3vh 10px;

		background-color: rgb(var(--color-mono-200));
		border: {
			right: 1px solid rgb(var(--color-mono-300));
		}

		section {

			@include component-shadow;

			background-color: rgb(var(--color-mono-200));
			border-radius: .7rem;

			overflow: hidden;

		}

		hr {
			background: rgb(var(--color-mono-400));
			margin: 0 0.75vw;
		}

	}
	&-messages {

		text-align: center;

		padding: 1vh 0;

		i { @include icon-size(var(--size-36));
			background-color: rgb(var(--color-mono-500));
		}

		span {
			color: rgb(var(--color-mono-500)); 
			font-weight: 700; 
			font-size: var(--font-size-14);
		}

	}
	&-mute {

		.change {
			opacity: .25;
			pointer-events: none;
		}

		.active {
			color: rgb(var(--color-mono-200)) !important;
			background-color: rgb(var(--color-mono-800)) !important;
			animation: Mute 1s infinite alternate;
			@keyframes Mute {
				0% {
					transform: scale(0.85);
				}
				100% {
					transform: scale(1);
				}
			}
		}

		padding: 10px;

		span {

			cursor: pointer;
			display: flex;
			width: 100%;
			aspect-ratio: 1/1;
			background-color: rgb(var(--color-mono-200));
			border: 2px solid rgb(var(--color-mono-400));
			border-radius: 100%;
			opacity: 1;
			margin: auto;

			transition: all 250ms ease-in-out;

			i { @include icon-size(2.75vh);
				background-color: rgb(var(--color-mono-500));
			}

		}
	}
	&-switch {

		display: grid;
		justify-content: center;

		row-gap: 1vh;

		color: rgb(var(--color-mono-400));
		background-color: rgb(var(--color-mono-200));
		padding: 10px 0;

		i { @include icon-size(var(--size-36));
			background-color: rgb(var(--color-mono-500));
		}

		$pad: 2px;
		$wid: 1.75vw;

		&-checker {

			position: relative;
			cursor: pointer;

			margin: auto;

			height: 8vh;
			width: $wid; 

			padding: $pad;

			background-color: rgb(var(--color-mono-300));
			border: 1px solid rgb(var(--color-mono-400));
			border: {
				radius: 10rem;
			}

			span { 
				
				position: absolute;
				top: 2px;

				width: calc(100% - #{ $pad * 2});
				aspect-ratio: 1/1;
				background-color: rgb(var(--color-mono-700));
				border: {
					radius: 100%
				}

				transition-duration: 500ms;

			}

		}

		.active {
			span {
				position: absolute;
				top: calc((100% - #{ $wid }) + #{ $pad + 1px }); // (Высота контейнера - Ширина тумблера) + ( Отступ + Ширина обводки )
				background-color: rgb(var(--color-mono-800));
			}
		}

	}
	&-arrows { 
		
		grid-row: -1;
		padding: 10px 0;

		display: grid;
		justify-content: center;

		row-gap: 1vh;

		i { @include icon-size(var(--size-48));

			text-align: center; 
			font-size: 1.5vw;

			background-color: rgb(var(--color-mono-400));

			cursor: pointer;
			transition-duration: 250ms;

			&:hover {
				background-color: rgb(var(--color-mono-800));
			} 

			&:nth-of-type(1) {
				transform: rotate(90deg)
			}

			&:nth-of-type(2) {
				transform: rotate(-90deg)
			}

		}
	}
}

</style>
 
<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapMutations, mapActions } from 'vuex'

// COMPONENTS
	// import Popover from '~/components/common/Popover.vue'
	import Icon									from '~/components/Icon.vue'

// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'
	import type { APP_THEME } 	from '~/typescript/App'

// MIXINS
	import EmitSound, { SoundInstance } from '~/assets/mixins/EmitSound'

// MODULE
	export default Vue.extend({
		components: {
			Icon
		},
		mixins: [ EmitSound ],
		data() {
			return {
				LocalStatusOfTumbler: false,
			}
		},
		computed: {

			...mapState({
				UI: 						state => (state as VuexModules).App.UI,
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus,
				Messages: 			state => (state as VuexModules).User.Messages.Messages,
				NewMessages: 		state => (state as VuexModules).User.Messages.NewMessagesCount,
				GlobalHowler: 	state => (state as VuexModules).Sound.global,
			}),

		},
		created() {

			if ( process.client && window.matchMedia('(prefers-color-scheme: light)').matches ) {
				
				let THEME: APP_THEME = 'dark'
				
				THEME = 'light'

				this.setUI(THEME)
			
			}

			const S: SoundInstance[] = [
				{
					file: 'Off',
					name: 'ThemeLight',
					settings: { rate: 1.25, volume: .25 },
				},
				{
					file: 'Off',
					name: 'ThemeDark',
					settings: { rate: .75, volume: .25 },
				},
				{
					file: 'On',
					name: 'ScrollButton',
				}
			]

			this.setSounds(S)

		},
		methods: {

			...mapActions({
				globalMute: 'Sound/globalMute',
			}),

			...mapMutations({
				setUI: 'App/setUI',
			}),

			scrollPage(to: 0 | 9999) {

				this.playSound(this.Sounds.get('ScrollButton')!)

				window.scrollTo({
					top: to,
					left: 0,
					behavior: 'smooth'
				});
			},

			changeTheme(theme: APP_THEME) {

				this.setUI(theme); 

				switch (theme) {

					case 'light': 

						this.playSound(this.Sounds.get('ThemeLight')!)

					break;

					case 'dark': 
					
						this.playSound(this.Sounds.get('ThemeDark')!)

					break;

				}

			},

		},
	})

</script>
