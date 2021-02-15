<template>
	<div class="row py-3 justify-content-center">
		<div class="col-lg-5 col-12 service_calc_main">
			<div class="row mt-5 mb-4">
				<section class="col-12">
					<h6>Выберите тип услуги</h6>
					<span><i class="fas fa-info-circle mr-2"></i>
						Потяните для прокрутки
					</span>
				</section>
			</div>
			<div class="row mt-3">
				<section class="col-12">
					<p>Тип услуги</p>
					<select v-model="TypeOfService" class="p-2">
						<option selected value="0">Ничего не выбрано</option>
						<option value="App">Сайты и Приложения</option>
						<option value="Graphic">Графический Дизайн</option>
						<option value="Web">Вёрстка</option>
					</select>
				</section>
			</div>
			<div class="row mt-3">
				<transition name="ServiceTrans">
					<template>
						<section class="col-12" :class="{ 'NonActive' : TypeOfService == 0 }">
							<p>Услуга</p>
							<select v-model.number="SelectedService" class="p-2">
								<option selected value="0">Ничего не выбрано</option>
								<template v-if="TypeOfService != null">
									<option v-for="prop in Services[TypeOfService]" :key="prop.ID" :value="prop">{{ prop.Name }}</option>
								</template>
							</select>
							<div
								v-if="SelectedService.Description != null || undefined && SelectedService != null" 
								class="row justify-content-center my-3">
								<div class="col-10 ml-auto">
									<i style="font-size: .75rem; opacity: .75">
										" {{ SelectedService.Description }} "
									</i>
								</div>
								<hr>
							</div>
						</section>
					</template>
				</transition>
			</div>
			<transition-group name="ServiceTrans" class="row">
				<template v-if="SelectedService.ID in Addictions && TypeOfService != 0">
					<section v-for="list in AdditionsList" :key="list.ID" class="col-12 my-3">
						<div class="row no-gutters">
							<select class="col p-2" v-model.number="SelectedAddiction[list.ID]"> 
								<option selected value="0">Без дополнительных услуг</option>
								<option
									v-for="prop in Addictions[SelectedService.ID]"
									:key="prop.ID" 
									:value="prop">{{ prop.Title }}
								</option>
							</select>
							<div class="col-auto" v-if="list.ID != 0">
								<span @click="RemoveAddiction" class="service_calc_main_removeAddiction">
									<i class="fas fa-times"></i>
								</span>
							</div>
						</div>
					</section>
				</template>
			</transition-group>
			<transition name="page_transition">
				<template v-if="SelectedService.ID in Addictions && TypeOfService != 0">
					<div class="row" v-if="AdditionsList.length < Addictions[SelectedService.ID].length">
						<button @click="AddAddiction" class="mx-auto my-3 px-5 py-1">Добавить</button>
					</div>
				</template>
			</transition>
			<div class="row mt-3">
				<transition name="ServiceTrans">
					<template v-if="SelectedService">
						<section class="service_calc_main_footer col-12">
							<!-- Изменения количества -->
							<section class="service_calc_main_range">
								<label for="formControlRange" class="w-100">
									<strong>Количество:</strong> {{ Quantity }}
								</label>
								<div class="d-flex">
									<input class="p-1 w-75 mx-auto" v-model.number="Quantity" type="range" id="formControlRange" min="1" max="10" step="1" value="1">
								</div>
							</section>
						</section>
					</template>
				</transition>
			</div>
		</div>
		<div class="col-lg col-12 ml-lg-3 ml-0 my-lg-0 my-4 p-3 service_calc_aside">
			<section class="mt-3 px-3">
				<h5 class="mb-3">Итог:</h5>
				<hr>
			</section>
			<section class="p-3">
				<h6 class="mb-4 text-lg-left text-center">Количество и цены: </h6>
				<p class="pl-lg-4 mb-1"><strong class="mr-2">Количество: </strong> {{ Quantity }} шт.</p>
				<p class="pl-lg-4 mb-1"><strong class="mr-2">Цена за услугу: </strong>{{ SelectedService.Cost ? SelectedService.Cost * this.Quantity : 0 }} ₽</p>
				<p class="pl-lg-4 mb-1"><strong class="mr-2">Цена дополнительных опций: </strong> {{ AddictionPrice ? AddictionPrice : 0  }} ₽</p>
				<!-- <hr> -->
			</section>
			<section class="p-3">
				<h6 class="mb-4 text-lg-left text-center">Ориентировочное время</h6>
				<p class="pl-lg-3 pl-0 pt-2">{{ Price | SpendTimeFilter | TimeFilter }} {{ Price | SpendTimeFilter | DataFilter }} </p>
				<hr>
				<span class="pl-lg-3 pl-0"><i class="fas fa-info-circle mr-2"></i>
					Без учёта правок и особых случаев 
				</span>
			</section>
			<section class="p-3" v-if="!LoginStatus">
				<h6 class="mb-4 text-lg-left text-center">Итоговая цена c учётом комиссии фриланс биржи</h6>
				<p class="pl-lg-3 text-lg-left text-center">{{ Price | TaxFilter }} ₽</p>
				<hr>
				<span class="pl-lg-3 pl-0 w-75"><i class="fas fa-info-circle mr-2"></i>
					В зависимости от площадки, её допонительная комиссия как посредника может составлять от  <strong class="px-2 mx-2">20 %</strong>и выше. Через регистрацию на сайте она составит: <strong class="px-2 mx-2">{{ Price }} ₽</strong>
				</span>
			</section>
			<section class="p-3" v-if="LoginStatus">
				<h6 class="text-lg-left text-center"> Итоговая цена: </h6>
				<p class="pl-lg-3 pt-4 text-lg-left text-center">{{ Price }} ₽</p>
			</section>
		</div>
	</div>
</template>

<script>

  import firebase from "firebase/app"
  import "firebase/database"

  export default {
    data() {
      return {

        Price: 0,

        TypeOfService: 0,

        // Выбор услуг
        Quantity: 1,

        SelectedService: 0,
        SelectedAddiction: [],

        AdditionsList: [{
          ID: 0,
          Desc: 'Основной пакет'
        }],

        TypeOfWorks: [`App`, `Graphic`, `Web`],
        Services: {},
        Addictions: {},

      }
    },
    watch: {
      SelectedService: {
        handler() {

          let prop = {
            type: `SelectedService`,
            entity: this.SelectedService
          }

          this.$store.dispatch('Set_ServiceEntity', prop)

        },
        deep: true
      },
      ComputedPrice: {
        handler() {
          this.AnimatePrace()
        },
      },
      Quantity: {
        handler() {
          this.$store.dispatch('Change_Quantity', this.Quantity)
        }
      },
    },
    computed: {
      AddictionPrice() {

        let AddictionPrice = 0

        if (this.SelectedAddiction[0] != 0 || undefined) {
          for (let i = 0; i < this.SelectedAddiction.length; i++) {
            if (this.SelectedAddiction[i].Single == false) {
              AddictionPrice += this.SelectedAddiction[i].Cost * this.Quantity
            } else {
              AddictionPrice += this.SelectedAddiction[i].Cost
            }
          }
        }

        return AddictionPrice
      },
      ComputedPrice() {

        if (this.SelectedService.Cost) {

          const SC = this.SelectedService.Cost
          const Q = this.Quantity
          const AP = this.AddictionPrice

          return ((SC * Q) + AP)

        } else {
          return 0
        }

      },
      LoginStatus() {
        return this.$store.state.Auth.Auth.LoginStatus
      },
    },
    methods: {
      AnimatePrace() {

        this.$AnimeJS({
          targets: this.$data,
          Price: this.ComputedPrice,
          round: 1,
          duration: 1000,
          easing: 'easeInOutCubic'
        });
      },
      AddAddiction() {

        this.AdditionsList.push({
          ID: this.AdditionsList.length,
          Desc: 'Дополнительный пакет'
        })
      },
      RemoveAddiction() {
        this.AdditionsList.pop()
        this.SelectedAddiction.pop()
      },
      GetTypes() {

        for (let i = 0; i < this.TypeOfWorks.length; i++) {

          firebase
            .database()
            .ref(`Service/Prices/${this.TypeOfWorks[i]}`)
            .on('value', data => {

              this.Services[this.TypeOfWorks[i]] = data.val()

            });

        }
      },
      GetAddiction() {

        firebase
          .database()
          .ref(`Service/Addictions`)
          .on('value', data => {

            this.Addictions = data.val()

          });

      },
    },
    created() {

      this.GetTypes()

      this.GetAddiction()

    },
    destroyed() {
      this.SelectType = {}
    },
    filters: {
      TaxFilter(value) {
        return value = value + ((value / 100) * 20)
      },
      SpendTimeFilter(value) {

        let TimeToWorkEquality = 150

        return value = value / TimeToWorkEquality

      },
      TimeFilter(value) {
        if (value > 12) {
          value = value / 12
        }
        return value.toFixed(0)
      },
      DataFilter(value) {
        if (value > 12 && value < 18) {
          return value = "День"
        } else if (value >= 18 && value <= 54) {
          return value = 'Дня'
        } else if (value > 54) {
          return value = 'Дней'
        } else if (value == 1) {
          return value = 'Час'
        } else if (value > 1 && value <= 4) {
          return value = 'Часa'
        } else {
          return value = "Часов"
        }
      }
    },
  }

</script>

<style lang="sass">

// =====================
// Переход между рутами.
// =====================

.ServiceTrans-enter 
	filter: opacity(1)
	transform: translateY(-4vw) 

.ServiceTrans-enter-active 
	transition: all .5s ease
	filter: opacity(0)

.ServiceTrans-enter-to 
	filter: opacity(1)

.ServiceTrans-leave 
	filter: opacity(0)
	transform: translateY(-8vw) 
	margin-bottom: -60px 

.ServiceTrans-leave-active 
	transition: all .5s ease
	filter: opacity(1)

.ServiceTrans-leave-to 
	filter: opacity(0)
	transform: translateY(-4vw)

// ========================
  
.service_calc // Калькулятор  
	&_container // Основной контейнер
		// background-color: $color2
		@extend %gradient_border
	&_main // Зона формы
		position: relative
		min-height: 200px
		max-height: 75vh
		overflow-y: scroll
		@extend %gradient_border
		&_removeAddiction
			cursor: pointer
			border-radius: .8rem
			color: $color5
			background-color: $color2
			line-height: 25px
			transition-duration: .25s
			&:hover
				color: $color1
				background-color: $color5
		button
			cursor: pointer
			border-radius: .8rem
			color: $color1
			background-color: $color5
			border: 1px solid $color3
			box-shadow: 0px 0px 0px 2px $color5
			font-size: 12px
			font-weight: 700
			transition-duration: .25s
			&:hover 
				text-decoration: none
				color: $color5
				background-color: $color2
				border: 1px solid $color3
				box-shadow: 0px 0px 0px 2px $color5
		h6
			text-align: center
		span
			display: block
			text-align: center
			color: $color4
			font-size: .7rem
		p  
			font-weight: 700
			font-size: 12px
			color: $color6
		select
			display: inline-block
			outline: none
			width: 90%
			border-radius: .7rem
			background-color: $color1
			border: 1px solid $color3
			color: rgba($color5, .75)
			font-weight: 700
			font-size: $FontSize4
		option
			// background-color: $color2
			border: 0px solid $color5
			font-size: $FontSize2
			color: rgba($color5, .75)
			font-weight: 700
		&_wrap
			border-radius: .7rem
			background-color: $color1
			min-height: 450px
		&_header
			background-color: $color1
			border-radius: .7rem
			box-shadow: 0px 3px 0px 0px rgba(#000,.15)
			text-align: center
			h5
				font-size: 18px
			p  
				font-weight: 700
				font-size: 12px
				color: $color4
		&_footer
			position: relative
			width: 100%
			height: 100%
			label
				display: block
				text-align: center
				font-size: 14px
			strong
				color: $color5
				font-size: 14px
				font-weight: 700
			input
				-webkit-appearance: none
				overflow: hidden
				background-color: $color2
				border: 1px solid $color3
				border-radius: .7rem
				width: 100%
				&:focus
					outline: none
				&::-webkit-slider-thumb
					-webkit-appearance: none
					height: 100%
					width: 6px
					border-radius: .7rem
					background-color: $color4
					cursor: pointer
					transition-duration: .5s
					&:hover
						transform: scale(1.5)
						background-color: $color5
				&::-webkit-slider-runnable-track
					width: 100%
					height: 20px
					cursor: pointer
					transition-duration: .5s
	&_aside // Зона итогов
		position: relative
		background-color: $color2
		border-radius: .7rem
		overflow: hidden
		&:before
			content: ''
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			background-image: url(/static/images/Assets/Stripe.webp)
			mix-blend-mode: lighter
			opacity: .1
			z-index: 1
		section
			position: relative
			z-index: 2
			&:last-of-type
				p
					color: $color5
					font-weight: 700
					font-size: $FontSize1
		h5
			font-size: 1.25rem
			font-weight: 700
		h6
			font-size: .9rem
			font-weight: 700
		strong
			font-size: 12px
			font-weight: 700
		p
			font-size: 14px
		span
			display: block
			color: rgba($color6,.75)
			font-size: $FontSize4
			font-weight: 400
			strong
				background-color: rgba($colorSuccess,1)
				border-radius: .7rem
				color: $color1
				font-size: $FontSize2
				font-weight: 700

</style>