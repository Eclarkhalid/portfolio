import { FaSquareXTwitter } from 'react-icons/fa6'
import { AiFillYoutube, AiFillInstagram } from 'react-icons/ai'
import { BsDiscord } from 'react-icons/bs'
import { Link } from 'react-router-dom';

const Footer = () => {
  return <>
    <footer className="flex justify-between w-full items-center pt-2 mb-8 md:mb-2">
      <div className="links flex gap-4 text-2xl">
        <Link to={'https://twitter.com/eclarkhalid'} className='text-gray-600 hover:text-gray-900'>
          <FaSquareXTwitter />
        </Link>
        <Link to={'https://www.youtube.com/@eclarkhalid/videos'} className='text-gray-600 hover:text-gray-900'>
          <AiFillYoutube />
        </Link>
        <Link to={'https://instagram.com/eclar_khalid?igshid=OGQ5ZDc2ODk2ZA=='} className='text-gray-600 hover:text-gray-900'>
          <AiFillInstagram />
        </Link>

        <Link to={'https://discord.gg/RBG3BATb'} className='text-gray-600 hover:text-gray-900'>
          <BsDiscord />
        </Link>

      </div>
      <p className='desc'>&copy;2023 <span className="hidden md:inline">All rights reserved</span></p>

    </footer>
  </>;
}

export default Footer;