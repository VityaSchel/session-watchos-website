import { RedisClientType, createClient } from 'redis'

let client: RedisClientType | undefined
async function getDB(): Promise<RedisClientType> {
  if(client) {
    if(client.isReady) {
      return client
    } else {
      await new Promise(r => client!.once('ready', r))
      return client
    }
  } else {
    const newClient = await createClient()
      .on('error', err => console.log('Redis Client Error', err))
      .connect()

    // @ts-expect-error i don't care
    client = newClient

    // @ts-expect-error i don't care
    return newClient
  }
}

export async function getFlow(flowID: string) {
  const db = await getDB()
  return await db.get('flows:' + flowID)
}

export async function setFlow(flowID: string, value: string) {
  const db = await getDB()
  await db.set('flows:' + flowID, value)
  await db.expire('flows:' + flowID, 60 * 60 * 24)
}

export async function deleteFlow(flowID: string) {
  const db = await getDB()
  await db.del('flows:' + flowID)
}