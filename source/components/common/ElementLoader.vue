<template>

	<div class="Loader-Wrapper">
		<div class="Loader-Info">
			<div class="Loader-Info_Circle"></div>
			<span>{{ Message }}</span>
		</div>
	</div>

</template>

<style lang="sass">

.Loader
	&-Wrapper
		z-index: 1000
		position: absolute
		left: 0
		top: 0
		right: 0
		bottom: 0
		background-color: rgba($color1, .975)
	&-Info
		span
			position: absolute
			text-align: center
			color: $color5
			font-size: 12px
			font-weight: 700
			letter-spacing: 1.2px
			&:nth-of-type(1)
				position: absolute
				top: calc(50% + 40px)
				width: 100%
			&:nth-of-type(2)
				position: absolute
				top: calc(50% - 10px)
				font-size: 12px
				width: 100%
		&_Circle
			position: absolute
			top: calc(50% - 20px)
			left: calc(50% - 20px)
			height: 40px
			width: 40px
			transform: rotate(45deg)
			border-radius: 3px
			box-shadow: 0px 0px 0px 1px $color5
			transition-duration: 0.1s
			animation-timing-function: ease-in-out
			animation: Loader 2s infinite
			@keyframes Loader
				0%
					transform: rotate(45deg)
					box-shadow: 0px 0px 0px 1px $color6
					border-radius: 10px
				25%
					transform: rotate(90deg) scale(1.15)
					box-shadow: 0px 0px 0px 4px $color6
					border-radius: 50px
				50%
					transform: rotate(135deg)
					box-shadow: 0px 0px 0px 1px $color6
					border-radius: 10px
				75%
					transform: rotate(180deg) scale(1.15)
					box-shadow: 0px 0px 0px 4px $color6
					border-radius: 50px
				100%
					transform: rotate(225deg)
					box-shadow: 0px 0px 0px 1px $color6
					border-radius: 10px
</style>

<script>

	export default {
		props: {
			Message: {
				default: `Загрузка`
			},
		},
	}
	
</script>