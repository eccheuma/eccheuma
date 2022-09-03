export default async function handler(req, res) {
  
  const response = await fetch(req.query.url)
  
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ response: response }))

}