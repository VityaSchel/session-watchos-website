import React from 'react'
import { Footer } from '@/widgets/footer'
import { Public_Sans } from 'next/font/google'
import { TiArrowRight } from 'react-icons/ti'
import Link from 'next/link'
import { encryptTextWithAES, keyFromBuffer } from '@/shared/aes'
import { Loader2 } from 'lucide-react'
import { base64ToUint8Array } from '@/shared/base64'
import { SubmitLoginFlowResponse } from '@/pages/api/login-flow-result/[flowID]'
import { GetServerSidePropsContext } from 'next'
import { getFlow } from '@/app/db'
import { useRouter } from 'next/router'

const font = Public_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

const btn = 'rounded-full px-4 py-2 flex items-center justify-between font-semibold'

export default function LoginHelperPage() {
  const [encryptionKey, setEncryptionKey] = React.useState<null | { iv: Uint8Array, key: CryptoKey } | 'error'>(null)

  React.useEffect(() => {
    const onHashChange = async () => {
      const encodedConcatenatedIvAndKey = window.location.hash.slice(1)
      if (!encodedConcatenatedIvAndKey) return
      try {
        const concatenatedIvAndKey = await base64ToUint8Array(encodedConcatenatedIvAndKey)
        const ivLength = 16
        const keyLength = 32
        const expectedLength = ivLength + keyLength
        if (concatenatedIvAndKey.length !== expectedLength) throw new Error(`Invalid decoded buffer length (${concatenatedIvAndKey.length} ≠ ${expectedLength})`)
        const ivBuffer = concatenatedIvAndKey.slice(0, ivLength)
        const keyBuffer = concatenatedIvAndKey.slice(ivLength)
        const key = await keyFromBuffer(keyBuffer)
        setEncryptionKey({ iv: ivBuffer, key })
      } catch(e) {
        console.error(e)
        setEncryptionKey('error')
      }
    }
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    encryptionKey &&
      (encryptionKey === 'error' 
        ? <ErrorMessage />
        : <LoginForm encryptionKey={encryptionKey} />)
  )
}

function ErrorMessage() {
  return (
    <>
      <main className='flex flex-col justify-center items-center md:h-screen p-8 md:px-16 gap-8'>
        <h1 className={font.className + ' text-4xl font-semibold'}>Something gone wrong. Sorry about that.</h1>
        <Link href='/' className='hover:bg-neutral-800 rounded-md px-4 py-2 transition-colors'>Go to the home page</Link>
      </main>
      <Footer />
    </>
  )
}

function LoginForm({ encryptionKey }: {
  encryptionKey: { iv: Uint8Array, key: CryptoKey }
}) {
  const { flowID } = useRouter().query
  const [phrase, setPhrase] = React.useState('')
  const words = React.useMemo(() => phrase.split(' ').filter(w => w !== ''), [phrase])
  const [sent, setSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)

  const handleSend = async () => {
    setSending(true)
    try {
      const encryptedContent = await encryptTextWithAES(phrase, encryptionKey.iv, encryptionKey.key)
      let encodedContent = ''
      new Uint8Array(encryptedContent)
        .forEach((byte: number) => { encodedContent += String.fromCharCode(byte) })
      const response = await fetch('/api/login-flow-result/' + flowID, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: btoa(encodedContent)
      })
        .then(res => res.json() as Promise<SubmitLoginFlowResponse>)
      if (response.ok) {
        setSent(true)
      } else {
        throw new Error(response.error)
      }
    } catch(e) {
      console.error(e)
      if(e instanceof Error) {
        alert(e.message)
      } else {
        alert('An error occurred')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <main className='flex flex-col lg:flex-row justify-center items-center md:h-screen p-8 md:px-16 gap-24'>
        {sent ? (
          <div className='flex items-center flex-col gap-4'>
            <h1 className={font.className + ' text-4xl font-semibold'}>Great 👍</h1>
            <p>Check your device to continue</p>
          </div>
        ) : (<>
          <div className='flex flex-col gap-6'>
            <h1 className={font.className + ' text-4xl font-semibold'}>Log in with existing account</h1>
            <div className='flex flex-col items-end gap-3 mt-4'>
              <input 
                className='bg-black border-neutral-500 border px-4 py-4 font-mono w-full focus:outline-none focus:border-neutral-600'
                value={phrase}
                disabled={sending}
                placeholder='Mnemonic phrase' 
                maxLength={32 * 13}
                onChange={e => {
                  const value = e.target.value
                    .toLowerCase()
                    .replaceAll(/[^a-z ]/g, '')
                  const words = value.split(' ')
                  setPhrase(
                    words
                      .filter((word, i, words) => {
                        if (i === words.length-1 || word !== '') return true
                        else return false
                      })
                      .slice(0, 13)
                      .join(' ')
                  )
                }}
              />
              <span className='font-mono tabular-nums'>{words.length}/13</span>
            </div>
            <button 
              className={btn + ' bg-brand disabled:bg-neutral-400 text-black disabled:text-neutral-700 transition-colors'} 
              disabled={sending || words.length < 13} 
              onClick={handleSend}
            >
              Continue {sending 
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <TiArrowRight className='text-2xl' />
              }
            </button>
          </div>
          <div className='flex flex-col gap-4 max-w-xl lg:max-w-96 xl:max-w-xl'>
            <h2 className={font.className + ' text-3xl font-medium'}>
              Am I just sending you my mnemonic phrase? Is this secure?
            </h2>
            <p className={font.className + ' text-sm font-normal'}>
              See that tiny # character in your address bar? It&apos;s called URL fragment and what follows it — is a decryption key, which was generated along with qr code on your device. When you press Continue, this key is used to encrypt your mnemonic phrase and this gibberish is sent back to your watches where the same key is used to decrypt it.<br></br><br></br>Basically, your browser sends encrypted mnemonic so we can&apos;t read it, then your watches turn it back. It&apos;s that simple and works on AES-256 symmetric encryption. Your mnemonic phrase never leaves your devices unencrypted.
            </p>
          </div>
        </>)}
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { flowID } = context.params as { flowID: string }
  if (!flowID) {
    return {
      notFound: true
    }
  }
  if(await getFlow(flowID) === null) {
    return {
      notFound: true
    }
  }
  return {
    props: {}
  }
}