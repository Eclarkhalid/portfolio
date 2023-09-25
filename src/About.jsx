import React from 'react';

function About() {
  return (
    <section className="mt-16 w-full max-w-4xl">
      <div className="flex flex-col w-full desc">
        <p className="text-lg font-semibold mb-3">
          Hi, I'm a web developer based in Nairobi, Kenya, with a passion for creating web applications. I hold a BSc in Business Information Technology from Mount Kenya University, specializing in:
        </p>

        <ul className="list-disc ml-6 text-lg mb-3">
          <li><span className="font-semibold text-blue-600">React:</span> Building dynamic and interactive user interfaces.</li>
          <li><span className="font-semibold text-blue-600">Next.js:</span> Creating server-rendered React apps for performance and SEO.</li>
          <li><span className="font-semibold text-blue-600">HTML/CSS:</span> Crafting visually appealing and responsive web designs.</li>
          <li><span className="font-semibold text-blue-600">JavaScript:</span> Adding interactivity and functionality to web apps.</li>
          <li><span className="font-semibold text-blue-600">MERN Technologies:</span> Developing full-stack web applications.</li>
          <li><span className="font-semibold text-blue-600">Git:</span> Ensuring efficient code management and collaboration.</li>
        </ul>

        <p className="text-lg mb-3 font-medium">
          On a personal note, I'm known for my dedication, problem-solving skills, and an unwavering commitment to quality. I thrive in collaborative environments and enjoy tackling complex challenges.
        </p>

        <p className="text-lg mb-3 font-medium">
          In addition to my development work, I share my knowledge and teach programming on <a href="https://www.youtube.com/@eclarkhalid/videos" target="_blank" rel="noopener noreferrer" className="text-blue-900 underline">YouTube</a>. I'm committed to staying up-to-date with the latest trends in web development and am eager to collaborate on exciting projects. Feel free to reach out if you'd like to work together!
        </p>
        
        <p className="text-lg mb-3 font-medium">
          View the <a href="/projects" className="text-blue-900 underline">Projects section</a> to see my work.
        </p>
        
        <hr className="my-8 h-px border-0 bg-gray-300" />
      </div>
    </section>
  );
}

export default About;
