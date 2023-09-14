import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Tabs = () => {
  const location = useLocation();

  const inactiveClass = 'text-gray-400 underline hover:text-gray-500';
  const activeClass = 'text-black font-medium';

  return (
    <nav className="p-2">
      <div className="container mx-auto">
        <ul className="flex items-center justify-center space-x-4 font-inter">
          <li className={location.pathname === '/' ? activeClass : inactiveClass}>
            <Link to="/">About</Link>
          </li>
          <li className={location.pathname === '/projects' ? activeClass : inactiveClass}>
            <Link to="/projects">Projects</Link>
          </li>
          {/* Add more li elements for other links */}
        </ul>
      </div>
    </nav>
  );
};

export default Tabs;
