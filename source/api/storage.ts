// TYPES
import type { FileOptions, FileObject } from '@supabase/storage-js';
import { Result } from '~/utils';

export namespace references {
  export const images = 'images';
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

  export const enum StorageErrors {
    path = 'Wrong path',
    corrupt = 'Path resolve was corrupt',
  } 

  export async function reference(path: string): Promise<Result<string>> {

    const { publicURL, error } = global.supabase.storage.from('main').getPublicUrl(path);

    if ( error ) 
      return Error(StorageErrors.path);
    if ( !publicURL ) 
      return Error(StorageErrors.corrupt);

    return Promise.resolve(publicURL);
  
  }
  
  export async function list(path = '/'): Promise<ListResponse | StorageErrors> {

    function constructFile(object: FileObject): ResponseFile {
      return {
        name: object.name,
        path: `${ path }/${ object.name }`
      };
    }

    const FOLDERS = Array<ResponseFile>();
    const FILES   = Array<ResponseFile>();   

    const { error, data } = await global.supabase.storage.from('main').list(path);

    if ( error || !data ) return storage.StorageErrors.path;

    for ( const value of data ) {

      const responseStruct = constructFile(value);

      value.metadata
        ? FILES.push(responseStruct)
        : FOLDERS.push(responseStruct);

    }

    return {
      files   : FILES,
      folders : FOLDERS
    };

  }
  
  export function upload(path: string, data: any, meta?: FileOptions) {
    return global.supabase.storage.from('main').upload(path, data, { upsert: true, ...meta });
  }

  export function remove(path: string) {
    return global.supabase.storage.from('main').remove([ path ]);
  }

}
