import { Hash } from '~/types/Nominals';
import { Result, utils } from '.';

interface ICacheContainer<D> {
  hash: Hash,
  data: D,
}

// MODULE NAMESPACE
export namespace cache {

  export function set<D>(key: string, data: D) {

    const container: ICacheContainer<D> = {
      hash: utils.randHashGenerator(),
      data: data,
    };

    window.localStorage.setItem(key, JSON.stringify(container));

  }

  export function get<D>(key: string): Result<ICacheContainer<D>, Error> {

    const item = window.localStorage.getItem(key);

    if ( item?.charAt(0) !== '{' ) return Error('Cache miss');

    return JSON.parse(item);

  }

  export function check(key: string): boolean {
    return Boolean(window.localStorage.getItem(key));
  }

  export function clear() {
    window.localStorage.clear();
  }
  
}
