<template>
  <section class="promo-body" @mouseenter="SwipeSwitch">
    <eccheuma-swiper v-if="Ready" :options="{ auto: true, interval: 8000 }" class="works_swiper">
      <template #default>
        <template v-for="section in Works.Landings">
          <section
            v-for="(item, index) in section.content.images"
            :key="`section-of-${section.ID}_${index}`"
            class="works_swiper-item"
          >
            
            <eccheuma-image
              style="height: 40vh"
              :content="{ path: item.content.path }"
              :sections="{ date: false, description: false, zoom: true }"
              :property="{ fit: 'cover', type: 'default', collumn: 7 }"
            >
              {{ section.content.name }}
            </eccheuma-image>

            <hr v-once>

            <div v-once class="works_swiper-item-description">
              <span>{{ section.content.name }}</span>
              <span>{{ section.content.theme }}</span>
            </div>
            
          </section>
        </template>
      </template>
    </eccheuma-swiper>
  </section>
</template>

<style lang="scss" scoped>

.works_swiper {
  width: 720px;
  margin: auto;
  &-item {

    padding: 0 5vw;
    display: inline-grid;

    hr {
      background-color: rgb(var(--color-mono-400));
      width: 75%;
    }

    &-description {

      justify-self: center;
      text-align: center;

      span {
        display: block;
        &:nth-child(1) {
          color: rgb(var(--color-mono-900));
          font-size: var(--font-size-24);
          font-weight: 800;
        }
        &:nth-child(2) {
          color: rgb(var(--color-mono-500));
          font-size: var(--font-size-20);
          font-weight: 500;
        }
      }
    }

  }
}

.promo {
  &-body {
    @include gradient_border(block);
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 0 !important; 
    background-color: rgb(var(--color-mono-300));
  }
}
</style>

<script lang="ts">

import Vue from 'vue'

// API
import { database } from '~/api/database'

// MIXINS
import EmitSound from '~/assets/mixins/EmitSound'

// Namespaces
import { Portfolio } from '~/typescript/Portfolio'
import { Workcase  } from '~/typescript/WorkCase'

export default Vue.extend({
	components: {
		EccheumaImage: () => import('~/components/image/Image.vue'),
		EccheumaSwiper: () => import('~/components/common/Carousel.vue')
	},
	mixins: [ EmitSound ],
	data() {
		return {

			Ready: false,

			SwipeNotification: true,

			// CASE DATA
			CasesType: [
        Portfolio.sections.landings
      ] as Array<Portfolio.sections>,

			Works: new Object() as {[ KEY in Portfolio.sections ]: Array<Workcase.struct> },

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

			this.CasesType.forEach( async section => {
        this.Works[section] = Object.values(await database.get(`Cases/${ section }`, { limit: 3 }))
			})

      this.Ready = true;

		}
	}
})
</script>
