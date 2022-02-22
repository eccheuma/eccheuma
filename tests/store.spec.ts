import { describe, test, expect } from 'vitest';

// API
import '~/plugins/Supabase';

// VUE PREPARATIONS
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex as any);

// STORES
import * as NotificationStore from '~/store/Notification';
import * as ImageStore from '~/store/Images';

// TYPES
import { Notification } from '~/typescript/Notification';
import { Image } from '~/typescript/Image';

// TESTS
describe('store::notification', () => {

  const store = new Vuex.Store({
    state     : NotificationStore.state(),
    actions   : NotificationStore.actions,
    mutations : NotificationStore.mutations,
    strict    : true,
  })

  test('notification::set', async () => {

    const struct: Notification.struct = {
      description: 'Gedränge',
      message: 'Busen schmerz  ihr euch und, freundschaft mich euch glück gleich. Die ich wird besitze stillen die wahn ich sich. Um versuch fühlt der euren.'
    }

    await store.dispatch('createNotification', struct);

    expect(store.state.status).toBe(true);
    expect(store.state.content).toEqual(struct);

  })

})

describe('store::image', () => {

  const store = new Vuex.Store({
    state     : ImageStore.state(),
    actions   : ImageStore.actions,
    mutations : ImageStore.mutations,
    strict    : true,
  })

  test('image::getImageURL', async () => {

    const subabaseDomen = 'unfruhyobjypfbvnncoc.supabase.co';
    const imagePath     = 'Other/YumAjBcQMUM.jpg';
    const targetSize    = Image.sizes.large;
    
    const virtualSize   = Image.sizes.medium + 60;

    const actualURLS = {
      webp: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/webp/${ targetSize }.webp`,
      avif: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/avif/${ targetSize }.avif`,
    }

    const struct: Image.formatsStruct = await store.dispatch('getImageURL', { path: imagePath, size: virtualSize });

    expect(struct.avif).toBeTypeOf('string');
    expect(struct.webp).toBeTypeOf('string');

    expect(struct).toStrictEqual(actualURLS);

  })

})