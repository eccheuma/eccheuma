
// MODULE NAMESPACE
export namespace cache {

  export function set(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  export function get(key: string) {

    const item = window.localStorage.getItem(key);

    if ( item?.charAt(0) === '{' ) {
      return JSON.parse(item);
    }

    return item;

  }

  export function check(key: string): boolean {
    return Boolean(window.localStorage.getItem(key));
  }

  export function clear() {
    window.localStorage.clear();
  }
  
}
