// import React from 'react'
// import Title from '../components/Title'
// import aboutus from '../assets/aboutus.jpg';
// const About = () => {
//   return (
//     <div>
//         <div className='text-2xl text-center pt-8 border-t'>
//             <Title text1={'ABOUT '} text2 = {' WEBSITE'}/>
//         </div>
//         <div className='my-10 flex flex-col md:flex-row gap-16'>
//             <img src={aboutus} alt="" className='w-full md:max-w-[450px]'/>
//             <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray'>
//             <p>Jewelry design is a complex art form that combines aesthetics, craftsmanship, and material science. Traditionally, creating unique jewelry patterns requires extensive expertise and creativity. With the advent of DL, there is an opportunity to augment the design process by leveraging AI's ability to generate intricate and diverse patterns. This paper presents a novel approach to using DL for generating jewelry design patterns, aiming to enhance creativity, efficiency, and customization in the jewelry industry.</p>

//             {/* <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. At est corporis exercitationem ipsum necessitatibus, ullam minus magni maiores hic possimus asperiores! Praesentium inventore dolorum accusamus nostrum esse totam culpa quasi.</p> */}
//             <b className='text-gray-800'>Our Mission</b>
//             <p> By leveraging the capabilities of AI, we aims to enable the generation of intricate and diverse jewelry design patterns that can inspire designers, reduce the time spent on ideation, and offer more personalized options to clients. This approach not only supports traditional craftsmanship but also pushes the boundaries of innovation within the jewelry industry, making the design process more accessible, efficient, and scalable while maintaining artistic integrity.</p>
//             </div>
//             {/* <div className='text-2xl py-4'>
//                 <Title text1={'WHY'} text2={'CHOOSE US'}/>
//             </div>
//             <div className='flex flex-col md-flex-row text-sm mb-20'>
//                 <div className='border px-10 md:px-16 sm:py-20 flex-col gap-5'>
//                     <b></b>
                    
//                 </div>
//             </div> */}
//         </div>
//     </div>
//   )
// }

// export default About

import React from "react";
import sketchToJewelry from "../assets/sketch-to-jewelry.png"; // Add a relevant image
// import projectStructure from "../assets/project-structure.png"; // Add a diagram showing project structure

function About() {
  return (
    <div className="bg-[#fafafa] text-[#414141] p-6 md:p-12">
      {/* Introduction */}
      <div className="mb-8">
        <h1 className="prata-regular text-4xl md:text-5xl text-center mb-4">About Us</h1>
        <p className="text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
          Welcome to our AI-powered jewelry design platform! This website transforms your sketch of jewelry 
          into a realistic and elegant design. Whether you're a jewelry designer, enthusiast, or just curious, 
          this platform bridges creativity and technology to bring your vision to life.
        </p>
      </div>

      {/* Use Cases */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Why Use This Website?</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            Sketch-to-Design Conversion: Upload your handmade sketches to generate realistic jewelry images.
          </li>
          <li>Save Time: Quickly prototype your jewelry ideas with AI assistance.</li>
          <li>
            Creative Exploration: Experiment with different styles without manually creating new sketches.
          </li>
          <li>
            Professional Output: Perfect for jewelry designers to present refined ideas to clients.
          </li>
        </ul>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-3">
          <li>Upload your jewelry sketches and get a generated design in seconds.</li>
          <li>Interactive and user-friendly interface.</li>
          <li>
            Secure Login and Signup functionality with MongoDB storage and Google Authentication.
          </li>
          <li>Preview previously generated designs for convenience.</li>
          <li>Powered by AI and deep learning models for accurate designs.</li>
        </ul>
      </div>

      {/* Visual Example */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Visual Example</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={sketchToJewelry}
            alt="Sketch to Jewelry Conversion"
            className="w-full md:w-1/2 rounded-md shadow-lg"
          />
          <p className="text-lg md:text-xl">
            The above image shows how our AI transforms a simple jewelry sketch into a realistic gold ornament 
            design. With advanced AI models, we ensure precision and elegance in every generated design.
          </p>
        </div>
      </div>

      {/* Project Structure */}
      {/* <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Project Structure</h2>
        <p className="text-lg md:text-xl leading-relaxed">
          Our project is built using the latest technologies to ensure seamless performance. Here's a quick overview 
          of the structure:
        </p>
        <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
          <img
            src={projectStructure}
            alt="Project Structure"
            className="w-full md:w-1/2 rounded-md shadow-lg"
          />
          <ul className="list-disc list-inside space-y-3 text-lg">
            <li><strong>Frontend:</strong> Built with React and TailwindCSS for a smooth, responsive UI.</li>
            <li>
              <strong>Backend:</strong> Powered by Node.js and Express.js for API integration and user authentication.
            </li>
            <li>
              <strong>Database:</strong> MongoDB Atlas stores user data, uploaded sketches, and generated results.
            </li>
            <li>
              <strong>AI Model:</strong> CycleGAN/DiffusionPipeline generates jewelry designs from sketches.
            </li>
          </ul>
        </div>
      </div> */}

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Get Started Today!</h2>
        <p className="text-lg md:text-xl mb-6">
          Upload your first sketch and see the magic of AI bring your designs to life. Click below to start!
        </p>
        <button
          className="px-6 py-3 bg-[#414141] text-white text-lg font-medium rounded-md hover:bg-black transition"
          onClick={() => window.location.href = '/generate'}
        >
          Generate Your Jewelry
        </button>
      </div>
    </div>
  );
}

export default About;