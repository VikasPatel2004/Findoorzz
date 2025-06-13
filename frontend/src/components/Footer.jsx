import React from 'react';
import logo from '../assets/logo.png';

function Footer() {
    return (
        <footer className="bg-[#faf6ec] text-[#333] py-10 mt-8">
            <div className="container mx-auto px-8 md:px-16"> {/* Adjusted padding for larger screens */}
                <div className="flex flex-col md:flex-row md:justify-between md:text-left">
                    <div className="md:w-1/3 mb-6 md:mb-0 ">
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
                    <div className="md:w-1/3 mb-6 md:mb-0 p-4">
                        <h5 className="font-bold text-lg">Quick Links</h5>
                        <ul className="list-none p-0 mt-2">
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Home</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">About</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Services</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">Contact</a></li>
                            <li><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300">FAQs</a></li>
                        </ul>
                    </div>
                    <div className="md:w-1/3 p-4">
                        <h5 className="font-bold text-lg">Contact Us</h5>
                        <p className="mt-2 text-sm">Email: info@yourwebsite.com</p>
                        <p className="text-sm">Phone: +1 234 567 890</p>
                        <h5 className="font-bold text-lg mt-4">Follow Us</h5>
                        <ul className="flex justify-start list-none p-0 mt-2">
                            <li className="mr-3"><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300"><i className="fab fa-facebook-f"></i></a></li>
                            <li className="mr-3"><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300"><i className="fab fa-twitter"></i></a></li>
                            <li className="mr-3"><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300"><i className="fab fa-instagram"></i></a></li>
                            <li className="mr-3"><a href="#" className="text-[#333] hover:text-[#ffcc00] transition duration-300"><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-left mt-4">
                    <p className="text-sm">&copy; {new Date().getFullYear()} Your Website Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
