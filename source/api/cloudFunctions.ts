
// Probably this location always should be a same origin. 
// Or if server can use CORS more freely it can be defirent location for functions hosting   
const CLOUD_FUNCTION_HOSTING_URL = globalThis.location?.origin;

export async function fetchExternal(url: string): Promise<Response> {

  if ( !CLOUD_FUNCTION_HOSTING_URL ) return {} as Response;

  return await fetch(`${ CLOUD_FUNCTION_HOSTING_URL }/api/fetch?url=${ encodeURIComponent(url) }`);
  
}