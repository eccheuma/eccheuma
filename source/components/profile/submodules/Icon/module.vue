<template>
	<div class="user_profile-component-picture">

		<div class="user_profile-component-picture-user">
			<i ref="iconPreview" :style="`background-image: url(${ NewIcon || State.image })`" />
			<input 
				v-show="false" 
				id="CustomImage" 
				ref="CustomIcon" 
				type="file" 
				accept=".png, .jpg, .webp" 
				@change="(e) => upload"
				>
			<common-button type="label" for="CustomImage">
				Загрузить своё
			</common-button>
		</div>

		<hr v-once>

		<caption-card v-if="loadError" class="user_profile-component-picture-warning">
			<template #type>
				Упс. Что-то пошло не так!
			</template>
			<template #desc>
				{{ Warning }}
			</template>
		</caption-card>	

		<div v-else class="user_profile-component-picture-predefined">
			<h6>Выбрать из стандартных</h6>
			<section class="user_profile-component-picture-predefined-icons">
				<template v-for="(url, i) in SelectableIcon">
					<i :key="i" :style="`background-image: url(${ url })`" @click="NewIcon = url" />
				</template>
			</section>
		</div>

		<hr v-once>

		<div class="user_profile-component-picture-footer">
			<common-button :class="{ disabled: !NewIcon || NewIcon === State.image }" @click.native="update">
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

	import Vue from "vue";

	// VUEX
	import { mapState } from "vuex";
	import type { VuexMap } from "~/contracts/VuexMap";

	// COMPONENT
	import CommonButton from "~/components/buttons/CommonButton.vue";
	import CaptionCard 	from "~/components/common/Caption.vue";

	// ANIMATIONS
	import { iconAnimation, IconStatus } from "~/animations/profile.animations";

	// MODEL
	import { Model as CustomizeModel, ViewContext } from "./icon.model";

	let model: CustomizeModel;

	export default Vue.extend({
		components: {
			CommonButton,
			CaptionCard,
		},
		data() {

			return {

				Warning	: String(),
				Loading	: IconStatus.done,
				NewIcon	: String(),

				SelectableIcon: Array<string>(),

			};
		
},
		created() {

			model = new CustomizeModel(this.$data as ViewContext);
		
},
		computed: {

			...mapState({
				State	: state => (state as VuexMap).User.State.State,
				Lang	: state => (state as VuexMap).App.Lang,
			}),

			loadError(): boolean {

				return this.Loading === IconStatus.error;
			
}

		},
		watch: {
			Loading: {
				handler(value: IconStatus) {

					const { keyframes, options } = iconAnimation(value);
					const { getAnimations, animate } = (this.$refs.iconPreview as HTMLElement);

					getAnimations().forEach(animation => animation.cancel());
					animate(keyframes, options);

				}
			}
		},
		async mounted() {

			this.SelectableIcon = await model.getDefaultIcons();
		
},
		methods: {
			upload(event: Event): void {

				model.uploadIcon(event);
			
},
			update(): void {

				model.updateIcon(this.State.uid, this.NewIcon);
			
}
		}
	});

</script>
