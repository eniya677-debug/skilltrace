import { useState } from 'react';
import { Card } from '../components/Shared';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingDown, Users, Timer, BadgeCheck } from 'lucide-react';

const timeToHireData = [
  { name: 'Traditional', days: 53 },
  { name: 'ProofPass', days: 37 }
];

const costPerHireData = [
  { name: 'Traditional', cost: 1.00 },
  { name: 'ProofPass', cost: 0.75 }
];

const retentionData = [
  { month: 'Month 1', traditional: 95, proofpass: 99 },
  { month: 'Month 3', traditional: 85, proofpass: 96 },
  { month: 'Month 6', traditional: 72, proofpass: 92 },
  { month: 'Month 12', traditional: 58, proofpass: 87 }
];

export default function BusinessImpact() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'hiring', label: 'Hiring Speed' },
    { id: 'quality', label: 'Quality & Cost' },
    { id: 'retention', label: 'Retention' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      <div>
        <h1 className="text-3xl font-bold text-navy">Business Impact</h1>
        <p className="text-xl text-teal font-semibold mt-2">Faster hiring. Lower costs. Stronger retention.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-navy shadow-sm' 
                : 'text-gray-500 hover:text-navy hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center space-x-4 border-l-4 border-l-blue-500">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Timer className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-navy">30% Faster</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hiring Velocity</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 border-l-4 border-l-teal">
          <div className="p-3 bg-teal-50 rounded-full text-teal"><TrendingDown className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-navy">25% Fewer</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Bad Hires</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 border-l-4 border-l-indigo-500">
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><BadgeCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-2xl font-bold text-navy">Higher Quality</p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Verified Candidates</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Time to Hire Chart */}
        <Card>
          <h3 className="text-lg font-bold text-navy mb-6">Time-to-Hire (Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeToHireData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="days" radius={[6, 6, 0, 0]}>
                  {
                    timeToHireData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#14B8A6'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm font-bold text-teal mt-4">↓ 30% reduction in time-to-hire</p>
        </Card>

        {/* Cost per Hire Chart */}
        <Card>
          <h3 className="text-lg font-bold text-navy mb-6">Relative Cost per Hire</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costPerHireData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={val => `$${val.toFixed(2)}x`} />
                <RechartsTooltip cursor={{fill: 'transparent'}} formatter={val => `$${val.toFixed(2)}x`} />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                  {
                    costPerHireData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#3b82f6'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-sm font-bold text-blue-600 mt-4">↓ 25% reduction in sourcing & verification costs</p>
        </Card>

        {/* Retention Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-navy mb-6">New-Hire Retention Improvement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="colorProof" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[50, 100]} tickFormatter={val => `${val}%`} />
                <RechartsTooltip />
                <Legend iconType="circle" />
                <Area type="monotone" name="Traditional Hiring" dataKey="traditional" stroke="#94a3b8" strokeWidth={3} fillOpacity={1} fill="url(#colorTrad)" />
                <Area type="monotone" name="With ProofPass" dataKey="proofpass" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorProof)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
}
