import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiTrendingUp, FiShield, FiTarget, FiHeart } from 'react-icons/fi'

const AboutUs = () => {
  const values = [
    {
      icon: FiUsers,
      title: 'People First',
      description: 'We believe in building lasting relationships. Every interaction matters, and we\'re committed to making your real estate journey smooth and enjoyable.'
    },
    {
      icon: FiShield,
      title: 'Trust & Transparency',
      description: 'Honesty is at the core of everything we do. We provide clear, accurate information and maintain the highest standards of integrity.'
    },
    {
      icon: FiTrendingUp,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to simplify real estate transactions and make property management effortless for everyone.'
    },
    {
      icon: FiHeart,
      title: 'Excellence',
      description: 'We strive for perfection in every detail, ensuring our platform delivers exceptional value to property owners, agents, and buyers alike.'
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Real estate veteran with 15+ years of experience transforming the industry.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech innovator passionate about building platforms that truly serve users.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Operations',
      bio: 'Operations expert ensuring seamless experiences across all touchpoints.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Properties Listed' },
    { number: '25K+', label: 'Successful Transactions' },
    { number: '500+', label: 'Trusted Agents' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 border-b border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-4xl">
            <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-6">About Us</div>
            <h1 className="text-5xl md:text-6xl font-medium text-[#0E0E0E] leading-tight mb-6 tracking-tight">
              Building the future of real estate.
            </h1>
            <p className="text-xl text-[#6B6B6B] mb-12 leading-relaxed max-w-2xl">
              Urbannest was born from a simple idea: real estate should be accessible, transparent, and effortless for everyone. 
              We're on a mission to transform how people discover, manage, and transact properties.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#F7F7F7] border-b border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-medium text-[#0E0E0E] mb-2">{stat.number}</div>
                <div className="text-sm text-[#6B6B6B]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-4">Our Mission</div>
              <h2 className="text-4xl font-medium text-[#0E0E0E] mb-6 leading-tight">
                Making real estate accessible to everyone.
              </h2>
              <p className="text-lg text-[#6B6B6B] mb-6 leading-relaxed">
                We believe that finding, buying, selling, or renting property shouldn't be complicated. 
                Our platform brings together property owners, agents, and buyers in one seamless ecosystem.
              </p>
              <p className="text-lg text-[#6B6B6B] leading-relaxed">
                Through intelligent technology and human-centered design, we're creating a real estate 
                experience that's intuitive, efficient, and trustworthy.
              </p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-12 border border-[#E6E6E6]">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-[#0E0E0E] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0E0E0E] mb-2">Empower Property Owners</h3>
                    <p className="text-[#6B6B6B]">Give property owners powerful tools to manage and showcase their listings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-[#0E0E0E] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0E0E0E] mb-2">Support Agents</h3>
                    <p className="text-[#6B6B6B]">Provide agents with the tools they need to succeed and grow their business.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-[#0E0E0E] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-lg font-medium text-[#0E0E0E] mb-2">Delight Buyers</h3>
                    <p className="text-[#6B6B6B]">Make property discovery and purchasing an enjoyable, stress-free experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#F7F7F7] border-y border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-16">
            <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-4">Our Values</div>
            <h2 className="text-4xl font-medium text-[#0E0E0E] mb-4 leading-tight">
              What drives us forward.
            </h2>
            <p className="text-lg text-[#6B6B6B]">
              These core principles guide every decision we make and every feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white rounded-2xl p-8 border border-[#E6E6E6] hover:border-[#0E0E0E] transition-colors">
                  <div className="w-12 h-12 bg-[#0E0E0E] rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[#0E0E0E] mb-3">{value.title}</h3>
                  <p className="text-[#6B6B6B] leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl mb-16">
            <div className="text-sm font-medium text-[#6B6B6B] uppercase tracking-wider mb-4">Our Team</div>
            <h2 className="text-4xl font-medium text-[#0E0E0E] mb-4 leading-tight">
              The people behind Urbannest.
            </h2>
            <p className="text-lg text-[#6B6B6B]">
              A diverse team of experts passionate about transforming real estate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-[#F7F7F7] rounded-2xl p-8 border border-[#E6E6E6]">
                <div className="w-16 h-16 bg-[#0E0E0E] rounded-full mb-6 flex items-center justify-center">
                  <span className="text-white text-xl font-medium">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-medium text-[#0E0E0E] mb-1">{member.name}</h3>
                <div className="text-sm text-[#6B6B6B] mb-4">{member.role}</div>
                <p className="text-[#6B6B6B] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0E0E0E] border-t border-[#E6E6E6]">
        <div className="max-w-7xl mx-auto px-8 lg:px-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 leading-tight">
              Join us on this journey.
            </h2>
            <p className="text-xl text-[#B3B3B3] mb-8 leading-relaxed">
              Whether you're looking to buy, sell, or manage properties, we're here to help you succeed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/properties"
                className="bg-white text-[#0E0E0E] px-6 py-3 rounded-lg hover:bg-[#F7F7F7] transition-colors text-sm font-medium inline-flex items-center gap-2"
              >
                Explore Properties
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="text-white px-6 py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors text-sm font-medium border border-[#333333]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs

