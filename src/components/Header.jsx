import { BsGithub } from "react-icons/bs";
import { TbBrandFiverr } from 'react-icons/tb'

const Header = () => {
  return <>
    <header className="z-50 flex justify-center items-center flex-col font-satoshi bg-white sticky top-0 w-full">
      <nav className="flex justify-between items-center w-full mb-8 pt-3">
        <h2 className="flex justify-center logo items-center ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
          eclarKhalid
        </h2>

        <div className="flex gap-2">
          <button type='button' onClick={() => window.open(' https://www.fiverr.com/s/PvZdlG')} className='white_btn'>
            <TbBrandFiverr />
            Hire Me

          </button>
          <button type='button' onClick={() => window.open('https://github.com/Eclarkhalid')} className='black_btn'>
            <BsGithub className="text-white" />
            Github

          </button>
        </div>
      </nav>
    </header>
  </>;
}

export default Header;