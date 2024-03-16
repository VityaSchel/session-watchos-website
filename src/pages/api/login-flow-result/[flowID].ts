import { deleteFlow, getFlow, setFlow } from '@/app/db'
import { NextApiRequest, NextApiResponse } from 'next'

export type SubmitLoginFlowResponse = {
  ok: true
} | {
  ok: false
  error: string
}

export default async function LoginFlowResult(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const flowID = req.query.flowID
    if (flowID === undefined || Array.isArray(flowID)) {
      res.status(400).send({ ok: false, error: 'Invalid flowID' })
      return
    }
    const result = await getFlow(flowID)
    if(result === null) {
      res.status(404).send({ ok: false, error: 'Flow not found' })
    } else {
      if(result !== '') {
        deleteFlow(flowID)
      }
      res.send({ ok: true, result: result || null })
    }
  } else if(req.method === 'PUT') {
    const flowID = req.query.flowID
    if (flowID === undefined || Array.isArray(flowID)) {
      res.status(400).send({ ok: false, error: 'Invalid flowID' })
      return
    }
    const flow = await getFlow(flowID)
    if (flow === null) {
      res.status(404).send({ ok: false, error: 'Login flow not found' })
      return
    }
    if (flow !== '') {
      res.status(400).send({ ok: false, error: 'Result already submitted' })
      return
    }
    if (typeof req.body !== 'string') {
      res.status(400).send({ ok: false, error: 'Invalid body' })
      return
    }
    if (req.body.length > 1024) {
      res.status(413).send({ ok: false, error: 'Request entity too large' })
      return
    }
    if(Buffer.from(req.body, 'base64').toString('base64') !== req.body) {
      res.status(400).send({ ok: false, error: 'Invalid base64' })
      return
    }
    setFlow(flowID, req.body)
    res.send({ ok: true })
  } else {
    res.status(405).send({ ok: false, error: 'Method not allowed' })
  }
}