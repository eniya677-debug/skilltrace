import { useState } from 'react';
import { Card } from '../components/Shared';
import { Briefcase, Zap, ShieldCheck, Trophy, ChevronRight, ArrowUpDown } from 'lucide-react';

const steps = [
  { 
    title: "Define Requirements", 
    description: "Input the exact technical and soft skills required for the role. Our AI maps these to verified credentials."
  },
  { 
    title: "Discover Verified Talent", 
    description: "Search the ProofPass ecosystem for pre-vetted professionals with immutable proof-of-work."
  },
  { 
    title: "AI-Rank Shortlist", 
    description: "Let our algorithms automatically rank candidates based on objective, verified evidence and historical performance."
  },
  { 
    title: "Verify & Share Evidence", 
    description: "Share the immutable Evidence Trail directly with your clients, replacing subjective resumes with hard proof."
  },
  { 
    title: "Place With Confidence", 
    description: "Close placements 47% faster with absolute certainty in candidate abilities, offering premium guarantees."
  }
];

export default function RecruiterWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  // Retrieve the dynamically uploaded candidate from localStorage
  const name = localStorage.getItem('proofpass_name') || 'Alex Morgan';
  const role = localStorage.getItem('proofpass_role') || 'Senior Engineer';
  const matchScore = parseInt(localStorage.getItem('proofpass_score') || '92', 10);

  const candidates = [
    { id: 1, name, role, matchScore, status: "Verified", statusColor: "text-teal-700 bg-teal-50" }
  ];

  const sortedCandidates = [...candidates].sort((a, b) => {
    return sortOrder === 'desc' ? b.matchScore - a.matchScore : a.matchScore - b.matchScore;
  });

  const toggleSort = () => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-navy">Recruitment Companies' New Business Opportunity</h1>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
            <Zap className="w-4 h-4 mr-2" /> Faster placements
          </div>
          <div className="flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-100">
            <ShieldCheck className="w-4 h-4 mr-2" /> Reduced risk
          </div>
          <div className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-100">
            <Trophy className="w-4 h-4 mr-2" /> Premium client offerings
          </div>
        </div>
      </div>

      {/* Interactive 5-Step Horizontal Stepper */}
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between relative mb-8">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center flex-1 w-full group cursor-pointer mb-4 md:mb-0" onClick={() => setActiveStep(idx)}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal border-teal/20 text-white shadow-md transform scale-110' 
                    : 'bg-white border-gray-200 text-gray-400 group-hover:border-teal/50'
                }`}>
                  {idx + 1}
                </div>
                <div className="mt-3 text-center px-2">
                  <p className={`text-sm font-bold transition-colors ${isActive ? 'text-teal' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Description Panel */}
        <div className="bg-gradient-to-r from-navy to-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="max-w-2xl">
            <p className="text-teal-400 font-bold uppercase tracking-widest text-xs mb-2">Step {activeStep + 1}</p>
            <h3 className="text-2xl font-bold mb-3">{steps[activeStep].title}</h3>
            <p className="text-indigo-100 text-lg leading-relaxed">{steps[activeStep].description}</p>
          </div>
          <div className="mt-6 md:mt-0 p-4 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            <Briefcase className="w-12 h-12 text-teal-400" />
          </div>
        </div>
      </Card>

      {/* AI Ranked Shortlist Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy">AI-Ranked Shortlist</h2>
        
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Candidate</th>
                  <th 
                    className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-navy transition-colors flex items-center space-x-2"
                    onClick={toggleSort}
                  >
                    <span>Match Score</span>
                    <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'text-teal' : ''}`} />
                  </th>
                  <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Verification Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.role}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${candidate.matchScore >= 90 ? 'bg-teal' : candidate.matchScore >= 80 ? 'bg-indigo-500' : 'bg-gray-400'}`}
                            style={{ width: `${candidate.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-navy">{candidate.matchScore}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${candidate.statusColor}`}>
                        {candidate.status === 'Verified' && <ShieldCheck className="w-3.5 h-3.5 mr-1" />}
                        {candidate.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-teal font-semibold hover:text-teal-800 transition-colors flex items-center justify-end w-full group-hover:translate-x-1 duration-200">
                        View Passport <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}
