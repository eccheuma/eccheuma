const CLOUD_FUNCTION_HOSTING_URL = process.env.CLOUD_FUNCTION_HOSTING_URL;

export async function externalFetch(url: string): Promise<Response> {
  return await fetch(`${ CLOUD_FUNCTION_HOSTING_URL }/fetch?url=${ url }`);
}