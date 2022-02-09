
// MODULE NAMESPACE
export namespace cache {

  export function set(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  export function get(key: string) {
    return JSON.parse(window.localStorage.getItem(key)!)
  }

  export function check(key: string): boolean {
    return Boolean(window.localStorage.getItem(key));
  }

  export function clear() {
    window.localStorage.clear();
  }
  
}
