import React from 'react';
import { Home, Mail, Phone, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => (
  <footer className="bg-black/90 text-white">
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Home className="h-6 w-6 text-gray-400 mr-2" />
            <h3 className="text-xl font-semibold">RideShare</h3>
          </div>
          <p className="text-gray-400">Making transportation accessible and efficient.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <a href="#" className="flex items-center hover:text-white">
                <Mail className="h-5 w-5 mr-2" />
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-white">
                <Phone className="h-5 w-5 mr-2" />
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:text-white">
                <Home className="h-5 w-5 mr-2" />
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        © 2024 RideShare. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;