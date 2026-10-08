import { Card } from '../components/Shared';
import { Users, ShieldCheck, BrainCircuit, Activity, ChevronRight, Globe2, Building2, Network } from 'lucide-react';

export default function Ecosystem() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      
      <div className="text-center max-w-3xl mx-auto pt-6">
        <h1 className="text-4xl font-extrabold text-navy mb-4">
          From verified individual to a thriving, connected <span className="text-teal">talent ecosystem.</span>
        </h1>
        <p className="text-xl text-gray-500">
          The global trust layer powering the future of work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center border-t-4 border-t-blue-500">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-navy mb-1">24,856</h3>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Verified Talent</p>
          <p className="text-xs font-bold text-teal bg-teal-50 inline-block px-2 py-1 rounded">+18% this month</p>
        </Card>

        <Card className="text-center border-t-4 border-t-teal">
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-navy mb-1">12,430</h3>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Live Verifications</p>
          <p className="text-xs font-bold text-gray-500 bg-gray-100 inline-block px-2 py-1 rounded">Today</p>
        </Card>

        <Card className="text-center border-t-4 border-t-indigo-500">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-1">AI Intelligence</h3>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Verification Engine</p>
          <p className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">98% confidence &middot; Low Risk</p>
        </Card>

        <Card className="border-t-4 border-t-amber-500">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Skills in Demand</p>
          <div className="space-y-3 w-full">
            <div>
              <div className="flex justify-between text-xs font-bold text-navy mb-1">
                <span>AI & Data</span><span>72%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-amber-500 rounded-full w-[72%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-navy mb-1">
                <span>Cybersecurity</span><span>64%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full"><div className="h-full bg-amber-500 rounded-full w-[64%]"></div></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Central Diagram */}
      <div className="py-12 relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-xl mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-teal-50/50 to-indigo-50/50"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center max-w-4xl mx-auto gap-8 md:gap-0">
          
          <div className="flex-1 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-2 border-blue-100 flex items-center justify-center text-blue-600 z-10 relative">
              <Users className="w-10 h-10" />
              <div className="absolute -right-2 -bottom-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white"><ShieldCheck className="w-3 h-3" /></div>
            </div>
            <h3 className="text-lg font-bold text-navy mt-4 text-center">Verified Candidates</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Globally distributed<br/>pre-vetted talent</p>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center relative">
            <div className="absolute w-full h-1 bg-gradient-to-r from-blue-200 via-teal-400 to-indigo-200 top-1/2 -translate-y-1/2 z-0"></div>
            <ChevronRight className="w-8 h-8 text-teal bg-white rounded-full z-10 absolute left-1/4 -translate-x-1/2" />
            <ChevronRight className="w-8 h-8 text-teal bg-white rounded-full z-10 absolute right-1/4 translate-x-1/2" />
            
            <div className="w-40 h-40 bg-navy rounded-3xl shadow-2xl flex flex-col items-center justify-center text-white z-10 transform scale-110 border-4 border-white">
              <Network className="w-12 h-12 text-teal-400 mb-2" />
              <span className="font-bold text-center leading-tight tracking-wide">PROOFPASS<br/><span className="text-teal-400 text-sm">TRUST LAYER</span></span>
            </div>
          </div>

          <div className="flex md:hidden flex-col items-center py-4">
            <div className="w-1 h-16 bg-gradient-to-b from-blue-200 to-teal-400"></div>
            <div className="w-40 h-40 bg-navy rounded-3xl shadow-xl flex flex-col items-center justify-center text-white border-4 border-white my-4">
              <Network className="w-12 h-12 text-teal-400 mb-2" />
              <span className="font-bold text-center leading-tight tracking-wide">PROOFPASS<br/><span className="text-teal-400 text-sm">TRUST LAYER</span></span>
            </div>
            <div className="w-1 h-16 bg-gradient-to-b from-teal-400 to-indigo-200"></div>
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg border-2 border-indigo-100 flex items-center justify-center text-indigo-600 z-10">
              <Building2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-navy mt-4 text-center">Employers & AI</h3>
            <p className="text-sm text-gray-500 text-center mt-1">Enterprise systems<br/>and marketplaces</p>
          </div>

        </div>

        <div className="text-center mt-16 relative z-10">
          <p className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
            Every talent. Every credential. Every opportunity.
          </p>
          <p className="text-xl font-bold text-teal mt-2">
            Connected. Verified. Trusted.
          </p>
        </div>
      </div>

    </div>
  );
}
