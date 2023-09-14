import { FaSquareXTwitter } from 'react-icons/fa6'
import { AiFillYoutube, AiFillInstagram } from 'react-icons/ai'
import { BsDiscord } from 'react-icons/bs'
import { Link } from 'react-router-dom';

const Footer = () => {
  return <>
    <footer className="flex justify-between w-full items-center pt-2 mb-8 md:mb-2">
      <div className="links flex gap-4 text-xl">
        <Link to={'/'} className='text-gray-600 hover:text-gray-900'>
          <FaSquareXTwitter />
        </Link>
        <Link to={'/'} className='text-gray-600 hover:text-gray-900'>
          <AiFillYoutube />
        </Link>
        <Link to={'/'} className='text-gray-600 hover:text-gray-900'>
          <AiFillInstagram />
        </Link>

        <Link to={'/'} className='text-gray-600 hover:text-gray-900'>
          <BsDiscord />
        </Link>

      </div>
      <p className='desc'>&copy;2023 <span className="hidden md:inline">All rights reserved</span></p>

    </footer>
  </>;
}

export default Footer;