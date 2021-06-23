<template>
	<div class="scroll_panel-container">

		<transition name="Fading">
			<section v-if="LoginStatus" id="ScrollMessage" class="scroll_panel-messages">

				<icon :name="NewMessages ? 'Unread' : 'Message'" />

				<span>{{ NewMessages }}</span>
				
				<!-- <popover target="ScrollMessage">
					<p>Нет новых сообщений</p>
				</popover> -->

			</section>
		</transition>

		<section class="scroll_panel-mute">
			<span
				:class="[{ active: GlobalHowler.mute && !GlobalHowler.inChange }, { change: GlobalHowler.inChange }]"
				@click="globalMute(!GlobalHowler.mute)"
			>
				<!-- <i class="fas" :class="GlobalHowler.mute ? `fa-volume-mute` : `fa-volume-up`" /> -->

				<icon name="Mute" />

			</span>
		</section>

		<section class="scroll_panel-switch">

			<icon name="Theme" />

			<div 
				id="ScrollTheme" 
				class="scroll_panel-switch-checker" 
				@click="changeTheme(UI === 'light' ? 'dark' : 'light')"
				>
				<span class="switch" :class="{ active: UI === 'dark' }" />
			</div>

		</section>

		<section class="scroll_panel-arrows">

			<icon name="Arrow" @click.native="scrollPage(0)" />

			<icon name="Arrow" @click.native="scrollPage(9999)" />

		</section>

	</div>
</template>

<style lang="scss">

$scroll_w: 4vw;

%TopBorder {
	$s: 75%;
	position: relative;
	&:before {
		content: '';
		position: absolute; top: 0; left: #{ (100% - $s) / 2 };
		width: $s; height: 1px; background-color: rgb(var(--color-3));
	}
};

.scroll_panel {
	&-container {
		position: sticky; top: 0; left: 0;
		display: grid; grid-template: { columns: 1fr; rows: repeat(10, minmax(auto, 1fr))}; row-gap: 10px; 
		align-items: center;
		height: 100vh; width: $scroll_w;
		background-color: rgb(var(--color-1));

		@include gradient_border(right)

	}
	&-messages {

		grid-row: -4;
		text-align: center;

		i { @include icon-size(1.75vw);
			background-color: rgb(var(--color-4));
		}

		span {
			color: rgb(var(--color-4)); 
			font-weight: 700; 
			font-size: var(--font-size-4);
		}

	}
	&-mute {

		.change {
			opacity: .25;
			pointer-events: none;
		}

		.active {
			color: rgb(var(--color-1)) !important;
			background-color: rgb(var(--color-5)) !important;
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

		@extend %TopBorder;
		grid-row: -3;
		padding: 2vh 0 5px;

		span {

			$size: $scroll_w / 1.5;

			cursor: pointer;
			display: flex;
			width: $size;
			height: $size;
			background-color: rgb(var(--color-1));
			border: 2px solid rgb(var(--color-3));
			border-radius: 100%;
			opacity: 1;
			margin: auto;

			transition: all 250ms ease-in-out;

			i { @include icon-size(1.6vw);
				background-color: rgb(var(--color-4));
			}

		}
	}
	&-switch { @extend %TopBorder;

		grid-row: -2;
		text-align: center; color: rgb(var(--color-3));
		background-color: rgb(var(--color-1));
		padding: 10px 0;

		i { @include icon-size(1.75vw);
			background-color: rgb(var(--color-4));
		}

		&-checker {

			position: relative;
			cursor: pointer;

			margin: 10px auto 0; 

			height: calc(#{$scroll_w} + 15px); 
			width: 50%; 

			background-color: rgb(var(--color-3));
			border: {
				radius: 4rem
			}

			span { 

				position: absolute;
				display: block;

				top: 0px;

				height: calc(#{$scroll_w} / 2); 
				width: 	calc(#{$scroll_w} / 2);
				background-color: rgb(var(--color-2));
				transform: scale(.75);
				border: {
					radius: 100%
				}

				transition-duration: 500ms;

			}

			.active {

				top: calc(100% - #{$scroll_w / 2});
				background-color: rgb(var(--color-5));

			}

		}
	}
	&-arrows { @extend %TopBorder;

		grid-row: -1;
		padding: 20px 0;

		display: grid;
		justify-content: center;

		row-gap: 1vh;

		i { @include icon-size(2.25vw);

			text-align: center; font-size: 1.5vw;
			transition: color 250ms ease; will-change: color;

			background-color: rgb(var(--color-4));

			cursor: pointer;

			&:hover {
				background-color: rgb(var(--color-6));
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
		mounted() {

			if ( this.CLIENT_RENDER_CHECK ) {

				const LOCAL_UI_THEME = window.localStorage.getItem('UI') || 'light';

				this.setUI(LOCAL_UI_THEME)

			}

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
