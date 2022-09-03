import { expect, test, describe } from 'vitest';
import { getLocale, languages, russian } from '~/lang';

// UTILS
import { utils }      from '~/utils';
import { user, work } from '~/utils/status';
import { validate }   from '~/utils/validate';
import { Opengraph }  from '~/utils/opengraph';

import { navigation } from '~/types/Navigation';
import { Purchase }   from '~/types/Services';
import { User }       from '~/types/User';
import { Meta }       from '~/utils/meta';

// TESTS
describe('utils::status', () => {

  test('status::user', () => {

    expect(user.defineStatus(User.status.Admin, languages.Russian))
      .toBe(russian.userStatus.Admin);
  
    expect(user.defineStatus(User.status.Moderator, languages.Russian))
      .toBe(russian.userStatus.Moderator);
  
    expect(user.defineStatus(User.status.Support, languages.Russian))
      .toBe(russian.userStatus.Support);
  
    expect(user.defineStatus(User.status.User, languages.Russian))
      .toBe(russian.userStatus.User);

  });

  test('status::work', () => {

    expect(work.defineStatus(Purchase.status.Denied, languages.Russian))
      .toBe(russian.PurchaseStatus.Denied);

    expect(work.defineStatus(Purchase.status.Done, languages.Russian))
      .toBe(russian.PurchaseStatus.Done);

    expect(work.defineStatus(Purchase.status.None, languages.Russian))
      .toBe(russian.PurchaseStatus.None);

    expect(work.defineStatus(Purchase.status.Process, languages.Russian))
      .toBe(russian.PurchaseStatus.Process);

    expect(work.defineStatus(Purchase.status.Queue, languages.Russian))
      .toBe(russian.PurchaseStatus.Queue);
    
    expect(work.defineStatus(Purchase.status.Ready, languages.Russian))
      .toBe(russian.PurchaseStatus.Ready);

    expect(work.defineStatus(Purchase.status.Review, languages.Russian))
      .toBe(russian.PurchaseStatus.Review);

  });

});

describe('utils::validate', () => {

  test('validate::email', () => {

    expect(validate.email('someone@gmail.com')).toBe(true);
    expect(validate.email('госпочта@почта.рф')).toBe(true);
  
    expect(validate.email('someone@.com'))
      .toBe(false);
    expect(validate.email('someone@gmail'))
      .toBe(false);
    expect(validate.email('@gmail.com'))
      .toBe(false);
  
  });
  
  test('validate::sentence', () => {
  
    const banWords = ['Яблок', 'Яблоч', 'Apples'];
  
    const validSentences   = [
      'Тут могла быть речь о некоторых плодах',
      'Ябло. Блоки. Я Блок. Яблоня',
    ];
    const invalidSentences = [
      'А тут речь про жуткие яблоки',
      'Яблочный пирог, для яблочника'
    ];
  
    validSentences.forEach(sentence => {
      expect(validate.sentence(sentence, banWords)).toBe(true);
    });
  
    invalidSentences.forEach(sentence => {
      expect(validate.sentence(sentence, banWords)).toBe(false);
    });
  
  });

});

describe('utils::meta', () => {
  test('meta::opengraph', () => {
  
    const meta: Opengraph.struct = { title: 'something', description: 'something', image: 'something', url: 'something' };
  
    const result = new Opengraph.Meta(meta, { locale: languages.Russian }).buildMeta();
  
    const target = [
  
      { property: Opengraph.Meta.setPreffix('description'), 
        content : meta.description },
  
      { property: Opengraph.Meta.setPreffix('website'),     
        content : Opengraph.Meta.predefined.website },
  
      { property: Opengraph.Meta.setPreffix('locale'),      
        content : languages.Russian },
  
      { property: Opengraph.Meta.setPreffix('image'),       
        content : meta.image },
  
      { property: Opengraph.Meta.setPreffix('title'),       
        content : meta.title },
  
      { property: Opengraph.Meta.setPreffix('url'),         
        content : meta.url },
  
    ];
  
    // ! Это будет работать только при одинарной вложенности. Вложенные объекты сравнить не получиться.
    target.forEach(targetMeta => {
  
      result.forEach(resultMeta => {
        if ( targetMeta.property === resultMeta.property ) {
          expect(targetMeta.content).toBe(resultMeta.content); 
        }
      });
  
    });
  
  });

  describe('meta::head', () => {

    test('head::constructTitle', () => {

      const page: number = 1;
      const section = navigation.routeSections.service;

      const pageType = getLocale(languages.Russian).Pagination.page;
      const pageName = getLocale(languages.Russian).Routes[ section ];

      const result = Meta.conctructTitle(languages.Russian, { page, section });
      const target = `Eccheuma | ${ pageName } | ${ page } ${ pageType }`;

      expect(result).toBe(target);

    });

  });

});

describe('utils::hash', () => {

  test('hash::generate', () => {

    const LENGTH = 24;

    const Hash = utils.randHashGenerator(LENGTH);

    expect(Hash.length).toBe(LENGTH);

  });

});