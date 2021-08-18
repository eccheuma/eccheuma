// LIBS
	import 			{ Howler, Howl } 	from 'howler'
	import type { HowlOptions } 	from 'howler';

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

	import animeJS from 'animejs'
	import type { SoundInstance } from '~/assets/mixins/EmitSound';

// TYPES 
	interface GLOBAL_PROPERTY {
		mute: boolean
		volume: number
		inChange: boolean
	};

	type GLOBAL_VALUES = GLOBAL_PROPERTY[keyof GLOBAL_PROPERTY];

// STATE
	export const state = () => ({

		global: {
			mute: false,
			volume: 1,
			inChange: false,
		} as GLOBAL_PROPERTY,

		sounds: new Map() as Map<string, Howl>,

	})

// STATE INTERFACE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			Sound: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setSound(state, { name, howl }: { name: string, howl: Howl }) {
			state.sounds.set(name, howl);	
		},

		deleteSound(state, name: string) {
			state.sounds.delete(name)
		},

		setGlobalProperty(state, prop: { type: keyof GLOBAL_PROPERTY, value: GLOBAL_VALUES }) {

			( state.global[prop.type] as number | boolean ) = prop.value

		}

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {

		registerSound(vuex, sound: SoundInstance ): Howl {

			const PREDEFINED_OPTIONS: Partial<HowlOptions> = {
				preload: true,
			}

			const CURRENT_HOWL: Howl = new Howl({ 

				...PREDEFINED_OPTIONS, 
				...sound.settings,

				onplayerror: () => {
					CURRENT_HOWL.once('unlock', () => CURRENT_HOWL.play())
				}

			});

			vuex.commit('setSound', { name: sound.name, howl: CURRENT_HOWL });

			return vuex.state.sounds.get(sound.name)!

		},

		playSound(_vuex, howl: Howl) {

			howl ? howl.play() : console.warn('That sound probably not even registred.');

		},

		globalMute(vuex, value: boolean ) {

			vuex.dispatch('changeGlobalVolume', Number(!value)).then(() => { 

				vuex.commit('setGlobalProperty', { type: 'mute', value }); Howler.mute(value);

			})

		},

		changeGlobalVolume(vuex, value: number) {

			// animeJS.running.forEach(anim => anim.pause());

			if ( process.browser ) {

				const GLOBAL_PROPERTY: { type: keyof GLOBAL_PROPERTY, value: GLOBAL_VALUES } = {
					type: 'inChange',
					value: true
				}

				const TARGET 	= { volume: window.$nuxt.Howler.volume() };
	
				let prevValue: number;
	
				animeJS({
					targets: TARGET,
					volume: [TARGET.volume, value],
					duration: 3000,
					round: 10,
					easing: 'linear',
					begin: () => {

						GLOBAL_PROPERTY.value = true;
						vuex.commit('setGlobalProperty', GLOBAL_PROPERTY)

					},
					change: () => {
						if ( TARGET.volume !== prevValue ) {

							prevValue = TARGET.volume; 
							
							window.$nuxt.Howler.volume(TARGET.volume) 

						}
					},
					complete: () => {

						GLOBAL_PROPERTY.value = false;
						vuex.commit('setGlobalProperty', GLOBAL_PROPERTY)

					}
				})

			}

		}

	}
