import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import profile from '../assets/profile.jpg';
import menu from '../assets/menu.png';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className='flex items-center justify-between py-5 font-sans font-medium text-gray-700'>
            <Link to='/' className="flex items-center mb-3">
                <img src={logo} className="w-28 h-auto" alt="logo" /> 
            </Link>
            <ul className='hidden sm:flex gap-5 text-sm'>
                <NavLink to="/" className='navbar-heading flex flex-col items-center gap-1'>
                    <p className="font-italian">Home</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
                </NavLink>
                <NavLink to="/generate" className='navbar-heading flex flex-col items-center gap-1'>
                    <p className="font-italian">Generate</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
                </NavLink>
                <NavLink to="/about" className='navbar-heading flex flex-col items-center gap-1'>
                    <p className="font-italian">About</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
                </NavLink>
                <NavLink to="/contact" className='navbar-heading flex flex-col items-center gap-1'>
                    <p className="font-italian">Contact</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
                </NavLink>
            </ul>

            <div className='flex items-center gap-6'>
                {/* Profile Icon with Dropdown */}
                <div className='relative'>
                    <div 
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className='cursor-pointer'
                    >
                        <img src={profile} alt="Profile" className='w-6'/>
                    </div>
                    
                    {/* Profile Dropdown */}
                    {showProfileDropdown && (
                        <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
                            <Link 
                                to="/profile" 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setShowProfileDropdown(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setShowProfileDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <img 
                    onClick={() => setVisible(!visible)} 
                    src={menu} 
                    alt="Menu" 
                    className='w-6 cursor-pointer sm:hidden'
                />
            </div>

            {/* Mobile Menu */}
            {visible && (
                <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
                    <div className="p-4">
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setVisible(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex flex-col gap-4 mt-4">
                            <Link 
                                to="/" 
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setVisible(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/generate" 
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setVisible(false)}
                            >
                                Generate
                            </Link>
                            <Link 
                                to="/about" 
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setVisible(false)}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contact" 
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setVisible(false)}
                            >
                                Contact
                            </Link>
                            <Link 
                                to="/profile" 
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => setVisible(false)}
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setVisible(false);
                                }}
                                className="text-red-600 hover:text-red-700 text-left"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;