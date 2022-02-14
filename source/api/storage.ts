// TYPES
import type { FileOptions } from '@supabase/storage-js/src/lib/types'

// SUPABASE
import Supabase from '~/plugins/Supabase';

export namespace references {
  export const images = 'images'
}

// MODULE NAMESPACE
export namespace storage {
  export function reference(path: string): string | null {

    const { publicURL, error } = Supabase.storage.from('main').getPublicUrl(path);
  
    if ( error ) throw error;
  
    return publicURL
  
  }
  
  export function list(path: string = '/') {
    return Supabase.storage.from('main').list(path)
  }
  
  export function upload(path: string, data: any, meta?: FileOptions) {
    return Supabase.storage.from('main').upload(path, data, { upsert: true, ...meta })
  }

  export function remove(path: string) {
    return Supabase.storage.from('main').remove([ path ])
  }

}
