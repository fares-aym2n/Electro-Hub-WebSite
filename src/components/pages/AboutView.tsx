import type { FC } from 'react';
import { ShieldCheck, Headphones, Truck, Cpu, CheckCircle2 } from 'lucide-react';
import { BackButton } from '../common/BackButton';
import { useNavigation } from '../../context/NavigationContext';

export const AboutView: FC = () => {
  const { navigate } = useNavigation();

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] py-8 lg:py-14 text-[#111111]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-14 space-y-12">
        {/* Back Button */}
        <div>
          <BackButton label="Back to Products" />
        </div>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-[13px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block">
            ABOUT ELECTRO HUB
          </span>
          <h1 className="text-[36px] sm:text-[46px] font-bold text-[#111111] leading-[1.1] tracking-tight">
            Curated electronics engineered for acoustic clarity and modern computing.
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#555555] leading-relaxed">
            Electro Hub was founded to provide audio enthusiasts, creators, and professionals
            with direct access to high-fidelity consumer electronics, computer peripherals, and
            mobile hardware backed by reliable service.
          </p>
        </div>

        {/* Visual Showcase Card */}
        <div className="rounded-3xl bg-[#EEE9E5] border border-[#E5D7CA] p-8 sm:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                Our Purpose & Customer Experience
              </h2>
              <p className="text-sm sm:text-base text-[#444444] leading-relaxed">
                We believe that shopping for technology should be simple, transparent, and dependable.
                From flagship wireless noise-canceling headphones to custom mechanical keyboards and
                high-refresh displays, every product in our catalog is selected based on rigorous standards
                for build quality, acoustic performance, and ergonomic everyday reliability.
              </p>
              <div className="space-y-2 pt-2 text-sm text-[#333333]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49B82] shrink-0" />
                  <span>Real catalog inventory updated directly from official channels</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49B82] shrink-0" />
                  <span>Transparent pricing in Egyptian Pounds (EGP) with zero hidden fees</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C49B82] shrink-0" />
                  <span>Verified customer testimonials and ratings from actual owners</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xs bg-[#FAF6F2] p-4 flex items-center justify-center">
                <img
                  src="/assets/signup-desk.jpg"
                  alt="Modern electronics workspace setup"
                  className="w-full h-auto max-h-[300px] object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Store Values Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-[#111111] tracking-tight">
              Our Core Store Values
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] mt-0.5">
              The foundational standards that guide how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                Product Authenticity
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                All devices and components are sourced directly from authorized regional suppliers with manufacturer coverage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82]">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                Acoustic & Tech Advice
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Our support team understands frequency response, drivers, and device compatibility to provide honest advice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                Safe Packaging
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Rigid, anti-static protective packaging ensures your delicate electronic hardware arrives in pristine factory condition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#C49B82]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111111] uppercase tracking-wider">
                Continuous Evolution
              </h3>
              <p className="text-xs text-[#555555] leading-relaxed">
                Constantly expanding our catalog with the latest releases in personal audio, mobile flagships, and computer tech.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-[#EEE9E5] border border-[#E5D7CA] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#111111]">
              Looking for something specific?
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] mt-1">
              Browse our catalog of electronics or reach out to our team with your inquiries.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('home')}
              className="px-6 py-2.5 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider transition"
            >
              Explore Products
            </button>
            <button
              onClick={() => navigate('contact')}
              className="px-5 py-2.5 rounded-lg bg-transparent border border-[#DFD4C8] hover:bg-[#E5D7CA] text-[#111111] font-bold text-xs uppercase tracking-wider transition"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
