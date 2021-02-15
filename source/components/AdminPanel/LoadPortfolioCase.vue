<template>
	<div class="CMS">

		<!-- <Loader 
			LoadMessage="Отправляем"
			:ElementLoad="ElementLoad"
			:ElementLoadComplete="StoreGetCaseStats.Complete">
			{{ StoreGetCaseStats.Error == null ? 'Готово' : 'Отмена' }}
		</Loader> -->

		<div class="container">
			<div class="row p-4">

				<work-case
					:ID="0"
					:content="Content"
					:properties="Config"
					:images="Images"
				/>

			</div>
			<div class="row CMS-Input justify-content-center">
				<div class="col-10">
					<div class="row mb-3">
						<div class="col-3 CMS-Input_Section">
							<span>Изображения</span>
						</div>
						<div class="col-9">
							<div class="row">
								<div class="col-12 mb-3">
									<input v-model="Images[0].content.path" type="text">
								</div>
								<div class="col-4">
									<input v-model="Images[1].content.path"  type="text">
								</div>
								<div class="col-4">
									<input v-model="Images[2].content.path"  type="text">
								</div>
								<div class="col-4">
									<input v-model="Images[3].content.path" type="text">
								</div>
							</div>
						</div>
					</div>
					<div class="row" v-for="(item, index) in Content" :key="`I-${ index }`">
						<div class="col-3 CMS-Input_Section"><span> {{ index }} </span></div>
						<div class="col">
							<input v-model="Content[index]" :placeholder="item">
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<button @click="SendCase">Отправить</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
	import { mapState, mapActions } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	// TYPES
	import type { CONTENT, WORKCASE } 			from '~/types/WorkCase.ts'
	import type { IMAGE_PROPERTY } 					from '~/types/Image.ts'
	import type { PORTFOLIO_SECTION } 			from '~/types/Portfolio.ts'

	// COMPONENTS
	import WorkCase from '~/components/common/WorkCase.vue'
	import Loader 	from '~/components/common/Loader.vue'

	export default Vue.extend({
		components: {
			WorkCase,
			Loader
		},
		data() {
			return {

				ElementLoad: false,
				ElementLoadError: false,

				Content: {
					name: '',
					time: '',
					theme: '',
					tech_request: '',
					link: '',
					cost: 0,
					description: '',
				} as CONTENT,

				Config: {
					type: 'Landings',
				} as WORKCASE['properties'],

				Images: [
					{ ID: 0, content: { path: 'Other/1' }},
					{ ID: 1, content: { path: 'Other/1' }},
					{ ID: 2, content: { path: 'Other/1' }},
					{ ID: 3, content: { path: 'Other/1' }},
				] as IMAGE_PROPERTY[]

			}
		},
		computed: {
			...mapState({
				ChilderCount: state => (state as VuexModules).AdminPanel.NewCase.ChilderCount
			}),
		},
		methods: {
			...mapActions({
				DBCaseCount: 	'AdminPanel/NewCase/DBCaseCount',
				SetCase: 			'AdminPanel/NewCase/CaseSet',
			}),
			SendCase() {

				const CASE: WORKCASE =  {
					ID: this.ChilderCount[this.Config.type],
					content: this.Content,
					properties: this.Config,
				}

				firebase.database()
					.ref(`Cases/${ this.Config.type }/CaseID_${ CASE.ID }`)
					.set(CASE)

			},
		},
		mounted() {

			const TYPES: PORTFOLIO_SECTION[] = ['Logo', 'Landings', 'Banners']

			TYPES.map(( type: PORTFOLIO_SECTION ) => {
				this.DBCaseCount(type)
			})

		},
		filters: {
			ColSizeFilter(value: number) {
				if ( value == 13 ) {
					return 'lg'
				} else {
					return value
				}
			}
		}
	})

</script>