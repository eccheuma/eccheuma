// TYPES
import type { FileOptions, FileObject } from '@supabase/storage-js';

export namespace references {
  export const images = 'images'
}

// MODULE NAMESPACE
export namespace storage {

  type ResponseFile = {
    name: string,
    path: string,
  }

  type ListResponse = {
    files   : Array<ResponseFile>,
    folders : Array<ResponseFile>,
  }

  export const enum error {
    path = 'Get of undefined or wrong path' 
  } 

  export function reference(path: string): string | null {

    const { publicURL, error } = global.supabase.storage.from('main').getPublicUrl(path);
  
    if ( error ) throw error;
  
    return publicURL
  
  }
  
  export async function list(path: string = '/'): Promise<ListResponse | storage.error> {

    function constructFile(object: FileObject): ResponseFile {
      return {
        name: object.name,
        path: `${ path }/${ object.name }`
      }
    }

    const FOLDERS = Array<ResponseFile>();
    const FILES   = Array<ResponseFile>();   

    const { error, data } = await global.supabase.storage.from('main').list(path)

    if ( error || !data ) return storage.error.path;

    for ( const value of data ) {

      const responseStruct = constructFile(value);

      value.metadata
        ? FILES.push(responseStruct)
        : FOLDERS.push(responseStruct)

    }

    return {
      files   : FILES,
      folders : FOLDERS
    }

  }
  
  export function upload(path: string, data: any, meta?: FileOptions) {
    return global.supabase.storage.from('main').upload(path, data, { upsert: true, ...meta })
  }

  export function remove(path: string) {
    return global.supabase.storage.from('main').remove([ path ])
  }

}
