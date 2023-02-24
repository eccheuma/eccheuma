import { Hash } from '~/contracts/Nominals';
import { Result, utils } from '.';

interface ICacheContainer<D> {
  hash: Hash,
  data: D,
}

// MODULE NAMESPACE
export namespace cache {

  export function set<D>(key: string, data: D) {

    const KEY = utils.string.mangle(key, utils.string.MangleMode.ENCODE);

    const container: ICacheContainer<D> = {
      hash: utils.randHashGenerator(),
      data: data,
    };

    window.localStorage.setItem(KEY, JSON.stringify(container));

  }

  export function get<D>(key: string): Result<ICacheContainer<D>, Error> {

    const KEY = utils.string.mangle(key, utils.string.MangleMode.DECODE);

    const container = window.localStorage.getItem(KEY);

    if ( container?.charAt(0) !== '{' ) return Error('Cache miss');

    return JSON.parse(container);

  }

  export function check(key: string): boolean {

    const KEY = utils.string.mangle(key, utils.string.MangleMode.ENCODE);

    return Boolean(window.localStorage.getItem(KEY));
    
  }

  export function clear() {
    window.localStorage.clear();
  }
  
}
