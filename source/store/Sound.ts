// LIBS
	import { Howler, Howl } from 'howler'
	import $AnimeJS from 'animeJS'

// VUEX
	import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES
	export interface PROPERTY {
		status?: boolean,
		volume: number,
		loop: boolean,
		rate: number,
	}

	export interface SOUND {
		path: string,
		src: string[],
		prop: PROPERTY
	}

// STORE
	export const state = () => ({

		Global: {
			inChange: false,
			Mute: true,
			Volume: 0,
			TransitiondDurarion: 750
		},

		SoundSource: new Map()

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Sound: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_SoundSource(state, payload) {
			state.SoundSource.set(payload.path, new Howl({ src: payload.src, ...payload.prop }))
		},
		Change_SoundGlobalVolume(state, prop) {
			state.Global.Volume = prop
		},
		Change_GlobalMute(state, prop) {
			state.Global.Mute = prop ?? !state.Global.Mute
		},
		setChangeStatus(state, status: boolean) {
			state.Global.inChange = status
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		ActivateSound({ commit, state }, { _path, _prop }: { _path: string, _prop: PROPERTY}) {

			import(`~/assets/sounds/${_path}.ogg`)
			
			const PAYLOAD: SOUND = {
				path: _path,
				src: [`/static/sounds/${_path}.ogg`],
				prop: {
					volume: _prop.volume,
					loop: 	_prop.loop,
					rate: 	_prop.rate
				}
			}

			commit('Change_SoundSource', PAYLOAD); 
			
			const SOUND: Howl = state.SoundSource.get(_path)
			
			// Проверка тригерра воспроизведения.
			_prop.status ? SOUND.play() : SOUND.stop()

		},
		ChangeSoundVolume({ state }, prop) {

			const SOUND: Howl = state.SoundSource.get(prop.path);

			const V = { volume: SOUND.volume() }; 

			$AnimeJS({
				targets: V,
				volume: [V.volume, prop.volume],
				easing: 'easeInOutCubic',
				duration: 1500,
				round: 100,
				update: () => { 
					SOUND.volume(V.volume)
				}
			});

		},
		Set_GlobalSoundProperty({ state, commit }, { _volume, _duration }: { _volume: number, _duration: number }) {

			if ( !state.Global.inChange ) {

				commit('setChangeStatus', true)

				const PROPERTY = { volume: state.Global.Volume, }

				$AnimeJS({
					targets: PROPERTY,
					volume: [ PROPERTY.volume, _volume ],
					easing: 'easeInOutCubic',
					duration: _duration,
					round: 100,
					begin: () => {
						commit('Change_GlobalMute', _volume === 0 )
					},
					update: () => { 
						Howler.volume(PROPERTY.volume) 
					},
					complete: () => {
						commit('Change_SoundGlobalVolume', PROPERTY.volume); 
						commit('setChangeStatus', false)
					}
				});

			}

		}
	}
