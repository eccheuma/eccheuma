<template>
	<div class="admin_case-container" @keypress.ctrl.enter="sendCase">

		<work-case :content="Content" :properties="Config" />

		<div class="admin_case-config">
			<section class="admin_case-config-item">
				<select v-model="Config.type">
					<template v-for="item in CaseTypes">
						<option :key="item" :value="item">
							{{ item }}
						</option>
					</template>
				</select>
			</section>
			<section class="admin_case-config-item">
				<template v-for="item in Content.images">
					<input 
						:key="item.ID" 
						v-model="item.content.path" 
						type="text"
					>
				</template>
				<button @click="addImage"></button>
			</section>
		</div>

		<button @click="sendCase">JNGHFDSFS</button>

	</div>
</template>

<style lang="scss">

.admin_case {
	&-config {
		&-item {
			select {
				padding: 2vh 3vw;
				background-color: rgb(var(--color-mono-200));
				color: rgb(var(--color-mono-900))
			}
		}
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
	import { mapState, mapActions } from 'vuex'

	import type { VuexModules } from '~/typescript/VuexModules'

	// TYPES
	import type { CONTENT, WORKCASE } 			from '~/typescript/WorkCase.ts'
	import type { IMAGE_PROPERTY } 					from '~/typescript/Image.ts'
	import type { PORTFOLIO_SECTION } 			from '~/typescript/Portfolio.ts'

	// COMPONENTS
	import WorkCase from '~/components/common/WorkCase.vue'
	import Loader 	from '~/components/common/Loader.vue'

	// CLASSES
	class Image {

		private ID: number = 0;
		private content: IMAGE_PROPERTY['content'] = {
			path: 'Other/1'
		}

		constructor(_path: string) {
			this.content.path ??= _path
		}

		getImage(): IMAGE_PROPERTY {
			return { ID: this.ID, content: this.content }
		}

	}

	export default Vue.extend({
		components: {
			WorkCase,
		},
		data() {
			return {

				ElementLoad: false,
				ElementLoadError: false,

				CaseTypes: ['Logo', 'Landings', 'Banners'] as PORTFOLIO_SECTION[],

				Content: {
					name: 'Placeholder',
					time: '6 часов',
					theme: 'Placeholder',
					tech_request: 'Placeholder',
					link: '',
					cost: 0,
					description: 'Placeholder',
					images: [
						{ ID: 0, content: { path: 'Other/1' } },
					] as IMAGE_PROPERTY[]
				} as CONTENT,

				Config: {
					type: 'Landings',
				} as WORKCASE['properties'],

			}
		},
		computed: {
			...mapState({
				ChilderCount: state => (state as VuexModules).AdminPanel.NewCase.ChilderCount
			}),
		},
		mounted() {

			const TYPES: PORTFOLIO_SECTION[] = ['Logo', 'Landings', 'Banners']

			TYPES.forEach(( type: PORTFOLIO_SECTION ) => {
				this.DBCaseCount(type)
			})

		},
		methods: {
			...mapActions({
				DBCaseCount: 	'AdminPanel/NewCase/DBCaseCount',
				SetCase: 			'AdminPanel/NewCase/CaseSet',
			}),

			addImage() {

				const I = this.Content.images;

				if ( I.length < 4 ) { 
					I.push( new Image('Other/1').getImage() ) 
				}

			},

			sendCase() {

				const CASE: WORKCASE =  {
					ID: this.ChilderCount[this.Config.type],
					content: this.Content,
					properties: this.Config,
					rating: 5.0,
				}

				firebase.database()
					.ref(`Cases/${ this.Config.type }/CaseID_${ CASE.ID }`)
					.set(CASE)

			},
		},
	})

</script>
