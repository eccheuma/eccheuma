<template>
	<div class="scroll_panel-container">

		<transition name="Fading">
			<section class="scroll_panel-messages" v-if="LoginStatus">

				<i 
					@click="ScrollPage(0)" 
					v-b-toggle="`Header_menu_collapse`" 
					class="fas" 
					:class="[
						{ 'fa-envelope-open-text active': NewMessages > 0 },
						{ 'fa-envelope': NewMessages == 0 },
					]"/>

				<span>{{ NewMessages }}</span>
				
				<!-- <b-popover
					class="scroll_bar-container-Message"
					container="scroll-bar" 
					target="ScrollMessages" 
					triggers="hover" 
					:delay="{ show: 250, hide: 0 }"
					placement="right">
					<template v-if="LastMessage">
						<h6>От {{ LastMessage.from }}</h6>
						<hr>
						<p>{{ LastMessage.message }}</p>
					</template>
					<template v-else>
						<p>Нет новых сообщений</p>
					</template>
				</b-popover> -->
			</section>
		</transition>

		<section class="scroll_panel-switch">

			<i class="fas fa-adjust" />

			<div 
				id="ScrollTheme" 
				class="scroll_panel-switch-checker" 
				@click="changeTheme(UI === 'light' ? 'dark' : 'light')"
				>
				<span class="switch" :class="{ active: UI === 'dark' }" />
			</div>

			<!-- <b-popover target="ScrollTheme" triggers="hover" placement="right"
				:delay="{ show: 250, hide: 0 }">
				Смена темы
			</b-popover> -->

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
	}
	&-messages {
		grid-row: -3;
		text-align: center;
		i {
			display: block; width: 100%; padding: 10px 0;
			color: rgb(var(--color-4));
		}
		span {
			color: rgb(var(--color-4)); font-weight: 700; font-size: var(--font-size-3);
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
					radius: .7rem
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
	import { mapState, mapMutations } from 'vuex'

// TYPES
	import type { VuexModules } from '~/types/VuexModules'
	import type { APP_THEME } 	from '~/types/App.ts'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

// MODULE
	export default Vue.extend({
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
				NewMessages: 		state => (state as VuexModules).User.Messages.NewMessagesCount
			}),

		},
		mounted() {

			if ( this.CLIENT_RENDER_CHECK ) {

				const LOCAL_UI_THEME = window.localStorage.getItem('UI') || 'light';

				this.setUI(LOCAL_UI_THEME)

			}

		},
		methods: {
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