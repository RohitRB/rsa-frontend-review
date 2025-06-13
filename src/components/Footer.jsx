import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
            <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Kalyan Enterprise</h2>
                    <p className="text-sm">Provide an service for customers in emergency situations</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="https://kalyanworkshop.in/" className="hover:underline">Home</a></li>
                        <li><a href="https://kalyanworkshop.in/contact-us/" className="hover:underline">Contact</a></li>
                        <li><Link to="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">Blog</a></li>
                        <li><a href="#" className="hover:underline">Docs</a></li>
                        <li><a href="#" className="hover:underline">Support</a></li>
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-white">🌐</a>
                        <a href="#" className="hover:text-white">🐦</a>
                        <a href="#" className="hover:text-white">📸</a>
                        <a href="#" className="hover:text-white">👔</a>
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500 px-4">
                © {new Date().getFullYear()} — Designed by{" "}
                <a 
                    href="https://www.thegrowinggraph.online" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                >
                    The Growing Graph
                </a>
            </div>
        </footer>
    );
};

export default Footer;
