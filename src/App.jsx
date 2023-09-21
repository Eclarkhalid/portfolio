import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import About from "./About";
import Projects from "./Projects";
import Footer from "./components/Footer";
import { Contact } from "./Contact";

function App() {
  const location = useLocation();
  let content;
  let pageTitle;

  switch (location.pathname) {
    case "/about":
      content = <About />;
      pageTitle = "About";
      break;
    case "/projects":
      content = <Projects />;
      pageTitle = "Projects";
      break;
    case "/contact":
      content = <Contact />;
      pageTitle = "Contact";
      break;
    default:
      content = <About />;
      pageTitle = "About";
      break;
  }

  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Header />

        <div className="w-full lg:flex md:flex justify-between items-center pt-3">
          <div className="head_text">
            <h1>{pageTitle}</h1>
          </div>
          <Tabs />
        </div>

        {content}

        <Footer />
      </div>
    </main>
  );
}

export default App;
