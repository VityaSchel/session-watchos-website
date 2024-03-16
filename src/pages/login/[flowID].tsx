import React from 'react'
import { Footer } from '@/widgets/footer'
import { Public_Sans } from 'next/font/google'
import { TiArrowRight } from 'react-icons/ti'
import Link from 'next/link'

const font = Public_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

const btn = 'rounded-full px-4 py-2 flex items-center justify-between font-semibold'

export default function LoginHelperPage() {
  const [encryptionKey, setEncryptionKey] = React.useState<null | string | 'error'>(null)

  React.useEffect(() => {
    const onHashChange = () => {
      const key = window.location.hash.slice(1)
      if (key.length === 64) setEncryptionKey(key)
      else setEncryptionKey('error')
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
        : <LoginForm key={encryptionKey} />)
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

function LoginForm() {
  const [phrase, setPhrase] = React.useState('')
  const words = React.useMemo(() => phrase.split(' ').filter(w => w !== ''), [phrase])

  return (
    <>
      <main className='flex flex-col lg:flex-row justify-center items-center md:h-screen p-8 md:px-16 gap-24'>
        <div className='flex flex-col gap-6'>
          <h1 className={font.className + ' text-4xl font-semibold'}>Log in with existing account</h1>
          <div className='flex flex-col items-end gap-3 mt-4'>
            <input 
              className='bg-black border-neutral-500 border px-4 py-4 font-mono w-full focus:outline-none focus:border-neutral-600'
              value={phrase}
              placeholder='Mnemonic phrase' 
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
                    .slice(0, 12)
                    .join(' ')
                )
              }}
            />
            <span className='font-mono tabular-nums'>{words.length}/12</span>
          </div>
          <button className={btn + ' bg-brand disabled:bg-neutral-400 text-black disabled:text-neutral-700 transition-colors'} disabled={words.length < 12}>
            Continue <TiArrowRight className='text-2xl' />
          </button>
        </div>
        <div className='flex flex-col gap-4 max-w-xl lg:max-w-96 xl:max-w-xl'>
          <h2 className={font.className + ' text-3xl font-medium'}>
            Am I just sending you my mnemonic phrase? Is this secure?
          </h2>
          <p className={font.className + ' text-sm font-normal'}>
            See that tiny # character in your address bar? It&apos;s called URL fragment and what follows it — is a decryption key, which was generated along with qr code on your device. When you press Continue, this key is used to encrypt your mnemonic phrase and this gibberish is sent back to your watches where the same key is used to decrypt it.<br></br><br></br>Basically, your browser sends encrypted mnemonic so we can&apos;t read it, then your watches turn it back. It&apos;s that simple and works on AES-256 symmetric encryption. Your mnemonic phrase never leaves your devices without encryption.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}