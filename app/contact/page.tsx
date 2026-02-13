'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import { AnimatedLines } from '@/components/FAQ';
import Image from 'next/image';
import { useState } from 'react';
import { Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

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

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
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
      icon: Mail,
      title: 'Email Us',
      details: 'support@cloudbright.com',
      subDetails: 'We reply within 24 hours',
      href: 'mailto:support@cloudbright.com',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Hong Kong',
      subDetails: 'Visit our office by appointment',
      href: '',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      details: 'Available 24/7',
      subDetails: 'Instant support via chat',
      href: '',
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
      answer: 'Yes! We offer custom enterprise solutions for institutional investors. Contact our sales team at support@cloudbright.com for more information.',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden bg-dark-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/contact.webp)' }}
        />
        <div className="absolute inset-0 bg-dark-900/70" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealOnScroll>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-0.5 bg-primary-500" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                Get in Touch
              </span>
              <div className="w-8 h-0.5 bg-primary-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6 text-white leading-tight">
              We&apos;re Here to <span className="text-gradient">Help</span>
            </h1>
            <p className="text-base sm:text-lg text-dark-300 max-w-2xl mx-auto">
              Have questions about our platform? Want to learn more about copy trading?
              Our team of experts is ready to assist you.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact Info Cards — overlaps between hero and main */}
      <section className="relative z-20 -mt-20 md:-mt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <RevealOnScroll key={index} delay={index * 0.1}>
                    <div className="relative p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50 backdrop-blur-sm text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      {info.href ? (
                        <a href={info.href} className="text-gray-900 dark:text-white font-medium mb-1 hover:text-primary-400 transition-colors block">
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          {info.details}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-dark-400">
                        {info.subDetails}
                      </p>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>

      <main className="bg-white dark:bg-dark-900">
        {/* Contact Form & Info */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <AnimatedLines />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-500/8 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <RevealOnScroll>
                <h2 className="text-3xl sm:text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Send Us a <span className="text-gradient">Message</span>
                </h2>
                <p className="text-gray-700 dark:text-dark-300 mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-green-400 font-medium text-sm">
                        Message sent successfully! We&apos;ll get back to you soon.
                      </p>
                    </motion.div>
                  )}
                </form>
              </RevealOnScroll>

              {/* Right column */}
              <div className="space-y-6">
                {/* Social Links */}
                <RevealOnScroll delay={0.1}>
                  <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Connect With Us
                    </h3>
                    <p className="text-gray-700 dark:text-dark-300 text-sm mb-5">
                      Follow us on social media for the latest updates, market insights, and community discussions.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          aria-label={social.name}
                          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center hover:border-primary-500/50 transition-colors duration-300"
                        >
                          <Image
                            src={social.icon}
                            alt={social.name}
                            width={20}
                            height={20}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Office Hours */}
                <RevealOnScroll delay={0.15}>
                  <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Office Hours
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-dark-200 font-medium text-sm">Monday - Friday</span>
                        <span className="text-gray-600 dark:text-dark-400 text-sm">9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-dark-200 font-medium text-sm">Saturday</span>
                        <span className="text-gray-600 dark:text-dark-400 text-sm">10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-dark-200 font-medium text-sm">Sunday</span>
                        <span className="text-gray-600 dark:text-dark-400 text-sm">Closed</span>
                      </div>
                      <div className="pt-3 mt-1 border-t border-gray-200/50 dark:border-dark-700/50">
                        <div className="flex items-center gap-2 text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-medium text-sm">Live Chat: 24/7 Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Quick FAQs */}
                <RevealOnScroll delay={0.2}>
                  <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Quick Answers
                    </h3>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="pb-4 border-b border-gray-200/50 dark:border-dark-700/50 last:border-0 last:pb-0">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1.5 text-sm">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 dark:text-dark-400 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>

                {/* Location */}
                <RevealOnScroll delay={0.25}>
                  <div className="p-6 rounded-2xl border border-gray-200/50 dark:border-dark-700/50 bg-white/80 dark:bg-dark-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 border border-primary-500/20 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cloudbright Limited</h3>
                        <p className="text-gray-600 dark:text-dark-400 text-sm">Hong Kong SAR</p>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
