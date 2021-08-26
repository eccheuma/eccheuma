<template>
  <div class="navigation">
    <span v-if="!Modal" class="py-2 px-3" @click="changeModal">
      <i class="fas fa-ellipsis-v" />
    </span>

    <portal v-if="Modal" to="Modal">
      <div class="navigation_modal">
        <section @click="changeModal">
          <i class="fas fa-times navigation_modal-close" />
          <h6 class="text-center p-4">
            Закрыть
          </h6>
        </section>

        <div class="navigation_modal-container">
          <div
            v-for="prop in HeaderMenu"
            :key="prop.ID"
            class="navigation_modal-item my-2"
            :class="{ 'd-none': prop.disabled }"
            @click="changeModal"
          >
            <transition name="route_selector">
              <span v-if="CurentRoute == `${prop.route}`" />
            </transition>

            <nuxt-link
              :prefetch="false"
              :to="prop.route"
              class="px-4"
              :class="[
                { navigation_curentRoute: CurentRoute == `${prop.route}` }
              ]"
            >
              <i
                class="d-lg-block fas"
                :class="prop.icon"
                style="pointer-events: none"
              />

              <span class="ml-3">{{ prop.name }}</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </portal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Modal: false,

      HeaderMenu: [
        // Пункты меню
        {
          ID: 0,
          disabled: false,
          route: '/Home',
          name: 'Главная',
          icon: 'fa-scroll',
          discription:
            'Главная страница. Тут собраны статьи на завязанные на профильную тему.'
        },
        {
          ID: 1,
          disabled: false,
          route: '/Gallery',
          name: 'Галерея',
          icon: 'fa-clone',
          discription:
            'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.'
        },
        {
          ID: 2,
          disabled: true,
          route: '/Recomend',
          name: 'Рекомендации',
          icon: 'fa-fire',
          discription:
            'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.'
        },
        {
          ID: 3,
          disabled: false,
          route: '/Portfolio',
          name: 'Портфолио',
          icon: 'fa-layer-group',
          discription:
            'Принятые работы. С указанием сроков, цены, комментариев, и отзывов на выполненую работу.'
        },
        {
          ID: 4,
          disabled: false,
          route: '/Service',
          name: 'Услуги',
          icon: 'fa-ruble-sign',
          discription:
            'Услуги. Перечень оказываемых услуг, калькулятор стоимости, и форма обратной связи.'
        }
      ]
    };
  },
  computed: {
    CurentRoute() {
      // Текущий рут
      return this.$route.path;
    }
  },
  methods: {
    changeModal() {
      this.Modal = !this.Modal;
    }
  }
};
</script>

<style lang="sass" scoped>

.navigation
	span
		filter: drop-shadow(0px 0px 3px black)
		position: fixed
		top: 20px
		right: 20px
		z-index: 9999
		color: rgb(var(--color-mono-900))
		font-size: 1.75rem
		&:hover
			transition-duration: .25s
			color: rgb(var(--color-mono-900))
	&_modal
		position: fixed
		top: 0
		width: 100vw
		height: 100%
		overflow: hidden
		background-color: rgba(var(--color-mono-200), .9)
		color: rgb(var(--color-mono-800))
		z-index: 2000
		&:before
			content: ''
			position: fixed
			top: 0
			width: 100vw
			height: 100vh
			background-image: url(~assets/images/SVG/Stripes.svg)
			background-size: 20px
			mix-blend-mode: multiply
			opacity: .5
			z-index: -1
		i
			z-index: 3000
			&:hover
				transition-duration: .25s
				color: rgb(var(--color-mono-900))
				transform: scale(.9)
		&-container
			position: absolute
			top: 10vh
			height: 90vh
			padding: 10vh 0
			color: rgb(var(--color-mono-500))
		&-item
			display: block
			width: 100vw
			color: rgb(var(--color-mono-900))
			background-color: rgba(var(--color-mono-200), 1)
			border-bottom: 1px solid rgb(var(--color-mono-400))
			border-top: 1px solid rgb(var(--color-mono-400))
			a
				cursor: pointer
				display: block
				line-height: 10vh
				font-size: 1rem
				font-weight: 600
				border-radius: 12px
				margin-top: -1px
				color: rgb(var(--color-mono-500))
		&-close
			position: absolute
			display: block
			width: 100%
			text-align: center
			font-size: 2rem
			top: 5vh
			color: rgb(var(--color-mono-500))
			padding: 5vh 0
			border-bottom: 1px solid rgb(var(--color-mono-400))
</style>
