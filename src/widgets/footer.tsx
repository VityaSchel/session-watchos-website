import Link from 'next/link'
import { FaTelegram } from 'react-icons/fa'

const link = 'text-neutral-500 hover:text-brand font-medium transition-colors duration-100 w-fit'

export function Footer() {
  return (
    <footer className='flex flex-col 920px:flex-row gap-4 920px:items-center bg-neutral-900 w-full p-4 text-neutral-400'>
      <Link className={link} href='https://t.me/session_nodejs' target='_blank' rel='noreferrer nofollow'>
        <FaTelegram className='text-xl' />
      </Link>
      <div className='flex flex-col 920px:flex-row gap-2 920:items-center'>
        <span>Check out other cool projects:</span>
        <Link className={link} href='https://sessionbots.directory' target='_blank' rel='noreferrer nofollow'>
          Session Bots Directory
        </Link>
        <Link className={link} href='https://ons.sessionbots.directory' target='_blank' rel='noreferrer nofollow'>
          ONS Registry
        </Link>
        <Link className={link} href='https://github.com/VityaSchel/session-nodejs-bot' target='_blank' rel='noreferrer nofollow'>
          Session Node.js client
        </Link>
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <Link className={link} href='https://hloth.dev' target='_blank' rel='noreferrer nofollow'>
          by hloth
        </Link>
        <span>•</span>
        <Link className={link} href='https://hloth.dev/donate' target='_blank' rel='noreferrer nofollow'>
          donate
        </Link>
      </div>
    </footer>
  )
}