import React from 'react';
import logo from '../assets/logo.png';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-[#faf6ec] text-[#333] py-10 mt-16">
            <div className="container mx-auto px-8 md:px-16"> {/* Adjusted padding for larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="mb-6 md:mb-0">
                        <div className="flex justify-start items-center space-x-6">
                            <a
                                href="#"
                                className="text-black font-bold text-xl select-none"
                                aria-label="Logo"
                            >
                                <img src={logo} alt="Logo" className="h-30 w-30" /> {/* Increased logo size */}
                            </a>
                        </div>
                        <h5 className="font-bold text-lg mt-4">About Us</h5>
                        <p className="mt-2 text-sm">
                            We are dedicated to helping you find the best PG and hostel accommodations that suit your needs. 
                            Explore our listings and discover your perfect living space.
                        </p>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h5 className="font-bold text-lg">Quick Links</h5>
                        <ul className="list-none p-0 mt-2">
                            <li><a href="/" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Home</a></li>
                            <li><a href="/about" className="text-[#333] hover:text-[#ffcc00] transition duration-300">About</a></li>
                            {/* <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Services</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Contact</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">FAQs</a></li> */}
                        </ul>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h5 className="font-bold text-lg">Legal</h5>
                        <ul className="list-none p-0 mt-2">
                            <li><a href="/privacy" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Privacy Policy</a></li>
                            <li><a href="/terms" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Terms of Service</a></li>
                            <li><a href="/refund-policy" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Refund Policy</a></li>
                            <li><a href="/cancellation-policy" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Cancellation Policy</a></li>
                        </ul>
                    </div>
                    <div className="mb-6 md:mb-0">
                        <h5 className="font-bold text-lg">Contact Us</h5>
                        <p className="mt-2 text-sm">Email: vp0552850@gmail.com</p>
                        <p className="text-sm">Phone: 9826083283</p>
                        <h5 className="font-bold text-lg mt-4">Follow Us</h5>
                        <ul className="flex justify-start list-none p-0 mt-2">
                            <li className="mr-3">
                                <a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300 text-xl" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300 text-xl" aria-label="Twitter">
                                    <FaTwitter />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300 text-xl" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                            </li>
                            <li className="mr-3">
                                <a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300 text-xl" aria-label="LinkedIn">
                                    <FaLinkedinIn />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-left mt-4">
                    <p className="text-sm">&copy; {new Date().getFullYear()} findoorz. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
