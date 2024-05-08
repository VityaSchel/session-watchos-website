import Screenshot from '@/assets/screenshot.png'
import Image from 'next/image'
import { Public_Sans } from 'next/font/google'
import { TiArrowRight } from 'react-icons/ti'
import { FaGithub } from 'react-icons/fa'
import { Footer } from '@/widgets/footer'
import Link from 'next/link'

const font = Public_Sans({
  weight: ['600','700'],
  subsets: ['latin'],
})

const btn = 'rounded-full px-[44px] py-2 flex items-center'

export default function HomePage() {
  return (
    <>
      <main className='flex justify-center items-center md:h-screen p-8 md:px-16'>
        <div className='flex flex-col md:flex-row gap-12 920px:gap-24 items-center'>
          <div className='flex flex-col gap-8'>
            <h1 className={font.className + ' text-4xl font-semibold'}>Open Session on your Apple Watch</h1>
            <p className='max-w-xl text-balance'>First Session messenger client that runs on WatchOS. Send and receive messages like in movies. No companion app required, everything runs inside your watches.</p>
            <div className={font.className + ' flex gap-4 font-bold flex-wrap'}>
              <Link href='https://github.com/VityaSchel/session-watchos/Releases' className='rounded-full'>
                <button className={btn + ' bg-brand text-black'} tabIndex={-1}>
                  Download <TiArrowRight className='ml-1 text-2xl' />
                </button>
              </Link>
              <Link href='https://github.com/VityaSchel/session-watchos' className='rounded-full'>
                <button className={btn + ' bg-neutral-800'} tabIndex={-1}>
                  <FaGithub className='mr-3' /> Open sources
                </button>
              </Link>
            </div>
          </div>
          <div className='screenshot-mask relative aspect-[241/268] h-[282px] w-auto'>
            <Image src={Screenshot} alt='Screenshot of the app' placeholder='blur' fill quality={100} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
