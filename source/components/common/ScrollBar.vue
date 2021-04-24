<template>
	<div class="scroll_panel-container">

		<transition name="Fading">
			<section v-if="LoginStatus" id="ScrollMessage" class="scroll_panel-messages">

				<i 
					class="fas" 
					:class="[
						{ 'fa-envelope-open-text active': NewMessages > 0 },
						{ 'fa-envelope': NewMessages == 0 },
					]"
					@click="scrollPage(0)" 
					/>

				<span>{{ NewMessages }}</span>
				
				<!-- <popover target="ScrollMessage">
					<p>Нет новых сообщений</p>
				</popover> -->

			</section>
		</transition>

		<section class="scroll_panel-mute">
			<span
				:class="[{ active: GlobalVolume.Mute && !GlobalVolume.inChange }, { change: GlobalVolume.inChange }]"
				@click="changeGlobalVolume({ _volume: Number(GlobalVolume.Mute), _duration: 1000 })"
			>
				<i class="fas" :class="GlobalVolume.Mute ? `fa-volume-mute` : `fa-volume-up`" />
			</span>
		</section>

		<section class="scroll_panel-switch">

			<i class="fas fa-adjust" />

			<div 
				id="ScrollTheme" 
				class="scroll_panel-switch-checker" 
				@click="changeTheme(UI === 'light' ? 'dark' : 'light')"
				>
				<span class="switch" :class="{ active: UI === 'dark' }" />
			</div>

		</section>

		<section class="scroll_panel-arrows">

			<i class="fas fa-sort-up" @click="scrollPage(0)" />

			<i class="fas fa-sort-down" @click="scrollPage(9999)" />

		</section>

	</div>
</template>

<style lang="scss">

$scroll_w: 3vw;

%TopBorder {
	$s: 75%;
	position: relative;
	&:before {
		content: '';
		position: absolute; top: 0; left: #{ (100% - $s) / 2 };
		width: $s; height: 0.25px; background-color: rgb(var(--color-3));
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
		i {
			display: block; width: 100%; padding: 10px 0;
			color: rgb(var(--color-4));
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
			color: rgb(var(--color-4));
			font-size: #{$size / 3};
			background-color: rgb(var(--color-1));
			border: 1px solid rgb(var(--color-3));
			border-radius: 100%;
			opacity: 1;
			margin: auto;

			transition: all 250ms ease-in-out;

			i {
				margin: auto;
			}
		}
	}
	&-switch {
		grid-row: -2;
		text-align: center; color: rgb(var(--color-3));
		background-color: rgb(var(--color-1));
		padding: 10px 0;
		@extend %TopBorder;
		&-checker {
			position: relative; margin: 0px auto; margin-top: 10px;
			height: calc(#{$scroll_w} + 15px); width: 50%; 
			background-color: rgb(var(--color-3));
			border: {
				radius: .7rem
			}

			span { 
				position: absolute; top: 0; left: 0;
				height: calc(#{$scroll_w} / 2); width: calc(#{$scroll_w} / 2);
				background-color: rgb(var(--color-2));
				transform: scale(.75);
				transition-duration: 500ms;
				border: {
					radius: 100%
				}
			}

			.active {
				top: calc(#{$scroll_w} - 10px);
				background-color: rgb(var(--color-5));
			}

		}
	}
	&-arrows {
		grid-row: -1;
		padding: 20px 0;
		@extend %TopBorder;
		i {
			display: block; width: 100%;
			text-align: center; font-size: 1.5vw;
			color: rgb(var(--color-4));
			transition: color 250ms ease; will-change: color;
			&:hover {
				color: rgb(var(--color-6))
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

// TYPES
	import type { VuexModules } from '~/types/VuexModules'
	import type { APP_THEME } 	from '~/types/App.ts'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

// MODULE
	export default Vue.extend({
		// components: {
		// 	Popover
		// },
		mixins: [ EmitSound ],
		data() {
			return {
				LocalStatusOfTumbler: false
			}
		},
		computed: {

			...mapState({
				UI: 						state => (state as VuexModules).App.UI,
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus,
				Messages: 			state => (state as VuexModules).User.Messages.Messages,
				NewMessages: 		state => (state as VuexModules).User.Messages.NewMessagesCount,
				GlobalVolume: 	state => (state as VuexModules).Sound.Global,
			}),

		},
		mounted() {

			if ( this.CLIENT_RENDER_CHECK ) {

				const LOCAL_UI_THEME = window.localStorage.getItem('UI') || 'light';

				this.setUI(LOCAL_UI_THEME)

			}

		},
		methods: {

			...mapActions({
				changeGlobalVolume: 'Sound/Set_GlobalSoundProperty', 
			}),

			...mapMutations({
				setUI: 'App/setUI',
			}),

			scrollPage(to: 0 | 9999) {

				this.EmitSound('On', { rate: .5, volume: .25 })

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
						this.EmitSound('Off', { rate: 1.25, volume: .25 }); 
					break;

					case 'dark': 	
						this.EmitSound('Off', { rate: .75, volume: .25 }); 
					break;

				}

			},
		},
	})

</script>
