'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RevealOnScroll } from '@/components/animations/RevealOnScroll';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.id as string;
  const post = blogPosts.find((p) => p.slug === slug || p.id === Number(slug));

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="bg-dark-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-semibold text-white mb-4">Article Not Found</h1>
            <p className="text-dark-300 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug || p.id === Number(slug));
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);
  if (relatedPosts.length < 3) {
    const extra = blogPosts
      .filter((p) => p.slug !== slug && !relatedPosts.find((r) => r.id === p.id))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...extra);
  }

  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  return (
    <>
      <Navbar />

      <main className="bg-dark-900">
        {/* ══════════ HERO ══════════ */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-[0.08]`} />
          <div className="absolute inset-0 bg-dark-900/80" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-900 to-transparent z-[1]" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-dark-300 hover:text-primary-400 transition-colors mb-8 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${post.gradient} rounded-full text-white text-xs font-bold`}>
                  {post.category}
                </span>
                <span className="text-dark-400 text-sm">{post.readTime} read</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-8">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-dark-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-400" />
                  <span className="font-medium text-dark-200">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ══════════ COVER IMAGE ══════════ */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
            <div className="rounded-2xl overflow-hidden border border-dark-700/50 shadow-2xl shadow-black/30">
              <img src={post.coverImage} alt={post.title} className="w-full h-auto" />
            </div>
          </div>
        )}

        {/* ══════════ ARTICLE CONTENT ══════════ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
              <RevealOnScroll>
                <article className="prose prose-invert max-w-none">
                  {post.content.map((block, index) => {
                    if (block.type === 'heading') {
                      return (
                        <motion.h2
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4 }}
                          className="text-2xl font-semibold text-white mt-10 mb-4"
                        >
                          {block.text}
                        </motion.h2>
                      );
                    }
                    return (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="text-dark-200 leading-relaxed mb-5 text-[15px]"
                      >
                        {block.text}
                      </motion.p>
                    );
                  })}
                </article>

                {/* Share / Tags divider */}
                <div className="mt-12 pt-8 border-t border-dark-700/50">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium text-dark-400">Tags:</span>
                    <span className={`px-3 py-1 bg-gradient-to-r ${post.gradient} rounded-full text-white text-xs font-bold`}>
                      {post.category}
                    </span>
                    <span className="px-3 py-1 bg-dark-800 border border-dark-700/50 rounded-full text-dark-300 text-xs font-medium">
                      Crypto
                    </span>
                    <span className="px-3 py-1 bg-dark-800 border border-dark-700/50 rounded-full text-dark-300 text-xs font-medium">
                      Trading
                    </span>
                  </div>
                </div>
              </RevealOnScroll>

            </div>
          </div>
        </section>

        {/* ══════════ PREV / NEXT NAV ══════════ */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`}>
                  <div className="group p-5 rounded-2xl border border-dark-700/50 bg-dark-800/50 hover:border-primary-500/30 transition-all">
                    <p className="text-xs text-dark-400 mb-2 flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </p>
                    <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {prevPost.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`}>
                  <div className="group p-5 rounded-2xl border border-dark-700/50 bg-dark-800/50 hover:border-primary-500/30 transition-all text-right">
                    <p className="text-xs text-dark-400 mb-2 flex items-center justify-end gap-1">
                      Next <ArrowRight className="w-3 h-3" />
                    </p>
                    <p className="text-sm font-medium text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                      {nextPost.title}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ══════════ RELATED ARTICLES ══════════ */}
        <section className="py-16 border-t border-dark-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-8 h-0.5 bg-primary-500" />
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary-400">
                  Related Articles
                </span>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Link href={`/blog/${related.slug}`}>
                    <div className="group relative h-full rounded-2xl bg-dark-800/50 border border-dark-700/50 overflow-hidden hover:border-primary-500/30 transition-all duration-500 flex flex-col">
                      <div className={`absolute inset-0 bg-gradient-to-br ${related.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

                      <div className="relative h-40 bg-dark-800 overflow-hidden">
                        {related.coverImage ? (
                          <img src={related.coverImage} alt={related.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <>
                            <div className={`absolute inset-0 bg-gradient-to-br ${related.gradient} opacity-15 group-hover:opacity-25 transition-opacity duration-500`} />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative z-10 p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r ${related.gradient} rounded-full text-white text-[10px] font-bold uppercase tracking-wider`}>
                            {related.category}
                          </span>
                          <span className="text-[11px] text-dark-500">{related.readTime}</span>
                        </div>
                        <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-primary-400 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-dark-300 line-clamp-2 flex-1 mb-3">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
                          <span className="text-xs font-semibold text-dark-200">{related.author}</span>
                          <span className="text-xs text-dark-500">{related.date}</span>
                        </div>
                      </div>

                      <div className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${related.gradient} transition-all duration-700`} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
