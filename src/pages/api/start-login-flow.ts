import { flows } from '@/app/db'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

export default function StartLoginFlow(req: NextApiRequest, res: NextApiResponse) {
  const flowID = nanoid(9)
  flows.set(flowID, null)
  res.send({ ok: true, flowID })
} 