export async function base64ToUint8Array(base64: string) {
  const base64Response = await fetch(`data:application/octet-stream;base64,${base64}`)
  const blob = await base64Response.blob()
  const arrayBuffer = await blob.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}