import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiSend, FiTwitter, FiLinkedin, FiInstagram, FiFacebook } from 'react-icons/fi'
import { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    setEmail('')
  }

  return (
    <footer className="bg-white border-t border-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-8 lg:px-24 py-16">
        {/* Newsletter Section */}
        <div className="mb-16 pb-12 border-b border-[#E6E6E6]">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-[#0E0E0E] mb-3">Stay Updated</h3>
            <p className="text-[#6B6B6B] mb-6">
              Get the latest property listings and real estate news delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#E6E6E6] focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#0E0E0E] text-white rounded-xl hover:bg-[#1A1A1A] transition-all flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                Subscribe
                <FiSend className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Urbannest" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
              The modern real estate platform for property owners, agents, and buyers.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2.5 bg-[#F7F7F7] rounded-lg hover:bg-[#0E0E0E] hover:text-white transition-all group"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-[#F7F7F7] rounded-lg hover:bg-[#0E0E0E] hover:text-white transition-all group"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-[#F7F7F7] rounded-lg hover:bg-[#0E0E0E] hover:text-white transition-all group"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2.5 bg-[#F7F7F7] rounded-lg hover:bg-[#0E0E0E] hover:text-white transition-all group"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-[#0E0E0E] mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-[#0E0E0E] mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors inline-block hover:translate-x-1 transition-transform">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-[#0E0E0E] mb-4 uppercase tracking-wider">Contact</h3>
            <div className="space-y-4">
              <a href="mailto:support@urbannest.com" className="flex items-start gap-3 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors group">
                <FiMail className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>support@urbannest.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-start gap-3 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors group">
                <FiPhone className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>150 Feet Ring Road, Rajkot, Gujarat, India 360005</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#E6E6E6] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6B6B6B]">
              © {new Date().getFullYear()} Urbannest. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#6B6B6B]">
              <span className="flex items-center gap-2">
                Made with <span className="text-red-500 animate-pulse">♥</span> for real estate professionals
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer





