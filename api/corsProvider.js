import nodeFetch from 'node-fetch';

export default async function handler(req, res) {
  
  const response = await nodeFetch(req.query.url)
  
  const data = await response.json();

  console.log(response, JSON.parse(data));

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ response: data || 0 }))

}