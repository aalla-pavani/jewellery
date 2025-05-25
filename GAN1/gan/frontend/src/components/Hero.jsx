import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import img from '../assets/image.png';

function Hero() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleClick = () => {
    navigate('/generate'); // Navigate to the "/generate" route
  };

  return (
    <div
      className="flex flex-col md:flex-row items-center border border-gray-300 bg-[#fafafa] cursor-pointer"
      style={{ marginTop: '16px' }} // Add 16px space above the page
      onClick={handleClick} // Navigate when clicking the entire component
    >
      {/* Left Side - Text Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-8 py-8 md:py-16 text-[#414141]">
        <div className="flex items-center gap-2">
          <div className="w-8 md:w-11 h-[2px] bg-[#414141]"></div>
          <p className="font-medium text-sm md:text-base uppercase tracking-wide">Generate</p>
        </div>
        <h1 className="prata-regular text-4xl md:text-5xl lg:text-6xl leading-tight mt-4">
          Jewellery
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <p className="font-semibold text-base md:text-lg">using AI</p>
          <div className="w-8 md:w-11 h-[1px] bg-[#414141]"></div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative px-4 md:px-8">
        <img
          src={img}
          alt="Jewelry Transformation"
          className="w-full md:w-10/12 max-w-lg rounded-md shadow-lg"
        />
      </div>
    </div>
  );
}

export default Hero;