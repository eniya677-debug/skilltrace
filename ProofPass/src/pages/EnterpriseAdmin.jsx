import { Card } from '../components/Shared';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, ShieldCheck, FileCheck, CheckCircle2, Lock, Key, Activity, Layers, ArrowRight } from 'lucide-react';

const activityData = [
  { time: '08:00', verifications: 120 },
  { time: '10:00', verifications: 450 },
  { time: '12:00', verifications: 890 },
  { time: '14:00', verifications: 1200 },
  { time: '16:00', verifications: 950 },
  { time: '18:00', verifications: 400 },
];

const assessmentData = [
  { name: 'Completed', value: 78, color: '#14B8A6' },
  { name: 'In Progress', value: 15, color: '#f59e0b' },
  { name: 'Pending', value: 7, color: '#e2e8f0' },
];

export default function EnterpriseAdmin() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div>
        <h1 className="text-3xl font-bold text-navy">Platform Dashboard</h1>
        <p className="text-gray-500 mt-1">Enterprise scale verification & infrastructure</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Tenants</p>
            <p className="text-3xl font-bold text-navy">128</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Building className="w-8 h-8" /></div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Verifications Today</p>
            <p className="text-3xl font-bold text-navy">4,632</p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><ShieldCheck className="w-8 h-8" /></div>
        </Card>
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Assessments Today</p>
            <p className="text-3xl font-bold text-navy">2,871</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileCheck className="w-8 h-8" /></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-navy mb-6">Verification Activity (Real-time)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="verifications" stroke="#14B8A6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Assessment Completion */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-navy mb-6">Assessment Status</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={assessmentData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {assessmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-navy">78%</span>
                <span className="text-xs text-gray-500 font-semibold uppercase">Completed</span>
              </div>
            </div>
            <div className="flex justify-center space-x-4 w-full mt-4">
              {assessmentData.map((item, idx) => (
                <div key={idx} className="flex items-center text-xs font-semibold text-gray-600">
                  <div className="w-3 h-3 rounded-full mr-1.5" style={{backgroundColor: item.color}}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Security & Integrations row */}
        <Card className="lg:col-span-1 border-t-4 border-t-navy">
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center"><Lock className="w-5 h-5 mr-2" /> Security & Compliance</h3>
          <div className="space-y-3">
            {[
              "SOC 2 Type II Certified",
              "End-to-End Data Encryption",
              "Role-Based Access Control",
              "Immutable Audit Logging"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-teal mr-3" />
                <span className="text-sm font-semibold text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-navy mb-4 flex items-center"><Layers className="w-5 h-5 mr-2" /> Top Integrations</h3>
          <div className="flex flex-wrap gap-4 mt-8">
            {['Workday HRIS', 'Greenhouse ATS', 'Okta SSO', 'Checkr Background', 'DocuSign eSign'].map((int, idx) => (
              <div key={idx} className="flex items-center justify-center w-32 h-20 bg-white border border-gray-200 shadow-sm rounded-xl hover:border-teal hover:shadow-md transition-all cursor-pointer">
                <span className="font-bold text-sm text-navy text-center">{int}</span>
              </div>
            ))}
            <div className="flex items-center justify-center w-32 h-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-navy hover:bg-gray-100 transition-all cursor-pointer">
              <span className="font-bold text-sm text-center">+ View All API</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Roadmap Strip */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-navy mb-6">Platform Architecture Roadmap</h3>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-6 relative">
            <div className="absolute top-6 right-6 text-gray-300"><CheckCircle2 className="w-6 h-6" /></div>
            <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-2">Phase 1 (Complete)</h4>
            <h3 className="text-xl font-bold text-gray-900 mb-4">MVP Validation</h3>
            <ul className="text-sm text-gray-600 space-y-2 font-medium">
              <li>Core Verification Engine</li>
              <li>Basic Assessments</li>
              <li>Manual Checks UI</li>
              <li>Static Candidate Profiles</li>
            </ul>
          </div>

          <div className="hidden md:flex items-center justify-center"><ArrowRight className="w-6 h-6 text-gray-300" /></div>

          <div className="flex-1 bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 relative shadow-md transform scale-105 z-10">
            <div className="absolute top-0 right-0 bg-teal text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">CURRENT</div>
            <h4 className="font-bold text-teal-700 uppercase tracking-widest text-xs mb-2">Phase 2</h4>
            <h3 className="text-xl font-bold text-teal-900 mb-4">Growing Platform</h3>
            <ul className="text-sm text-teal-800 space-y-2 font-medium">
              <li className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> AI Verification Pipeline</li>
              <li className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> Dynamic Assessments Engine</li>
              <li className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> Recruiter Workflow Automation</li>
              <li className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> Initial Integrations Hub</li>
              <li className="flex items-center"><Activity className="w-3.5 h-3.5 mr-2" /> Predictive Data & Analytics</li>
            </ul>
          </div>

          <div className="hidden md:flex items-center justify-center"><ArrowRight className="w-6 h-6 text-gray-300" /></div>

          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 opacity-70">
            <h4 className="font-bold text-indigo-500 uppercase tracking-widest text-xs mb-2">Phase 3 (Next)</h4>
            <h3 className="text-xl font-bold text-navy mb-4">Enterprise Scale</h3>
            <ul className="text-sm text-gray-600 space-y-2 font-medium">
              <li>Advanced AI Scoring & Bias checks</li>
              <li>Full Automation Engine</li>
              <li>Open Ecosystem APIs</li>
              <li>Multi-Tenant Federation</li>
              <li>Global Scale Infrastructure</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
}
