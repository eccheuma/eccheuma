import type { ActionTree, MutationTree } from 'vuex';
import { database } from '~/api/database';
import { VuexMap } from '~/contracts/VuexMap';
import { currencies, wallet } from '~/utils/currency';

interface WalletState {
  Current: wallet.contract,
  Country: currencies.Country, 
}

declare module '~/contracts/VuexMap' {
  interface User {
    Wallet: WalletState
  }
}

export const state = (): WalletState => ({

  Country: currencies.Country.ru, 

  Current: {
    RUB: Number(),
    CHY: Number(),
    USD: Number(),
  },

});

export const mutations: MutationTree<WalletState> = {
  
  setWallet(state, x: wallet.contract) {
    state.Current = x;
  },

  setCountry(state, x: currencies.Country) {
    state.Country = x;
  },

};

export const actions: ActionTree<WalletState, VuexMap> = {

  async getWallet(vuex, uid: string) {

    const getResult: Partial<wallet.contract> = await database.get(`wallets/${ uid }`);

    vuex.commit('setWallet', { ...vuex.state.Current, ...getResult });

  }

};