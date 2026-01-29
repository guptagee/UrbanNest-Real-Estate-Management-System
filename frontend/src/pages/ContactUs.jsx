import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle, FiClock } from 'react-icons/fi'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success('Thank you for your message! We\'ll get back to you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'support@urbannest.com',
      link: 'mailto:support@urbannest.com'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: FiMapPin,
      title: 'Address',
      value: '150 Feet Ring Road, Rajkot, Gujarat, India 360005',
      link: null
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      value: 'Monday - Friday: 9:00 AM - 6:00 PM',
      link: null
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 border-b border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-4xl">
            <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-6">Contact Us</div>
            <h1 className="text-5xl md:text-6xl font-medium text-[#0E0E0E] leading-tight mb-6 tracking-tight">
              Let's start a conversation.
            </h1>
            <p className="text-xl text-[#6B6B6B] mb-12 leading-relaxed max-w-2xl">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#F7F7F7] rounded-2xl p-8 md:p-12 border border-[#E6E6E6]">
                <h2 className="text-2xl font-medium text-[#0E0E0E] mb-8">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] focus:border-transparent text-[#0E0E0E]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] focus:border-transparent text-[#0E0E0E]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] focus:border-transparent text-[#0E0E0E]"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] focus:border-transparent text-[#0E0E0E]"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#0E0E0E] mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-[#E6E6E6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0E0E0E] focus:border-transparent text-[#0E0E0E] resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#0E0E0E] text-white px-8 py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <FiSend className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-medium text-[#0E0E0E] mb-6">Get in touch</h2>
                  <p className="text-[#6B6B6B] leading-relaxed mb-8">
                    We're here to help. Reach out through any of these channels and we'll get back to you promptly.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#F7F7F7] rounded-lg flex items-center justify-center flex-shrink-0 border border-[#E6E6E6]">
                          <Icon className="w-5 h-5 text-[#0E0E0E]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#6B6B6B] mb-1">{info.title}</div>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-[#0E0E0E] hover:underline block"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <div className="text-[#0E0E0E]">{info.value}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-6 border-t border-[#E6E6E6]">
                  <div className="bg-[#F7F7F7] rounded-lg p-6 border border-[#E6E6E6]">
                    <div className="flex items-start gap-3">
                      <FiMessageCircle className="w-5 h-5 text-[#0E0E0E] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-[#0E0E0E] mb-1">Need immediate assistance?</div>
                        <p className="text-sm text-[#6B6B6B]">
                          Our AI assistant is available 24/7 in the chat widget to help answer your questions instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#F7F7F7] border-y border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-12">
            <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-4">Common Questions</div>
            <h2 className="text-4xl font-medium text-[#0E0E0E] mb-4 leading-tight">
              Frequently asked questions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 border border-[#E6E6E6]">
              <h3 className="text-lg font-medium text-[#0E0E0E] mb-3">How do I list my property?</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                Register as an agent, then use the "Add New Property" feature in your dashboard to create your listing with photos, details, and pricing.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#E6E6E6]">
              <h3 className="text-lg font-medium text-[#0E0E0E] mb-3">Is there a fee to use the platform?</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                Registration and basic property browsing are free. Agent accounts have subscription options for advanced features and analytics.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#E6E6E6]">
              <h3 className="text-lg font-medium text-[#0E0E0E] mb-3">How do I contact a property owner?</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                Use the inquiry form on any property listing page, or send a direct message through the Messages section in your dashboard.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#E6E6E6]">
              <h3 className="text-lg font-medium text-[#0E0E0E] mb-3">Can I schedule property viewings online?</h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                Yes! Click "Book Viewing" on any property detail page to select your preferred date and time. The agent will confirm your booking.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs

