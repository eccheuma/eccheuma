import { describe, expect, test } from 'vitest';

// UTILS
import { gpu } from '~/utils/gpu';
import { utils } from '~/utils/index';

// MODULES
import { Image } from '~/types/Image';

// Helpers
import { getImageURL } from '~/components/image/image.helpers';

describe('images::helpers', () => {

  test('helpers::matchSize', () => {

    // LARGER
    expect(Image.matchSize(Image.sizes.medium + 1))
      .toBe(Image.sizes.large);
  
    // EQUAL
    expect(Image.matchSize(Image.sizes.medium))
      .toBe(Image.sizes.medium);
  
    // SMALLER
    expect(Image.matchSize(Image.sizes.medium - 1))
      .toBe(Image.sizes.medium);
  
  });

  test('helpers::getExtension', () =>{

    const extensions: Array<keyof typeof Image.formats.input> = [
      'jpeg', 'jpg', 'png'
    ];

    const validName: string = 'something.jpg';
    
    const invalids: Array<[string, utils.extension.error]> = [
      // EXTENSION
      ['something.cvs', 
        utils.extension.error.extension],
      ['something.tiff', 
        utils.extension.error.extension],
      ['something.zip', 
        utils.extension.error.extension],
      // NAME
      ['something', 
        utils.extension.error.name],
      ['.jpg', 
        utils.extension.error.name],
      ['jpg.', 
        utils.extension.error.name],
      // DOT
      ['.jpg.', 
        utils.extension.error.dot],
      ['something.spec.jpg', 
        utils.extension.error.dot],
      ['.spec.jpg', 
        utils.extension.error.dot],
    ];

    expect(utils.extension.define(validName, extensions)).toBe('jpg');

    invalids.forEach(([ filename, error ]) => {

      const response = utils.extension.define(filename, extensions);

      typeof response !== 'string'
        ? expect(response.message).toBe(error)
        : expect.fail();

    });
    
  });

  test('helpers::getImageURL', async () => {

    const subabaseDomen = 'unfruhyobjypfbvnncoc.supabase.co';
    const imagePath = 'Other/YumAjBcQMUM.jpg';
    const targetSize = Image.sizes.large;
    
    const virtualSize = Image.sizes.medium + 60;

    const actualURLS: Pick<Image.formatsStruct, 'avif' | 'webp'> = {
      webp: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/webp/${ targetSize }.webp`,
      avif: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/avif/${ targetSize }.avif`,
    };

    const structResult = await getImageURL({ path: imagePath, size: virtualSize });

    if ( structResult instanceof Error ) return expect.fail(structResult.message);

    expect(structResult).toStrictEqual(actualURLS);

  });

});
describe('gpu::checks', () => {

  // @vitest-environment jsdom
  test('checks::available', () => {
    expect(gpu.available()).toBe(false);
  });

});




