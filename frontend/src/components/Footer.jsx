import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E6E6E6]">
      <div className="max-w-7xl mx-auto px-8 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Urbannest" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
              The modern real estate platform for property owners, agents, and buyers.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@urbannest.com" className="flex items-center gap-3 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                <FiMail className="w-4 h-4" />
                <span>support@urbannest.com</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                <FiPhone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>150 Feet Ring Road, Rajkot, Gujarat, India 360005</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-medium text-[#0E0E0E] mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-medium text-[#0E0E0E] mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-medium text-[#0E0E0E] mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-[#6B6B6B] hover:text-[#0E0E0E] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E6E6E6] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6B6B6B]">
              © {new Date().getFullYear()} Urbannest. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[#6B6B6B]">
              <span>Made with care for real estate professionals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer





