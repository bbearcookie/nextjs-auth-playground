import { sessionOptions } from '@/config/sessionOptions';
import { SessionType } from '@/types/session';
import { getIronSession } from 'iron-session';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await getIronSession<SessionType>(req, res, sessionOptions);

    res.status(200).json({ accessToken: session.accessToken });
  }
}
