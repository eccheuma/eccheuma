<template>
  <section class="promo-body">
    <eccheuma-swiper v-if="Ready" :options="{ auto: true, interval: 8000 }" class="works_swiper">
      <template #default>
        <template v-for="item in Works.Logo">
          
<<<<<<< HEAD
          <section v-for="image in item.content.images" :key="image.content.date" class="works_swiper-item">
=======
          <section v-for="(image, index) in item.content.images" :key="index" class="works_swiper-item">
>>>>>>> master
            
            <eccheuma-image
              style="height: 40vh"
              :content="{ path: image.content.path, description: item.content.description }"
              :sections="{ date: false, description: true, zoom: true }"
              :property="{ fit: 'cover', type: 'default', collumn: 7 }"
            >
              {{ item.content.name }}
            </eccheuma-image>

            <hr>

            <div class="works_swiper-item-description">
              <span>{{ item.content.name }}</span>
              <span>{{ item.content.theme }}</span>
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
    @extend %pattern-lines;
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 2vh 0 !important; 
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
import { Portfolio } from '~/types/Portfolio'
import { Workcase  } from '~/types/WorkCase'

export default Vue.extend({
	components: {
		EccheumaImage: () => import('~/components/image/Image.vue'),
		EccheumaSwiper: () => import('~/components/common/Carousel.vue')
	},
	mixins: [ EmitSound ],
	data() {
		return {

			Ready: false,

			CasesType: [
        Portfolio.sections.logo
      ] as Array<Portfolio.sections>,

			Works: new Object() as {[ KEY in Portfolio.sections ]: Array<Workcase.struct> },

		}
	},
  created() {
    this.GetCases();
  },
	methods: {

		GetCases() {

			this.CasesType.forEach( async section => {

        this.Works[section] = Object.values(await database.get(`Cases/${ section }`, { limit: 3 }));

        this.Ready = true;

			})

		}

	}
})
</script>
