import { flows } from '@/app/db'
import { NextApiRequest, NextApiResponse } from 'next'

export type SubmitLoginFlowResponse = {
  ok: true
} | {
  ok: false
  error: string
}

export default function LoginFlowResult(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const flowID = req.query.flowID
    if (flowID === undefined || Array.isArray(flowID)) {
      res.status(400).send({ ok: false, error: 'Invalid flowID' })
      return
    }
    const result = flows.get(flowID)
    if(result === undefined) {
      res.status(404).send({ ok: false, error: 'Flow not found' })
    } else {
      if(result !== null) {
        flows.delete(flowID)
      }
      res.send({ ok: true, result })
    }
  } else if(req.method === 'PUT') {
    const flowID = req.query.flowID
    if (flowID === undefined || Array.isArray(flowID)) {
      res.status(400).send({ ok: false, error: 'Invalid flowID' })
      return
    }
    if (!flows.has(flowID)) {
      res.status(404).send({ ok: false, error: 'Flow not found' })
      return
    }
    flows.set(flowID, req.body)
    res.send({ ok: true })
  } else {
    res.status(405).send({ ok: false, error: 'Method not allowed' })
  }
}