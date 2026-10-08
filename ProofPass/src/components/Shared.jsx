import { useState, useEffect } from 'react';
import { BadgeCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 ${className}`}>
      {children}
    </div>
  );
}

export function VerifiedBadge({ text = "Verified" }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
      <BadgeCheck className="w-4 h-4 mr-1 text-teal-600" />
      {text}
    </span>
  );
}

export function StatCard({ title, value, icon: Icon, colorClass = "text-navy" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) return;
    const incrementTime = (1000 / end) * 5;
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
    <Card className="flex items-center p-6">
      <div className={`p-3 rounded-lg bg-gray-100 ${colorClass}`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-semibold text-gray-900">{count}</p>
      </div>
    </Card>
  );
}
