import { setFlow } from '@/app/db'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next'

export default function StartLoginFlow(req: NextApiRequest, res: NextApiResponse) {
  const flowID = nanoid(9)
  setFlow(flowID, '')
  res.send({ ok: true, flowID })
} 