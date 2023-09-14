import { Link } from "react-router-dom";
import img from './assets/favicon.svg'
import { projectLinks } from "../constants";

const Projects = () => {
  return <>
    <div className="mt-12 w-full">
      <h2 className="desc mb-3">Here are the projects I have managed to complete:</h2>

      {projectLinks.map((link, index) => (
        <div key={link.title}  className={`flex flex-col w-full gap-2 ${
          index % 2 === 0 ? 'link_card' : 'link_card_2'
        } mb-3`} >
          <Link to={link.url} className="md:flex justify-between items-center" target="_blank">
            <div className="flex items-center gap-2">
              <div class="flex h-12 w-12 mb-2 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-secondary-400">
                <span class="text-lg avatar">{link.avatar} </span>
              </div>
              <h1 className="title_text">{link.title}</h1>
            </div>
            <h2 className=" font-inter truncate text-sm h2_text">{link.heading}</h2>
          </Link>
          <div className="flex justify-between items-center">
            <p>&copy;{link.year}</p>
            <p >
              <Link to={link.code} className="submit_btn" target="_blank">Code</Link>
            </p>
          </div>
        </div>
      ))}

      <hr className="my-8 h-px border-0 bg-gray-300" />
    </div>
  </>;
}

export default Projects;