import { describe, test, expect, afterEach } from 'vitest';

import { currencies, wallet } from '~/utils/currency';


describe("wallet::operations", () => {

  const WALLET_TARGET = currencies.Country.ru;

  const CURRENCIES = [ 
    currencies.Country.ru, 
    currencies.Country.en, 
    currencies.Country.ch 
  ]

  const RUB = currencies.Fabric(currencies.Country.ru);
  const USD = currencies.Fabric(currencies.Country.en);
  const YAN = currencies.Fabric(currencies.Country.ch);

  let userWallet: wallet.Instance;

  afterEach(() => {
    if ( userWallet ) {
      userWallet = new wallet.Instance(CURRENCIES);
    }
  })

  test("operations::create", () => {

    userWallet = new wallet.Instance(CURRENCIES);

    CURRENCIES.forEach(currency_type => {
      expect(userWallet.currencies[currency_type]).exist
    })

  })

  test("operations::transform", () => {

    if ( !userWallet ) expect.fail();

    const value = new RUB(100);

    expect(value.convert(USD)).toBe(2);
    expect(value.convert(YAN)).toBe(10);
    expect(value.convert(RUB)).toBe(100);
    
  })

  test("operations::send", async () => {

    if ( !userWallet ) expect.fail();

    const currencyWallet = userWallet.currencies[WALLET_TARGET];

    await userWallet.send(new RUB(10), WALLET_TARGET);
    expect(currencyWallet.value).toBe(10);

    await userWallet.send(new USD(10), WALLET_TARGET);
    expect(currencyWallet.value).toBe(510);

    await userWallet.send(new YAN(10), WALLET_TARGET);
    expect(currencyWallet.value).toBe(610);

  })

  test("operations::take", async () => {

    if ( !userWallet ) expect.fail();

    await userWallet.send(new RUB(5000), WALLET_TARGET);
    await userWallet.take(new RUB(1000), WALLET_TARGET);

    expect(userWallet.currencies[WALLET_TARGET].value).toBe(4000);
    
  })

})