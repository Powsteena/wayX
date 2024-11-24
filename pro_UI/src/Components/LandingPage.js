import React, { useState } from 'react';
import logo from '../Images/log.png';
import video from '../Images/bg.mp4'
import { useNavigate } from 'react-router-dom';
import ModalLogin from './LoginForm';
import ModalRegister from './RegisterForm';
import {
  Home,
  Info,
  Phone,
  LogIn,
  Menu,
  X,
  Car,
  MapPin,
  User,
  DollarSign,
  Mail,
  Clock,
  Shield,
  Users,
  PhoneCall,
  MapPinned,
  Send,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';


const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const navigate = useNavigate();

  const navItems = [
    { href: "#home", label: "Home", icon: <Home size={20} /> },
    { href: "#about", label: "About", icon: <Info size={20} /> },
    { href: "#services", label: "Services", icon: <Car size={20} /> },
    { href: "#contact", label: "Contact", icon: <Phone size={20} /> },
  ];

  const handlePublishRide = () => {
    const isDriverRegistered = localStorage.getItem('userRole') === 'driver';
    navigate(isDriverRegistered ? '/go-ride' : '/driver-register');
  };

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  const services = [
    {
      icon: <Car size={32} />,
      title: "Daily Commute",
      description: "Regular rides for your daily commute to work or college. Save money and travel comfortably.",
      features: ["Fixed schedule rides", "Verified co-passengers", "Cost-effective", "Flexible pickup points"]
    },
    {
      icon: <Clock size={32} />,
      title: "One-Time Rides",
      description: "Perfect for occasional trips or one-time journey requirements.",
      features: ["Instant booking", "Choose your vehicle", "Door-to-door service", "24/7 support"]
    },
    // {
    //   icon: <Shield size={32} />,
    //   title: "Corporate Travel",
    //   description: "Specialized service for businesses and corporate employees.",
    //   features: ["Corporate billing", "Employee tracking", "Dedicated support", "Custom travel policies"]
    // },
    {
      icon: <Users size={32} />,
      title: "Group Rides",
      description: "Share rides with people heading in the same direction.",
      features: ["Split costs", "Meet new people", "Reduce carbon footprint", "Community building"]
    }
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    type: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setFormStatus({
          type: 'success',
          message: 'Message sent successfully! We will get back to you soon.'
        });
        // Clear form
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setFormStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Now with gradient and glass effect */}
      {/* <nav className="fixed w-full z-50 bg-gradient-to-r from-yellow-600/10 to-orange-500/10 backdrop-blur-md border-b border-white/10"> */}
      <nav className="bg-white backdrop-blur-sm fixed w-full shadow-lg z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-12" />
            </a>

            <div className="hidden lg:flex items-center justify-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-800 hover:text-yellow-600 flex items-center space-x-2 transition-colors duration-200 font-medium relative group"
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-600 transition-all duration-300"></span>
                </a>
              ))}
              <a
                onClick={openLoginModal}
                className="bg-yellow-600 text-white px-2 py-2 rounded-full flex items-center  space-x-2 hover:from-yellow-600 transition-all duration-300 transform hover:scale-105 font-medium cursor-pointer"
              >
                <LogIn size={20} />
                <span>Login</span>
              </a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-800 hover:text-yellow-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu with gradient background */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-white/10 bg-gradient-to-b from-yellow-50 to-orange-50">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-800 hover:text-yellow-600 flex items-center space-x-2 py-3 px-4 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
              <a
                href="/login"
                className="bg-gradient-to-r from-yellow-600 to-orange-500 text-white mx-4 mt-4 px-2 py-1 rounded-full flex items-center space-x-2 justify-center hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                <LogIn size={20} />
                <span>Login</span>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <div className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-black/70 z-10"></div>
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Your Journey, <span className="text-yellow-500">Our Priority</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Whether you're a passenger looking for a ride or a driver ready to earn,
              we've got you covered. Join our community today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={openRegisterModal}
                className="bg-yellow-600 text-white px-6 py-1 rounded-full hover:bg-black transition-colors duration-200 font-medium text-lg"
              >
                Book a Ride
              </button>
              <button
                onClick={handlePublishRide}
                className="bg-white text-yellow-600 px-8 py-4 rounded-full hover:bg-black/90 transition-colors duration-200 font-medium text-lg"
              >
                Become a Driver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About section with features */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-yellow-600 mx-auto rounded-full"></div>
          </div>


          {/* Features Grid */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <MapPin size={32} />, title: "Easy Booking", text: "Book your ride in just a few taps" },
              { icon: <User size={32} />, title: "Verified Drivers", text: "All our drivers are verified" },
              { icon: <Car size={32} />, title: "Safe Journey", text: "Your safety is our top priority" },
              { icon: <DollarSign size={32} />, title: "Best Rates", text: "Competitive and transparent pricing" }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="inline-block p-4 rounded-full bg-yellow-50 text-yellow-600 mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-black">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Services Section with Flexbox for consistent card alignment */}
<section id="services" className="py-20 bg-black/50">
  <div className="container mx-auto px-6 lg:px-12">
    {/* Section Header */}
    <div className="text-center mb-20">
      <h2 className="text-4xl font-bold text-black mb-4">Our Services</h2>
      <p className="text-black/80 font-bold max-w-2xl mx-auto text-lg">
        Explore our wide range of transportation solutions, crafted to fit your needs.
      </p>
      <div className="w-20 h-1 bg-yellow-500 mx-auto rounded-full mt-4"></div>
    </div>

    {/* Flexbox for Cards */}
    <div className="flex flex-wrap justify-between gap-6">
      {services.map((service, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl p-8 shadow-lg w-full md:w-[30%] transform hover:-translate-y-2 hover:shadow-xl transition-transform duration-300 group overflow-hidden"
        >
          {/* Decorative Corner Element */}
          <div className="absolute top-0 left-0 w-12 h-12 bg-yellow-100 rounded-br-full transform -translate-x-6 -translate-y-6"></div>

          {/* Icon */}
          <div className="flex justify-center items-center mb-6">
            <div className="p-4 bg-yellow-50 rounded-full">
              <div className="text-yellow-600">
                {service.icon}
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-2xl font-semibold text-black mb-4 group-hover:text-yellow-600 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-black mb-6">
            {service.description}
          </p>

          {/* Features List */}
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-black">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Decorative Gradient Line */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 group-hover:h-2"></div>
        </div>
      ))}
    </div>
  </div>

  {/* Subtle Background Decorations */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-100 opacity-30 rounded-full filter blur-3xl -z-10"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 opacity-20 rounded-full filter blur-3xl -z-10"></div>
</section>






      {/* Contact Section with mesh gradient background */}
      <section id="contact" className="py-20 relative bg-gray-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-black/90 font-bold max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-white hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h3>

                <div className="space-y-6">
                  {/* Contact details remain the same but with enhanced styling */}
                  <div className="flex items-start space-x-5 group">
                    <div className="text-yellow-600 mt-1 transition-transform duration-300 group-hover:scale-110">
                      <PhoneCall size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Phone</h4>
                      <p className="text-gray-600">+1 (555) 000-0000</p>
                      <p className="text-gray-600">Mon-Fri 9am-6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="text-yellow-600 mt-1 transition-transform duration-300 group-hover:scale-110">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Email</h4>
                      <p className="text-gray-600">support@wayx.com</p>
                      <p className="text-gray-600">24/7 Online Support</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <div className="text-yellow-600 mt-1 transition-transform duration-300 group-hover:scale-110">
                      <MapPinned size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Office</h4>
                      <p className="text-gray-600">123 Business Avenue</p>
                      <p className="text-gray-600">Jaffna, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form with enhanced styling */}
<div className="lg:col-span-2">
  <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white">
    {formStatus.message && (
      <div className={`mb-6 p-4 rounded-lg ${
        formStatus.type === 'success' 
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}>
        <p className="font-medium">
          {formStatus.type === 'success' ? 'Success!' : 'Error!'}
        </p>
        <p className="text-sm">
          {formStatus.message}
        </p>
      </div>
    )}

    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="group">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
          placeholder="John Doe"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
          placeholder="john@example.com"
          required
        />
      </div>
    </div>

    <div className="mb-6">
      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
        Subject
      </label>
      <input
        type="text"
        id="subject"
        value={formData.subject}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
        placeholder="How can we help?"
        required
      />
    </div>

    <div className="mb-6">
      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
        Message
      </label>
      <textarea
        id="message"
        value={formData.message}
        onChange={handleChange}
        rows="4"
        className="w-full px-4 py-3 rounded-lg bg-white/50 border border-gray-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 outline-none transition-all resize-none"
        placeholder="Your message here..."
        required
      ></textarea>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full bg-gradient-to-r from-yellow-600 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 font-medium ${
        isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      <Send size={20} />
      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
    </button>
  </form>
</div>
          </div>
        </div>
      </section>

      {/* Footer with gradient background */}
      <footer className="bg-black/90 text-white">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-xl font-semibold">wayX</h3>
              </div>
              <p className="text-gray-400">Making transportation accessible and efficient.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#about" className="flex items-center hover:text-white">
                    <Mail className="h-5 w-5 mr-2" />
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="flex items-center hover:text-white">
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
            © 2024 wayX. All rights reserved.
          </div>
        </div>
      </footer>
      <ModalLogin
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={openRegisterModal}
      />
      <ModalRegister
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={openLoginModal}
      />
    </div>
  );
};

export default LandingPage;