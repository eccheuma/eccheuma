// func(container: HTMLElement, path: string, cb): URL

import { references, storage } from '~/api/storage';
import { Image } from '~/types/Image';
import { Result } from '~/utils';
import { cache } from '~/utils/cache';

const FORMATS: Array<keyof typeof Image.formats.output> = ['webp', 'avif'];

export const DEFAULT_IMAGE_STRUCT: Image.formatsStruct = {
  avif: String(),
  webp: String(),
};

export async function getOptimalImage(elem: HTMLElement, path: string, ratio: number = window.devicePixelRatio): Promise<Image.formatsStruct> {

  const { width } = elem.getBoundingClientRect();

  const imageReference = await getImageURL({ 
    path,
    size: width * ratio
  });

  return imageReference instanceof Error 
    ? DEFAULT_IMAGE_STRUCT 
    : imageReference;

}

export async function getImageURL(params: { path: string, size: number }): Promise<Result<Image.formatsStruct>> {

  const matchedSize = Image.matchSize(params.size);

  const result = { ...DEFAULT_IMAGE_STRUCT };

  FORMATS.forEach(async (format) => {

    const imageReference = await storage.reference(`${ references.images }/${ params.path }/${ format }/${ matchedSize }.${ format }`);

    result[format] = imageReference instanceof Error
      ? result[format]
      : imageReference;

  });

  if ( process.browser ) {

    const cacheKey = `${ params.path }-${ matchedSize }`;

    if ( cache.check(cacheKey) ) {
      
      const cacheResult = cache.get<Image.formatsStruct>(cacheKey);

      return cacheResult instanceof Error
        ? result
        : cacheResult.data;

    }

    cache.set(cacheKey, result);

  }

  return result;

}