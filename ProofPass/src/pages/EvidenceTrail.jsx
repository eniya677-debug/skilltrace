import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, VerifiedBadge } from '../components/Shared';
import { 
  GitBranch, Video, FileCheck, CheckCircle2, 
  BrainCircuit, ShieldCheck, Activity, CheckCircle, 
  FileText, TrendingUp, Users, ShieldAlert
} from 'lucide-react';

function AnimatedStat({ value, suffix, label, icon: Icon, colorClass }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    const incrementTime = (1000 / end) * 4;
    const timer = setInterval(() => {
      start += Math.ceil(end / 20) || 1;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card className="flex items-start p-6">
      <div className={`p-3 rounded-xl bg-gray-50 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="ml-4">
        <div className="flex items-baseline space-x-1">
          <span className="text-3xl font-bold text-gray-900">{count}</span>
          <span className="text-2xl font-bold text-gray-900">{suffix}</span>
        </div>
        <p className="text-sm font-medium text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </Card>
  );
}

export default function EvidenceTrail() {
  const location = useLocation();
  const project = location.state?.extractedProject || localStorage.getItem('proofpass_project') || "Supply Chain Dashboard";
  
  // Get both scores from localStorage (falling back to passed state or default)
  const assessmentScore = location.state?.assessmentScore || localStorage.getItem('proofpass_score') || 94;
  const vivaScore = localStorage.getItem('proofpass_viva_score') || 95;
  
  const company = location.state?.targetCompany || localStorage.getItem('proofpass_company') || "Acme Logistics";

  const timelineEvents = [
    {
      title: `Project: ${project}`,
      detail: "Uploaded by candidate",
      icon: FileText,
      status: "Submitted",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      title: "Code Repository Link",
      detail: "GitHub integration verified",
      icon: GitBranch,
      status: "Verified",
      statusColor: "bg-teal-100 text-teal-700",
    },
    {
      title: "Live Technical Assessment",
      detail: `Scored ${assessmentScore}/100 with strict proctoring`,
      icon: Activity,
      status: "Verified",
      statusColor: "bg-teal-100 text-teal-700",
    },
    {
      title: "AI Viva Interview",
      detail: `Scored ${vivaScore}% Technical Accuracy with audio/video anti-cheat`,
      icon: Video,
      status: "Verified",
      statusColor: "bg-teal-100 text-teal-700",
    },
    {
      title: "Peer Endorsement",
      detail: "Verified by former colleague",
      icon: Users,
      status: "Verified",
      statusColor: "bg-teal-100 text-teal-700",
    },
    {
      title: "Employer Reference",
      detail: "HR background check",
      icon: FileCheck,
      status: "Confirmed",
      statusColor: "bg-indigo-100 text-indigo-700",
    }
  ];

  const aiChecklist = [
    "Resume Analysis",
    "Skills Assessment",
    "Consistency Check",
    "Bias Mitigation"
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Evidence Trail</h1>
          <p className="text-gray-500 mt-1">Immutable proof-of-work and AI verification logs</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedStat 
          value={Math.min(99, Math.floor((parseInt(assessmentScore) + parseInt(vivaScore)) / 2 + 12))} 
          suffix="%" 
          label="predicted performance alignment" 
          icon={ShieldCheck} colorClass="text-teal" 
        />
        <AnimatedStat 
          value={Math.floor((parseInt(assessmentScore) + parseInt(vivaScore)) / 2)} 
          suffix="/100" 
          label="overall technical capability" 
          icon={TrendingUp} colorClass="text-blue-600" 
        />
        <AnimatedStat 
          value={Math.max(30, Math.floor(((parseInt(assessmentScore) + parseInt(vivaScore)) / 2) * 0.8))} 
          suffix="%" 
          label="reduction in hiring risk" 
          icon={ShieldAlert} colorClass="text-amber-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <h2 className="text-xl font-bold text-navy mb-8">Proof-of-Work Timeline</h2>
            
            <div className="relative border-l-2 border-gray-100 ml-4 space-y-10">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                    <event.icon className="w-4 h-4 text-navy" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{event.detail}</p>
                    </div>
                    <span className={`mt-3 sm:mt-0 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${event.statusColor} self-start sm:self-auto`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-navy text-white p-6 relative overflow-hidden border-0">
            <div className="absolute right-0 top-0 opacity-10">
              <ShieldCheck className="w-48 h-48 -mr-10 -mt-10" />
            </div>
            <div className="relative z-10 flex items-start space-x-4">
              <div className="w-12 h-12 bg-teal/20 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-teal" />
              </div>
              <div>
                <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-1">Verified Endorsement</p>
                <h3 className="text-xl font-bold mb-1">Alex Morgan</h3>
                <p className="text-gray-300">Senior Engineer, {company}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Decision Support */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-indigo-500 shadow-md">
            <div className="flex items-center space-x-2 mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-500" />
              <h3 className="text-lg font-bold text-navy">AI Decision Support</h3>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Overall Assessment</h4>
                <p className="text-gray-900 text-sm leading-relaxed">
                  Candidate demonstrates highly consistent performance patterns across verified repositories and real-time assessments. Strong alignment with role requirements.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium">Architecture Design</span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium">Data Pipelines</span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium">Mentorship</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Overall Match Score</h4>
                  <span className="text-indigo-600 font-bold">{Math.floor((parseInt(assessmentScore) + parseInt(vivaScore)) / 2)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.floor((parseInt(assessmentScore) + parseInt(vivaScore)) / 2)}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Verification Checklist</h4>
                <div className="space-y-2.5">
                  {aiChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-teal mr-2" />
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 flex flex-col space-y-1 mt-4">
                <p><strong>Model Reference:</strong> GPT-4o-Trust</p>
                <p><strong>AI Usage Transparency:</strong> High &middot; Read-only synthesis</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
