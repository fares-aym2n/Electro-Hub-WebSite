import type { FC } from 'react';
import { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { ActivePageView } from '../../types';

interface FooterProps {
  onNavigate: (view: ActivePageView, category?: string) => void;
}

export const Footer: FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#05070c] text-slate-400 text-xs font-mono">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-[#080c16] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold font-['Space_Grotesk'] text-sm">
                Guaranteed Binning
              </div>
              <div className="text-[11px] text-slate-400">Verified silicon frequency</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold font-['Space_Grotesk'] text-sm">
                Same-Day Air Courier
              </div>
              <div className="text-[11px] text-slate-400">Anti-static ESD packaging</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold font-['Space_Grotesk'] text-sm">
                3-Year Direct RMA
              </div>
              <div className="text-[11px] text-slate-400">Zero dead pixel replacement</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold font-['Space_Grotesk'] text-sm">
                256-Bit Encrypted
              </div>
              <div className="text-[11px] text-slate-400">Bank-grade transaction security</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand narrative */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-white tracking-tight">
              CYBER<span className="text-cyan-400">//FORGE</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-sans leading-relaxed max-w-sm">
            The premier compute silicon destination. Dedicated to custom PC builders, competitive
            gamers, simulation engineers, and AI research workstations across the globe.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>OPERATIONAL STATUS: ZERO SUPPLY OUTAGES DETECTED</span>
          </div>
        </div>

        {/* Column 1: Hardware Catalog */}
        <div>
          <div className="text-white font-bold font-['Space_Grotesk'] mb-3 uppercase tracking-wider text-xs">
            Hardware Nodes
          </div>
          <ul className="space-y-2 text-slate-400">
            <li
              onClick={() => onNavigate('catalog', 'Graphics Cards')}
              className="hover:text-cyan-400 cursor-pointer transition"
            >
              PCIe 4.0 & 5.0 GPUs
            </li>
            <li
              onClick={() => onNavigate('catalog', 'Processors')}
              className="hover:text-cyan-400 cursor-pointer transition"
            >
              3D V-Cache Processors
            </li>
            <li
              onClick={() => onNavigate('catalog', 'Motherboards')}
              className="hover:text-cyan-400 cursor-pointer transition"
            >
              Enthusiast Motherboards
            </li>
            <li
              onClick={() => onNavigate('catalog', 'Memory (RAM)')}
              className="hover:text-cyan-400 cursor-pointer transition"
            >
              DDR5 High-Frequency Kits
            </li>
            <li
              onClick={() => onNavigate('catalog', 'Storage (SSD)')}
              className="hover:text-cyan-400 cursor-pointer transition"
            >
              Gen5 NVMe Solid State
            </li>
          </ul>
        </div>

        {/* Column 2: Tools & Architecture */}
        <div>
          <div className="text-white font-bold font-['Space_Grotesk'] mb-3 uppercase tracking-wider text-xs">
            Engineering Tools
          </div>
          <ul className="space-y-2 text-slate-400">
            <li
              onClick={() => onNavigate('builder')}
              className="hover:text-cyan-400 cursor-pointer transition text-cyan-300 flex items-center gap-1"
            >
              <span>PC Rig Builder Tool</span>
              <ArrowRight className="w-3 h-3" />
            </li>
            <li className="hover:text-cyan-400 cursor-pointer transition">
              Wattage & PSU Estimator
            </li>
            <li className="hover:text-cyan-400 cursor-pointer transition">
              PCIe Lane Allocation Map
            </li>
            <li className="hover:text-cyan-400 cursor-pointer transition">
              Motherboard BIOS Depot
            </li>
            <li className="hover:text-cyan-400 cursor-pointer transition">
              RMA Claims Protocol
            </li>
          </ul>
        </div>

        {/* Column 3: Silicon Radar Newsletter */}
        <div>
          <div className="text-white font-bold font-['Space_Grotesk'] mb-3 uppercase tracking-wider text-xs">
            Silicon Radar
          </div>
          <p className="text-[11px] text-slate-400 mb-3 font-sans">
            Instant telemetry notifications when high-demand flagship GPUs and CPUs are restocked.
          </p>

          {subscribed ? (
            <div className="p-2.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>FREQUENCY TUNED: You are on the priority restock list.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="engineer@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#111726] border border-slate-700 rounded-l px-3 py-2 text-xs text-white w-full focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-3 py-2 rounded-r transition"
                >
                  JOIN
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Zero spam. Instant hardware stock signals only.
              </span>
            </form>
          )}
        </div>
      </div>

      {/* Legal & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
        <div>
          © 2026 CYBERFORGE TECHNOLOGIES INC. ALL HARDWARE SERIAL NUMBERS REGISTERED & PROTECTED.
        </div>
        <div className="flex gap-5">
          <span className="hover:text-cyan-400 cursor-pointer">PRIVACY PROTOCOL</span>
          <span className="hover:text-cyan-400 cursor-pointer">TERMS OF SERVICE</span>
          <span className="hover:text-cyan-400 cursor-pointer">WARRANTY SLA</span>
          <span className="hover:text-cyan-400 cursor-pointer">SECURITY DISCLOSURE</span>
        </div>
      </div>
    </footer>
  );
};
