'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@celestian.org',
      subDetails: 'We reply within 24 hours',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: 'Hong Kong',
      subDetails: 'Visit our office by appointment',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      subDetails: 'Instant support via chat',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const socialLinks = [
    { name: 'X (Twitter)', icon: '/social/x.svg', url: '#' },
    { name: 'Telegram', icon: '/social/telegram-app.svg', url: '#' },
    { name: 'YouTube', icon: '/social/youtube.svg', url: '#' },
    { name: 'Instagram', icon: '/social/instagram.svg', url: '#' },
    { name: 'Facebook', icon: '/social/facebook.svg', url: '#' },
  ];

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'sales', label: 'Sales & Partnership' },
    { value: 'compliance', label: 'Compliance & Legal' },
    { value: 'media', label: 'Media & Press' },
  ];

  const faqs = [
    {
      question: 'What are your business hours?',
      answer: 'Our customer support is available 24/7 via live chat and email.',
    },
    {
      question: 'How quickly will I receive a response?',
      answer: 'Email inquiries are typically answered within 24 hours. Live chat provides instant responses for immediate assistance.',
    },
    {
      question: 'Do you offer enterprise solutions?',
      answer: 'Yes! We offer custom enterprise solutions for institutional investors. Contact our sales team at support@celestian.org for more information.',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="bg-white dark:bg-dark-900 pt-20">
        {/* Header Section */}
        <section className="py-20 bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/10 dark:to-accent-500/10 border-b border-gray-200 dark:border-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="text-primary-500 dark:text-primary-400 font-semibold text-sm uppercase tracking-wide">
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-4 mb-6 text-gray-900 dark:text-white">
                We're Here to <span className="text-gradient">Help</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-dark-300 max-w-3xl mx-auto">
                Have questions about our platform? Want to learn more about AI trading? Our team of experts is ready to assist you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 -mt-16 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-200 dark:border-dark-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-black mb-2 text-gray-900 dark:text-white">
                    {info.title}
                  </h3>
                  <p className="text-gray-900 dark:text-white font-semibold mb-1">
                    {info.details}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-dark-300">
                    {info.subDetails}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-gray-900 dark:text-white">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-dark-300 mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-dark-200 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-dark-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 dark:text-dark-200 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-dark-200 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-green-700 dark:text-green-400 font-semibold">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </motion.div>
                  )}
                </form>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Social Links */}
                <div className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 rounded-3xl p-8 border border-primary-500/20">
                  <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
                    Connect With Us
                  </h3>
                  <p className="text-gray-600 dark:text-dark-300 mb-6">
                    Follow us on social media for the latest updates, market insights, and community discussions.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        aria-label={social.name}
                        className="relative group"
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-accent-500/40 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Icon */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <Image
                            src={social.icon}
                            alt={social.name}
                            width={24}
                            height={24}
                            className="transition-all duration-300 group-hover:scale-110"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
                  <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
                    Office Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-dark-200 font-semibold">Monday - Friday</span>
                      <span className="text-gray-600 dark:text-dark-300">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-dark-200 font-semibold">Saturday</span>
                      <span className="text-gray-600 dark:text-dark-300">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-dark-200 font-semibold">Sunday</span>
                      <span className="text-gray-600 dark:text-dark-300">Closed</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-dark-700">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-semibold">Live Chat: 24/7 Available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick FAQs */}
                <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
                  <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">
                    Quick Answers
                  </h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="pb-4 border-b border-gray-200 dark:border-dark-700 last:border-0 last:pb-0">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-dark-300">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Placeholder Section */}
        <section className="py-16 bg-gray-50 dark:bg-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black mb-8 text-center text-gray-900 dark:text-white">
                Our Office Location
              </h2>
              <div className="bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-200 dark:border-dark-700">
                <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                  <div className="text-6xl mb-4">🇭🇰</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Hong Kong</h3>
                  <p className="text-gray-600 dark:text-dark-300 mb-2">
                    <strong className="text-gray-900 dark:text-white">Celestian Limited</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
