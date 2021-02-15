<template>
  <section class="promo_body" @mouseenter="SwipeSwitch">
    <!-- <transition name="page_transition">
			<template v-if="SwipeNotification">
				<div class="promo_swipe">
					<i class="fas fa-angle-left"></i>
					<i class="fas fa-mitten"></i>
					<i class="fas fa-angle-right"></i>
				</div>	
			</template>
		</transition> -->

    <!-- :options="{ auto: true, interval: 5000 }" -->

    <eccheuma-swiper v-if="Ready" :options="{ auto: true, interval: 8000 }">
      <template #default>
        <template v-for="section in Works.Landings">
          <section
            v-for="(item, index) in section.content.images"
            :key="`section-of-${section.ID}_${index}`"
            class="eccheuma_swiper-item"
          >
            <vue-image
              :content="{ path: item.content.path }"
              :sections="{ date: false, description: false, zoom: true }"
              :property="{ fit: 'cover', type: 'promo', collumn: 7 }"
            >
              {{ section.content.name }}
            </vue-image>

            <div class="eccheuma_swiper-item-description">
              <span>{{ section.content.name }}</span>
              <span>{{ section.content.description }}</span>
            </div>
          </section>
        </template>
      </template>
    </eccheuma-swiper>
  </section>
</template>

<style lang="scss" scoped>
.eccheuma_swiper {
  width: 100vw;
  height: 100%;
  position: relative;
  background-color: $color1;
  color: $color5;
  &-item {
    padding: 0 5vw;

    &-description {
      $w: 75%;

      display: block;
      width: $w;
      margin: {
        top: 5vh;
        left: #{(100% - $w) / 2};
        right: #{(100% - $w) / 2};
      }
      text-align: center;
      border: {
        top: 1px solid $color3;
      }
      span {
        display: block;
        &:nth-child(1) {
          color: $color6;
          font-size: $FontSize1;
          font-weight: 700;
        }
        &:nth-child(2) {
          color: $color4;
          font-size: $FontSize2;
          font-weight: 500;
        }
      }
    }
  }
}

.promo {
  &_swipe {
    pointer-events: none;
    position: absolute;
    width: 100%;
    top: -10px;
    text-align: center;
    z-index: 10;
    i {
      letter-spacing: 20px;
      color: $color5;
      &:nth-child(2) {
        transform: translateX(0px);
        animation: swipe 0.5s infinite alternate;
        @keyframes swipe {
          0% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(10px);
          }
        }
      }
    }
  }
  &_body {
    @include gradient_border(both);
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: $color2;
  }
  &_carousel {
    position: relative;
    cursor: pointer;
    min-width: 60vw;
    width: 100%;
  }
}
</style>

<script lang="ts">

import Vue from 'vue'

// FIREBASE
import firebase from 'firebase/app'
import 'firebase/database'

// MIXINS
import EmitSound from '~/assets/mixins/EmitSound'

// TYPES
import type { PORTFOLIO_SECTION } from '~/types/Portfolio.ts'
import type { WORKCASE } 					from '~/types/WorkCase.ts'

export default Vue.extend({
	components: {
		VueImage: () => import('~/components/common/ImageComponent/Image.vue'),
		EccheumaSwiper: () => import('~/components/common/SwiperProto.vue')
	},
	mixins: [ EmitSound ],
	data() {
		return {

			Ready: false,

			SwipeNotification: true,

			// CASE DATA
			CasesType: ['Landings'] as Array<Partial<PORTFOLIO_SECTION>>,

			Works: new Object() as {[i in PORTFOLIO_SECTION]: WORKCASE[]},

		}
	},
	mounted() {

		this.GetCases()

	},
	methods: {
		SwipeSwitch() {
			if ( this.SwipeNotification ) {
				setTimeout(() => { this.SwipeNotification = false }, 3000);
			}
		},
		GetCases() {

			this.CasesType.forEach((item) => {

				firebase.database()
					.ref(`Cases/${ item }`)
					.limitToFirst(3)
					.on('value', (data) => {

						const D = Object.values(data.val()) as WORKCASE[]

						this.Works[item] = D; this.Ready = true

					});

			})

		}
	}
})
</script>
