export async function keyFromBuffer(keyBuffer: Uint8Array) {
  return await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  )
}

export async function encryptTextWithAES(text: string, ivBuffer: Uint8Array, key: CryptoKey) {
  const encodedText = new TextEncoder().encode(text)
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: ivBuffer },
    key,
    encodedText
  )

  return encryptedData
}