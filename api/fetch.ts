import nodeFetch from 'node-fetch';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  
  const { url } = req.query;

  if ( !url ) return res.status(500).send('url');

  const response = url instanceof Array
    ? await nodeFetch(url[0])
    : await nodeFetch(url);

  const data = await response.json();
  
  console.log(response);
  console.log(data);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ response: data }));

}