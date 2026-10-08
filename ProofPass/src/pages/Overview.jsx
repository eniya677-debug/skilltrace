import { useState } from 'react';
import { Card, VerifiedBadge } from '../components/Shared';
import { ShieldCheck, AlertTriangle, AlertCircle, FileX, Clock, Ban, CheckCircle2, Search, Zap } from 'lucide-react';

export default function Overview() {
  const [showVerified, setShowVerified] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">
          From fragmented data to <span className="text-teal">verified digital identity.</span>
        </h1>
        <p className="text-xl text-gray-500">
          The all-in-one verification platform that turns resumes into cryptographic truth.
        </p>
      </div>

      {/* Stats Chips */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="bg-white border border-gray-200 shadow-sm rounded-full px-6 py-3 flex items-center">
          <ShieldCheck className="w-5 h-5 text-teal mr-2" />
          <span className="font-semibold text-navy">24,856 Verified Professionals</span>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-full px-6 py-3 flex items-center">
          <Zap className="w-5 h-5 text-amber-500 mr-2" />
          <span className="font-semibold text-navy">85% Faster Verification</span>
        </div>
        <div className="bg-white border border-gray-200 shadow-sm rounded-full px-6 py-3 flex items-center">
          <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-semibold text-navy">99% Verification Accuracy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
        {/* Left Card: The Recruiter's Gap */}
        <Card className="flex flex-col h-full bg-slate-50 border-0 shadow-inner">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-navy mb-2 flex items-center">
              <Search className="w-6 h-6 mr-2 text-gray-400" />
              The Recruiter's Verification Gap
            </h2>
            <p className="text-gray-500">Traditional hiring relies on trust without proof.</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-amber-500 mr-3 mt-0.5 shrink-0" />
              <p className="text-gray-700"><strong>Time-consuming manual checks</strong><br/><span className="text-sm text-gray-500">Weeks spent calling past employers and schools.</span></p>
            </div>
            <div className="flex items-start">
              <FileX className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0" />
              <p className="text-gray-700"><strong>Unreliable references</strong><br/><span className="text-sm text-gray-500">Biased or unresponsive contacts slowing you down.</span></p>
            </div>
            <div className="flex items-start">
              <Ban className="w-5 h-5 text-rose-600 mr-3 mt-0.5 shrink-0" />
              <p className="text-gray-700"><strong>Risk of bad hires</strong><br/><span className="text-sm text-gray-500">Embellished resumes costing companies thousands.</span></p>
            </div>
          </div>

          <div className="mt-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-bl-lg">HIGH RISK</div>
            <h4 className="font-bold text-gray-900 text-lg mb-4">Candidate: Alex Morgan</h4>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm p-2 bg-red-50 text-red-800 rounded border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> Education Mismatch
              </div>
              <div className="flex items-center text-sm p-2 bg-amber-50 text-amber-800 rounded border border-amber-100">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" /> Reference No Response
              </div>
              <div className="flex items-center text-sm p-2 bg-gray-50 text-gray-700 rounded border border-gray-200">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0 text-gray-400" /> Unverified Experience
              </div>
              <div className="flex items-center text-sm p-2 bg-red-50 text-red-800 rounded border border-red-100">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> Expired Certificate
              </div>
              <div className="flex items-center text-sm p-2 bg-amber-50 text-amber-800 rounded border border-amber-100">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" /> Employment dates mismatch (2022-2021)
              </div>
            </div>
          </div>
        </Card>

        {/* Right Card: After ProofPass */}
        <Card className="flex flex-col h-full border-t-4 border-t-teal shadow-lg">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-2 flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2 text-teal" />
                With ProofPass
              </h2>
              <p className="text-gray-500">Immutable truth at the click of a button.</p>
            </div>
            
            <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
              <button 
                onClick={() => setShowVerified(false)}
                className={`px-4 py-1.5 rounded-md transition-all ${!showVerified ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Before
              </button>
              <button 
                onClick={() => setShowVerified(true)}
                className={`px-4 py-1.5 rounded-md transition-all ${showVerified ? 'bg-teal shadow text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                After
              </button>
            </div>
          </div>

          <div className="mt-auto transition-all duration-300 relative h-[360px]">
            {/* Unverified View (Before) */}
            <div className={`absolute inset-0 bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-opacity duration-300 ${showVerified ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-bl-lg">PENDING</div>
              <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center">
                Alex Morgan <span className="ml-2 text-xs font-normal text-gray-500">Senior Data Analyst</span>
              </h4>
              
              <div className="space-y-4 text-sm">
                <div className="opacity-50">
                  <p className="font-semibold text-gray-800">Education</p>
                  <p className="text-gray-500">M.S. Data Science, Stanford Univ. (Awaiting transcript)</p>
                </div>
                <div className="opacity-50">
                  <p className="font-semibold text-gray-800">Experience</p>
                  <p className="text-gray-500">Acme Corp 2019-2022 (HR unreachable)</p>
                </div>
                <div className="opacity-50">
                  <p className="font-semibold text-gray-800">Skills</p>
                  <p className="text-gray-500">Python, SQL, Machine Learning (Self-reported)</p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
                Awaiting manual verification...
              </div>
            </div>

            {/* Verified View (After) */}
            <div className={`absolute inset-0 bg-gradient-to-br from-teal-50 to-white p-6 rounded-xl border border-teal-200 shadow-md transition-opacity duration-300 ${!showVerified ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="absolute top-0 right-0 bg-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> VERIFIED
              </div>
              <h4 className="font-bold text-navy text-lg mb-4 flex items-center">
                Alex Morgan <VerifiedBadge text="" className="ml-2" />
              </h4>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-navy flex items-center">
                    Education <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-teal" />
                  </p>
                  <p className="text-gray-600">M.S. Data Science, Stanford Univ. &mdash; <span className="text-teal-700 font-medium">Clearinghouse Verified</span></p>
                </div>
                <div>
                  <p className="font-semibold text-navy flex items-center">
                    Experience <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-teal" />
                  </p>
                  <p className="text-gray-600">Acme Corp 2019-2022 &mdash; <span className="text-teal-700 font-medium">Payroll API Confirmed</span></p>
                </div>
                <div>
                  <p className="font-semibold text-navy flex items-center">
                    Skills <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-teal" />
                  </p>
                  <p className="text-gray-600">Python, SQL, Machine Learning &mdash; <span className="text-teal-700 font-medium">Assessment Score 94%</span></p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between p-3 bg-white rounded-lg border border-teal-100 shadow-sm text-sm font-semibold text-teal-800">
                <span>Verification Time: 4.2 seconds</span>
                <span className="bg-teal-100 px-2 py-1 rounded">Trust Level: 99.9%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}
