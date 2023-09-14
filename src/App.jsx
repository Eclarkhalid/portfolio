import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import About from "./About";
import Projects from "./Projects";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  let content;

  switch (location.pathname) {
    case "/about":
      content = <About />;
      break;
    case "/projects":
      content = <Projects />;
      break;
    default:
      content = <About />;
      break;
  }

  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Header />

        <div className="w-full flex justify-between items-center pt-3">
          <div className="head_text">
            <h1>{location.pathname === "/" ? "About" : "Projects"}</h1>
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
