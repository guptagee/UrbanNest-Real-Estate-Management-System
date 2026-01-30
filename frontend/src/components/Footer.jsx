import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiSend, FiTwitter, FiLinkedin, FiInstagram, FiFacebook, FiArrowRight } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setSubscribing(true)

    try {
      // TODO: Add API call to subscribe newsletter
      // await api.post('/newsletter/subscribe', { email })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('🎉 Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-24 py-20">
        {/* Newsletter Section */}
        <div className="mb-20 pb-16 border-b border-grey-800">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 font-display">Stay in the Loop</h3>
            <p className="text-grey-400 text-lg mb-8 leading-relaxed">
              Get the latest property listings, market insights, and exclusive deals delivered straight to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="flex-1 relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-grey-500 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-grey-700 bg-grey-800/50 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all text-white placeholder:text-grey-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="px-8 py-4 bg-white text-black rounded-xl hover:bg-grey-100 transition-all flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <FiSend className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6 hover:opacity-80 transition-opacity group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-black font-bold text-xl">U</span>
                </div>
                <span className="text-2xl font-bold font-display">Urbannest</span>
              </div>
            </Link>
            <p className="text-grey-400 leading-relaxed mb-8">
              The modern real estate platform connecting property owners, agents, and buyers across India.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-3 bg-grey-800 rounded-xl hover:bg-white hover:text-black transition-all group"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-grey-800 rounded-xl hover:bg-white hover:text-black transition-all group"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-grey-800 rounded-xl hover:bg-white hover:text-black transition-all group"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-3 bg-grey-800 rounded-xl hover:bg-white hover:text-black transition-all group"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-display">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/properties" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Get Started</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Sign In</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-display">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Contact</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-grey-400 hover:text-white transition-colors inline-flex items-center gap-2 group">
                  <FiArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 font-display">Get in Touch</h3>
            <div className="space-y-5">
              <a href="mailto:support@urbannest.com" className="flex items-start gap-3 text-grey-400 hover:text-white transition-colors group">
                <div className="p-2 bg-grey-800 rounded-lg group-hover:bg-white group-hover:text-black transition-all">
                  <FiMail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-grey-500 mb-1">Email</div>
                  <span className="text-sm">support@urbannest.com</span>
                </div>
              </a>
              <a href="tel:+919876543210" className="flex items-start gap-3 text-grey-400 hover:text-white transition-colors group">
                <div className="p-2 bg-grey-800 rounded-lg group-hover:bg-white group-hover:text-black transition-all">
                  <FiPhone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-grey-500 mb-1">Phone</div>
                  <span className="text-sm">+91 98765 43210</span>
                </div>
              </a>
              <div className="flex items-start gap-3 text-grey-400">
                <div className="p-2 bg-grey-800 rounded-lg">
                  <FiMapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-grey-500 mb-1">Address</div>
                  <span className="text-sm">150 Feet Ring Road, Rajkot, Gujarat 360005</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-grey-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-grey-500 text-sm">
              © {new Date().getFullYear()} Urbannest. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-grey-500">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse text-lg">♥</span>
              <span>for real estate professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* URBANNEST Watermark */}
      <div className="relative h-[300px] bg-black overflow-hidden flex items-center justify-center">
        <h2 className="select-none text-[12vw] font-extrabold leading-none tracking-tight
                 text-transparent bg-clip-text
                 bg-gradient-to-b from-white/20 to-white/0">
          URBANNEST
        </h2>
      </div>

    </footer>
  )
}

export default Footer
