import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src={logo} alt="Logo" className="w-8" />
              <span className="prata-regular text-xl">Jewelry AI</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Transforming your jewelry design vision into reality with AI-powered innovation and artistry.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition-colors"
                >
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="prata-regular text-sm mb-6">Explore</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="prata-regular text-sm mb-6">Legal</h3>
            <ul className="space-y-4">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.url} 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="prata-regular text-sm mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="text-sm text-gray-600">
                <span className="block text-gray-900 mb-1">Email</span>
                contact@jewelryai.com
              </li>
              <li className="text-sm text-gray-600">
                <span className="block text-gray-900 mb-1">Phone</span>
                +1 (555) 123-4567
              </li>
              <li className="text-sm text-gray-600">
                <span className="block text-gray-900 mb-1">Address</span>
                123 Design Street<br />
                San Francisco, CA 94105
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              {new Date().getFullYear()} Jewelry AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {bottomLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.url}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const socialLinks = [
  { url: '#', icon: 'facebook' },
  { url: '#', icon: 'twitter' },
  { url: '#', icon: 'instagram' },
  { url: '#', icon: 'linkedin' }
];

const quickLinks = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Generate', url: '/generate' },
  { name: 'Contact', url: '/contact' }
];

const legalLinks = [
  { name: 'Privacy Policy', url: '/privacy' },
  { name: 'Terms of Service', url: '/terms' },
  { name: 'Cookie Policy', url: '/cookies' }
];

const bottomLinks = [
  { name: 'Privacy', url: '/privacy' },
  { name: 'Terms', url: '/terms' },
  { name: 'Cookies', url: '/cookies' }
];

export default Footer;