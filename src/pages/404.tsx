import { Public_Sans } from 'next/font/google'
import Link from 'next/link'
import { Footer } from '@/widgets/footer'

const font = Public_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
})

export default function PageNotFound() {
  return (
    <>
      <main className='flex flex-col justify-center items-center md:h-screen p-8 md:px-16 gap-8'>
        <h1 className={font.className + ' text-4xl font-semibold'}>
          Page not found.
        </h1>
        <Link href='/' className='hover:bg-neutral-800 rounded-md px-4 py-2 transition-colors'>Go to the home page</Link>
      </main>
      <Footer />
    </>
  )
}