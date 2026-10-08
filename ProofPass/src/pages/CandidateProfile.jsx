import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, VerifiedBadge } from '../components/Shared';
import { ShieldCheck, ChevronDown, ChevronUp, FileText, CheckSquare, Briefcase, Users, BrainCircuit, ArrowRight } from 'lucide-react';

export default function CandidateProfile() {
  const [expandedVault, setExpandedVault] = useState(null);
  const location = useLocation();
  const candidateName = localStorage.getItem('proofpass_name') || location.state?.uploadedFile?.replace(/\.[^/.]+$/, "") || "Alex Morgan";
  const project = location.state?.extractedProject || "Supply Chain Dashboard";

  const certs = location.state?.extractedCerts || ['AWS Certified Data Analytics', 'Coursera Machine Learning', 'Google Data Analytics Professional'];

  const matchScore = location.state?.matchScore || 87;
  const targetCompany = location.state?.targetCompany || "TCS";
  const targetRole = location.state?.targetRole || "Cybersecurity";

  const vaultData = [
    { id: 'certs', title: 'Completed Courses & Certs', count: certs.length, icon: FileText, items: certs },
    { id: 'assessments', title: 'Assessments', count: 4, icon: CheckSquare, items: ['Data Analysis', 'Python', 'SQL', 'Problem Solving'] },
    { id: 'projects', title: 'Projects', count: 2, icon: Briefcase, items: [project, 'ML Model Evaluation'] },
    { id: 'references', title: 'References', count: 2, icon: Users, items: ['Team Lead Feedback', 'Client Recommendation'] }
  ];

  const timeline = [
    { date: 'Oct 2023', event: `Project: ${project}` },
    { date: 'Sep 2023', event: 'Assessment: Data Analysis' },
    { date: 'Aug 2023', event: 'Domain Project: ML Model Evaluation' },
    { date: 'Jul 2023', event: 'Reference Check: Team Lead' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">{candidateName}</h1>
          <p className="text-gray-500 text-lg mb-4">{targetRole} Candidate • {targetCompany}</p>
          <Link 
            to="/assessment" 
            state={{ 
              extractedProject: project, 
              extractedSkills: location.state?.extractedSkills,
              targetCompany,
              targetRole 
            }}
            className="inline-flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy/90 transition-colors"
          >
            <span>Start Live Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Match Score</p>
            <p className="text-3xl font-extrabold text-navy">{matchScore}%</p>
          </div>
          <div className="h-10 w-px bg-gray-200 mx-2"></div>
          <div className="bg-teal/10 border border-teal/20 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-teal" />
            <div>
              <p className="text-[10px] text-teal-800 font-bold uppercase tracking-widest mb-0.5">Overall Verification</p>
              <p className="text-lg font-bold text-teal-900 leading-none">VERIFIED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Skills */}
      <Card>
        <h3 className="text-lg font-semibold text-navy mb-4 flex items-center">
          Verified Skills
        </h3>
        <div className="flex flex-wrap gap-3">
          {(location.state?.extractedSkills || ['Data Analysis', 'Python', 'SQL', 'Machine Learning', 'Problem Solving']).map((skill, idx) => (
            <div key={idx} className="px-4 py-2 bg-gray-50 rounded-full flex items-center border border-gray-200 hover:border-teal/30 hover:shadow-sm transition-all">
              <VerifiedBadge text="" />
              <span className="ml-2 font-medium text-gray-800 text-sm">{skill}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Transparency */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 border border-gray-200 rounded-xl p-5 flex items-center shadow-sm">
        <BrainCircuit className="w-8 h-8 text-indigo-500 mr-4 shrink-0" />
        <div>
          <h3 className="text-base font-semibold text-gray-900">AI Transparency</h3>
          <p className="text-gray-600 text-sm mt-0.5 font-medium">AI Usage: Declared &middot; Human Verified</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evidence Vault */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-navy">Evidence Vault</h3>
          {vaultData.map(vault => (
            <Card key={vault.id} className="p-0 overflow-hidden">
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpandedVault(expandedVault === vault.id ? null : vault.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-gray-100 rounded-lg text-navy">
                    <vault.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{vault.title}</h4>
                    <p className="text-sm text-gray-500">{vault.count} items</p>
                  </div>
                </div>
                {expandedVault === vault.id ? <ChevronUp className="text-gray-400 w-5 h-5" /> : <ChevronDown className="text-gray-400 w-5 h-5" />}
              </button>
              
              {expandedVault === vault.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2">
                  <ul className="space-y-3 mt-2">
                    {vault.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-teal rounded-full mr-3 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-xl font-semibold text-navy mb-4">Proof-of-Work Timeline</h3>
          <Card className="p-6">
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 py-2">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-teal group-hover:bg-teal transition-colors" />
                  <p className="text-xs font-bold text-teal tracking-wider uppercase mb-1">{item.date}</p>
                  <p className="text-gray-900 font-medium">{item.event}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
