import { expect, test } from 'vitest';
import { languages, russian } from '~/lang'

// UTILS
import { user } from '~/utils/status'
import { validate } from '~/utils/validate';
import { Opengraph } from '~/utils/opengraph';

import { User } from '~/typescript/User'

// TESTS
test('utils::status::define', () => {

  expect(user.defineStatus(User.status.Admin, languages.Russian))
    .toBe(russian.userStatus.Admin);
  expect(user.defineStatus(User.status.Moderator, languages.Russian))
    .toBe(russian.userStatus.Moderator);
  expect(user.defineStatus(User.status.Support, languages.Russian))
    .toBe(russian.userStatus.Support);
  expect(user.defineStatus(User.status.User, languages.Russian))
    .toBe(russian.userStatus.User);

})

test('utils::validate::email', () => {

  expect(validate.email('someone@gmail.com')).toBe(true)
  expect(validate.email('госпочта@почта.рф')).toBe(true)

  expect(validate.email('someone@.com'))
    .toBe(false)
  expect(validate.email('someone@gmail'))
    .toBe(false)
  expect(validate.email('@gmail.com'))
    .toBe(false)

})

test('utils::validate::sentence', () => {

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
