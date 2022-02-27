import { expect, test, describe } from 'vitest';
import { languages, russian } from '~/lang'

// UTILS
import { user, work } from '~/utils/status'
import { validate } from '~/utils/validate';
import { Opengraph } from '~/utils/opengraph';

import { User } from '~/typescript/User';
import { Purchase } from '~/typescript/Services'

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

  })

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

  })

})

describe('utils::validate', () => {

  test('validate::email', () => {

    expect(validate.email('someone@gmail.com')).toBe(true)
    expect(validate.email('госпочта@почта.рф')).toBe(true)
  
    expect(validate.email('someone@.com'))
      .toBe(false)
    expect(validate.email('someone@gmail'))
      .toBe(false)
    expect(validate.email('@gmail.com'))
      .toBe(false)
  
  })
  
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
      expect(validate.sentence(sentence, banWords)).toBe(true)
    })
  
    invalidSentences.forEach(sentence => {
      expect(validate.sentence(sentence, banWords)).toBe(false)
    })
  
  })

})

test('utils::opengraph::new', () => {

  const META = new Opengraph.meta({ title: 'something', description: 'something', image: 'something', url: 'something' })

  const target = [
    { property: `og:description`, content: 'something' },
    { property: `og:image`,       content: 'something' },
    { property: `og:title`,       content: 'something' },
    { property: `og:url`,         content: 'something' },
  ]

  expect(META.buildMeta()).toEqual(target)

})
