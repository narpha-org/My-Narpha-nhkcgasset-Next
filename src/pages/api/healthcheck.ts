import type { NextApiRequest, NextApiResponse } from "next";

export default function healthcheck(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: "OK" });
}
