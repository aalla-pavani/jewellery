import React from 'react';
import { Link } from 'react-router-dom';
import exampleImage1 from '../assets/510187FEAAA00_2.jpg';
import exampleImage2 from '../assets/51D3C2DIRABA00_2.jpg';
import exampleImage3 from '../assets/images-3.jpg';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#414141] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl"></div>
        </div>
        <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
          <h1 className="prata-regular text-6xl md:text-7xl text-white mb-8 tracking-tight">
            Sketch to Reality<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              AI Jewelry Creator
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
            Transform your jewelry sketches into stunning visualizations
          </p>
          <div className="flex gap-6 justify-center">
            <Link 
              to="/generate" 
              className="px-8 py-3 bg-white text-gray-900 prata-regular hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              Create Now
            </Link>
            <Link 
              to="/how-it-works" 
              className="px-8 py-3 border border-white text-white prata-regular hover:bg-white/10 transition-all duration-300"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Example Transformations */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="prata-regular text-4xl mb-4">AI Transformations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the power of AI-driven design</p>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {transformationExamples.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={image} 
                    alt="AI Transformation Example"
                    className="w-full h-full object-cover transform group-hover:scale-101 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Link 
                        to="/generate"
                        className="inline-block px-6 py-2 bg-white text-gray-900 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Transform Your Sketch
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#414141] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="prata-regular text-4xl mb-6">
            Start Creating Today
          </h2>
          <p className="text-white/80 mb-10 text-lg">
            Upload your sketch and watch it transform into a stunning visualization
          </p>
          <Link 
            to="/generate" 
            className="inline-block px-10 py-4 bg-white text-gray-900 prata-regular hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Creating
          </Link>
        </div>
      </section>
    </div>
  );
};

const transformationExamples = [exampleImage1, exampleImage2, exampleImage3];

export default Home;