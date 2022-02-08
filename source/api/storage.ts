// SUPABASE
import Supabase from '~/plugins/Supabase';

import type { FileOptions } from '@supabase/storage-js/src/lib/types'

export namespace storage {
  export function getStorageLink(path: string): string | null {

    const { publicURL, error } = Supabase.storage.from('main').getPublicUrl(path);
  
    if ( error ) throw error;
  
    return publicURL
  
  }
  
  export function getStorageList(path: string = '/') {
    return Supabase.storage.from('main').list(path)
  }
  
  export function uploadStorageFile(path: string, data: any, meta?: any) {
    return Supabase.storage.from('main').upload(path, data, { upsert: true })
  }

  export function remove(path: string) {
    return Supabase.storage.from('main').remove([ path ])
  }

}
