import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AITechnology from '@/components/AITechnology';
import StakingPlans from '@/components/StakingPlans';
import Calculator from '@/components/Calculator';
import Blog from '@/components/Blog';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div id="technology">
          <AITechnology />
        </div>
        <div id="pricing">
          <StakingPlans />
        </div>
        <div id="calculator">
          <Calculator />
        </div>
        <div id="blog">
          <Blog />
        </div>
        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
