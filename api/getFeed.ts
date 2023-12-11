import { VercelRequest, VercelResponse } from "@vercel/node";
import vkio from "vk-io/lib/api";

export default async function getFeed(req: VercelRequest, res: VercelResponse) {

  // process.env.FIREBASE_API_APP
  const instance = new vkio.API({
    token: String(process.env.VK_API_TOKEN)
  });

  const data = await instance.wall.get({  });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));

}