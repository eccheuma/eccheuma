<template>
	<div class="scroll_panel-wrap">
		<div class="scroll_panel-container">

			<transition name="Fading">
				<section class="scroll_panel-messages" v-if="LoginStatus">

					<i @click="ScrollPage(0)" v-b-toggle="`Header_menu_collapse`" class="fas" 
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

				<i class="fas fa-adjust"></i>

				<div class="scroll_panel-switch-checker" id="ScrollTheme" @click="StateThemeChange">
					<span class="switch" :class="{ active: DarkUI }"></span>
				</div>

				<b-popover target="ScrollTheme" triggers="hover" placement="right"
					:delay="{ show: 250, hide: 0 }">
					Смена темы
				</b-popover>

			</section>

			<section class="scroll_panel-arrows">

				<i class="fas fa-sort-up" @click="ScrollPage(0)" />

				<i class="fas fa-sort-down" @click="ScrollPage(9999)" />

			</section>

		</div>
	</div>
</template>

<style lang="scss" scoped>

$scroll_w: 3vw;

%TopBorder {
	$s: 75%;
	position: relative;
	&:before {
		content: '';
		position: absolute; top: 0; left: #{ (100% - $s) / 2 };
		width: $s; height: 1px; background-color: $color3;
	}
};

.scroll_panel {
	&-wrap {
		position: absolute; top: 0; left: 0; z-index: 1000;
		height: 100%; width: $scroll_w;
		background-color: $color1;
	}
	&-container {
		position: sticky; top: 0; left: 0;
		display: grid; grid-template: { columns: 1fr; rows: repeat(10, minmax(auto, 1fr))}; row-gap: 10px; 
		align-items: center;
		height: 100vh; width: $scroll_w;
	}
	&-messages {
		grid-row: -3;
		text-align: center;
		i {
			display: block; width: 100%; padding: 10px 0;
			color: $color4;
		}
		span {
			color: $color4; font-weight: 700; font-size: $FontSize3;
		}
	}
	&-switch {
		grid-row: -2;
		text-align: center; color: $color3;
		background-color: $color1;
		padding: 10px 0;
		@extend %TopBorder;
		&-checker {
			position: relative; margin: 0px auto; margin-top: 10px;
			height: calc(#{$scroll_w} + 15px); width: 50%; 
			background-color: $color3;
			border: {
				radius: .7rem
			}

			span { 
				position: absolute; top: 0; left: 0;
				height: calc(#{$scroll_w} / 2); width: calc(#{$scroll_w} / 2);
				background-color: $color2;
				transform: scale(.75);
				transition-duration: 500ms;
				border: {
					radius: .7rem
				}
			}

			.active {
				top: calc(#{$scroll_w} - 10px);
				background-color: $color6;
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
			color: $color4;
			transition: color 250ms ease; will-change: color;
			&:hover {
				color: $color5
			} 
		}
	}
}

</style>
 
<script lang="ts">

	import Vue from 'vue'

	import { mapState, mapMutations, mapActions } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	import EmitSound from '~/assets/mixins/EmitSound'

	export default Vue.extend({
		mixins: [ EmitSound ],
		props: ['name'],
		data() {
			return {
				LocalStatusOfTumbler: false
			}
		},
		computed: {

			...mapState({
				DarkUI: 				state => (state as VuexModules).ScrollBar.DarkUI,
				LoginStatus: 		state => (state as VuexModules).Auth.Auth.LoginStatus,
				Messages: 			state => (state as VuexModules).User.Messages.Messages,
				NewMessages: 		state => (state as VuexModules).User.Messages.NewMessagesCount
			}),

		},
		watch: {
			Messages: {
				handler() {
					console.log(this.Messages)
				}
			}
		},
		methods: {
			...mapActions({
				ChangeUITheme: 'ScrollBar/ChangeUITheme',
			}),
			ScrollPage(to: 0 | 9999) {
				window.scrollTo({
					top: to,
					left: 0,
					behavior: 'smooth'
				});
			},
			StateThemeChange() {

				this.DarkUI ? this.EmitSound(`Off`, { rate: 1.25 }) : this.EmitSound(`Off`, { rate: .75 })

				this.ChangeUITheme()

			},
		},
		mounted() {

			if ( localStorage.theme == "true") {
				this.ChangeUITheme(true)
			}
		}
	})

</script>