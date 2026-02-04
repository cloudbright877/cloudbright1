'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Section {
  title: string;
  content: string | string[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: Section[];
}

export default function LegalPage({ title, lastUpdated, effectiveDate, sections }: LegalPageProps) {
  return (
    <>
      <Navbar />

      <main className="bg-white dark:bg-dark-900 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-gray-600 dark:text-dark-300">
              <div>
                <span className="font-semibold">Last Updated:</span> {lastUpdated}
              </div>
              <div className="hidden sm:block">•</div>
              <div>
                <span className="font-semibold">Effective Date:</span> {effectiveDate}
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  {index + 1}. {section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 dark:text-dark-200 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700 dark:text-dark-200 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </motion.section>
            ))}
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 rounded-2xl border border-primary-500/20"
          >
            <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              Questions or Concerns?
            </h3>
            <p className="text-gray-700 dark:text-dark-200 mb-4">
              If you have any questions about this document, please contact our legal team:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-dark-200">
              <p>
                <strong>Email:</strong> support@celestian.org
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
