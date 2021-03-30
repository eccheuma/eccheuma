<template>
	<div class="SearhBar-Wrap">
		<input type="text" placeholder="Поиск по сайту" v-model="SearchInput">
		<transition name="PopUpAnimation">
			<div class="SearhBar-Modal" v-if="SearchInput">
				<div class="SearhBar-Modal_Container" v-if="DataMatchResult">
					<div class="SearhBar-Modal_Header">{{ DataExample.title }}</div>
					<div class="SearhBar-Modal_Body">{{ DataExample.description }}</div>
					<div class="SearhBar-Modal_Footer">{{ DataExample.link }}</div>
				</div>
				<div class="SearhBar-Modal_Container" v-else>
					По запросу "<i>{{ SearchInput }}</i>" ничего не найдено
				</div>
			</div>
		</transition>
	</div>
</template>

<script>

  export default {
		data() {
			return {
				SearchInput: null,
				DataExample: {
					title: 'Something',
					description: 'bla-bla-bla',
					link: 'soidjfosdjfo'
				}

			}
		},
		computed: {
			DataMatchResult() {

				const S = this.SearchInput.toLowerCase()
				const D = this.DataExample

				if (S == D.title.toLowerCase() || S.length >= 3 && D.description.match(S)) {
					return S
				}

				return 'none'

			}
		}
  }
</script>

<style lang="sass" scoped>

.PopUpAnimation
	&-enter 
		transform: translateY(50px)
		opacity: 0
		&-active
			transition: all .75s ease
			opacity: 0
		&-to
			transform: translateY(0px)
			opacity: 1
	&-leave 
		transform: translateY(0px)
		opacity: 1
		&-active
			transition: all .75s ease
			opacity: 1
		&-to
			transform: translateY(50px)
			opacity: 0

.SearhBar
	&-Wrap
		display: flex
		position: relative
		input 
			margin: auto
			width: 100%
			text-align: center
			padding: 2px 15%
			font-size: var(--font-size-4)
			font-weight: 700
			line-height: 25px
			border-radius: .7rem
			border: 0px
			background-color: rgb(var(--color-5))
	&-Modal
		position: absolute
		text-align: center
		color: rgb(var(--color-6))
		font-size: 12px
		background-color: rgba(var(--color-1),.75)
		backdrop-filter: blur(3px)
		top: calc(-100% - 20px)
		height: 100%
		width: 100%
		margin-bottom: -100%
		padding: 20px 10px
		border-radius: .7rem
		@extend %gradient_border !optional

</style>