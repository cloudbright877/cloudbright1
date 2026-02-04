'use client';

import { motion } from 'framer-motion';
import FloatingShapes from './FloatingShapes';

const articles = [
  {
    category: 'AI Trading',
    title: 'How AI Algorithms Predict Crypto Market Movements',
    excerpt: 'Discover the machine learning techniques behind our 97.3% prediction accuracy and how neural networks analyze billions of data points.',
    readTime: '5 min read',
    date: 'Nov 20, 2024',
    image: '📊',
  },
  {
    category: 'Investment Strategy',
    title: '5 Reasons Why Passive Income Is the Future',
    excerpt: 'Learn why smart investors are moving away from active trading to automated AI-driven strategies for consistent returns.',
    readTime: '7 min read',
    date: 'Nov 18, 2024',
    image: '💡',
  },
  {
    category: 'Market Analysis',
    title: 'Crypto Market Trends for 2025: Expert Predictions',
    excerpt: 'Our AI analyzes upcoming trends and identifies the biggest opportunities in the cryptocurrency market for next year.',
    readTime: '6 min read',
    date: 'Nov 15, 2024',
    image: '🔮',
  },
  {
    category: 'Success Stories',
    title: 'From $5,000 to $50,000: Real Investor Journey',
    excerpt: 'Read how Sarah turned her initial investment into life-changing wealth using our AI-powered platform in just 12 months.',
    readTime: '4 min read',
    date: 'Nov 12, 2024',
    image: '🚀',
  },
  {
    category: 'Risk Management',
    title: 'How Our AI Protects Your Capital in Volatile Markets',
    excerpt: 'Deep dive into our sophisticated risk management algorithms that have protected investors through every market downturn.',
    readTime: '8 min read',
    date: 'Nov 10, 2024',
    image: '🛡️',
  },
  {
    category: 'Technology',
    title: 'Behind the Scenes: Building the Perfect Trading Bot',
    excerpt: '5 years of development, thousands of iterations, and billions in trading volume—the story of our AI system.',
    readTime: '10 min read',
    date: 'Nov 8, 2024',
    image: '⚙️',
  },
];

export default function Blog() {
  return (
    <section className="relative py-24 bg-white dark:bg-dark-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(14, 165, 233, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(14, 165, 233, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating 3D shapes */}
      <FloatingShapes
        shapes={[
          {
            src: '/images/glossy-glass-pyramid.png',
            size: 120,
            position: { top: '25%', left: '7%' },
            rotate: 35,
          },
        ]}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Latest <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-dark-200 max-w-3xl mx-auto">
            Stay ahead of the market with expert analysis, AI trading strategies,
            and success stories from our investor community.
          </p>
        </motion.div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="h-full bg-gradient-to-br from-gray-50 dark:from-dark-800 to-gray-100 dark:to-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 hover:border-primary-500/50 transition-all duration-300 overflow-hidden">
                {/* Image placeholder with emoji */}
                <div className="relative h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-7xl">
                  {article.image}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-100 dark:from-dark-900 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/30 rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400 mb-4">
                    {article.category}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-gradient transition-all duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-dark-300 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-400">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Read more indicator */}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:gap-4 transition-all duration-300">
                    Read More
                    <span>→</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-2 border-primary-500/30 rounded-full font-semibold text-lg text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 hover:border-primary-500 transition-all duration-300">
            View All Articles
          </button>
        </motion.div>
      </div>
    </section>
  );
}
