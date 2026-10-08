import { useState } from 'react';
import { Card, VerifiedBadge } from '../components/Shared';
import { QrCode, Share2, Check, ShieldCheck, FileCheck, Building2, Database, Globe, Briefcase, Award } from 'lucide-react';

export default function TalentPassport() {
  const [copied, setCopied] = useState(false);

  const name = localStorage.getItem('proofpass_name') || 'Alex Morgan';
  const role = localStorage.getItem('proofpass_role') || 'Senior Engineer';
  const skills = JSON.parse(localStorage.getItem('proofpass_skills') || '["Data Analysis", "Python", "SQL", "Problem Solving"]');
  const score = localStorage.getItem('proofpass_score') || '92';
  const vivaScore = localStorage.getItem('proofpass_viva_score') || '95';

  const handleShare = () => {
    navigator.clipboard.writeText("https://proofpass.app/p/verify");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Talent Passport</h1>
          <p className="text-gray-500 mt-1">Your portable, verified professional identity.</p>
        </div>
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 px-5 py-2.5 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors shadow-sm relative overflow-hidden"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          <span className="font-medium">{copied ? 'Link Copied!' : 'Share Passport'}</span>
        </button>
      </div>

      {/* Passport Credential Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-navy to-indigo-900 rounded-3xl transform rotate-1 scale-[1.02] opacity-20 blur-sm"></div>
        <Card className="relative p-0 overflow-hidden border-2 border-gray-200 rounded-3xl bg-white shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-indigo-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div>
              <p className="text-teal-400 font-bold tracking-[0.2em] text-sm mb-1 uppercase">Official Credential</p>
              <h2 className="text-3xl font-extrabold tracking-tight">TALENT PASSPORT</h2>
              <p className="text-indigo-200 mt-2 font-medium">{name} • {role}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <ShieldCheck className="w-10 h-10 text-teal-400" />
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Skills */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Verified Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-navy">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assessment */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <FileCheck className="w-4 h-4 mr-2" />
                  Primary Assessments
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy">{role} Code Test</p>
                      <p className="text-sm text-gray-500 mt-0.5">Verified on ProofPass</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-600 font-bold uppercase mb-0.5">Score</p>
                      <p className="text-2xl font-bold text-blue-900">{score}%</p>
                    </div>
                  </div>
                  <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy">AI Viva Interview</p>
                      <p className="text-sm text-gray-500 mt-0.5">Technical Accuracy</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-teal-600 font-bold uppercase mb-0.5">Score</p>
                      <p className="text-2xl font-bold text-teal-900">{vivaScore}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endorsements */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Peer Endorsements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <VerifiedBadge text="" />
                    <span className="font-medium text-gray-800 text-sm">Project Lead</span>
                    <span className="text-gray-400 text-sm">&mdash; Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <VerifiedBadge text="" />
                    <span className="font-medium text-gray-800 text-sm">Senior Data Scientist</span>
                    <span className="text-gray-400 text-sm">&mdash; Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: QR & Validity */}
            <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-100 pl-8 space-y-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner group cursor-pointer hover:bg-gray-100 transition-colors">
                <QrCode className="w-32 h-32 text-navy opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
              </div>
              <div className="text-center w-full">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Credential Validity</p>
                <div className="bg-teal-50 text-teal-800 px-4 py-2 rounded-lg font-bold border border-teal-200">
                  Valid until Dec 2027
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ecosystem Hub Diagram */}
      <div className="pt-8">
        <div className="text-center mb-10">
          <h2 className="text-xl font-bold text-navy">Your Verification Ecosystem</h2>
          <p className="text-gray-500">Connect your verified profile across the web</p>
        </div>

        <div className="relative max-w-2xl mx-auto h-96">
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <line x1="50%" y1="50%" x2="50%" y2="15%" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="6 6" />
            <line x1="50%" y1="50%" x2="15%" y2="50%" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="6 6" />
            <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="6 6" />
            <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="6 6" />
          </svg>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-24 h-24 bg-teal rounded-2xl shadow-lg border-4 border-white flex flex-col items-center justify-center text-white animate-pulse">
              <ShieldCheck className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">Talent<br/>Passport</span>
            </div>
          </div>

          {/* Nodes */}
          <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 z-10 group">
            <div className="w-20 h-20 bg-white rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center text-navy group-hover:border-teal group-hover:scale-105 transition-all">
              <Building2 className="w-6 h-6 mb-1 text-blue-600" />
              <span className="text-[10px] font-semibold">Employers</span>
            </div>
          </div>

          <div className="absolute top-1/2 left-[5%] transform -translate-y-1/2 z-10 group">
            <div className="w-20 h-20 bg-white rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center text-navy group-hover:border-teal group-hover:scale-105 transition-all">
              <Database className="w-6 h-6 mb-1 text-purple-500" />
              <span className="text-[10px] font-semibold text-center leading-tight">ATS<br/>Platforms</span>
            </div>
          </div>

          <div className="absolute top-1/2 right-[5%] transform -translate-y-1/2 z-10 group">
            <div className="w-20 h-20 bg-white rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center text-navy group-hover:border-teal group-hover:scale-105 transition-all">
              <Briefcase className="w-6 h-6 mb-1 text-amber-500" />
              <span className="text-[10px] font-semibold text-center leading-tight">Freelance<br/>Platforms</span>
            </div>
          </div>

          <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 z-10 group">
            <div className="w-20 h-20 bg-white rounded-full shadow-md border border-gray-200 flex flex-col items-center justify-center text-navy group-hover:border-teal group-hover:scale-105 transition-all">
              <Globe className="w-6 h-6 mb-1 text-green-500" />
              <span className="text-[10px] font-semibold text-center leading-tight">Global<br/>Opportunities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
