
// Probably this location always should be a same origin. 
// Or if server can use CORS more freely it can be defirent location for functions hosting   
const CLOUD_FUNCTION_HOSTING_URL = globalThis.location?.origin;

export async function fetchExternal(url: string): Promise<Response> {

  if (CLOUD_FUNCTION_HOSTING_URL.match('localhost')?.length) {
    return Response.error();
  }

  return await fetch(`${CLOUD_FUNCTION_HOSTING_URL}/api/fetch?url=${encodeURIComponent(url)}`);

}