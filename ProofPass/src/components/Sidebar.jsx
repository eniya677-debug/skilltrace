import { Link, useLocation } from 'react-router-dom';
import { Home, User, CheckSquare, FileText, BadgeCheck, Briefcase, TrendingUp, Settings, Network, Mic, Bot } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { name: 'Upload Resume', path: '/', icon: FileText },
    { name: 'Overview', path: '/overview', icon: Home },
    { name: 'Candidate Profile', path: '/candidate', icon: User },
    { name: 'Code Assessment', path: '/assessment', icon: CheckSquare },
    { name: 'AI Viva Assessment', path: '/viva', icon: Mic },
    { name: 'Prompt Engineering', path: '/prompt', icon: Bot },
    { name: 'Evidence Trail', path: '/evidence', icon: FileText },
    { name: 'Talent Passport', path: '/passport', icon: BadgeCheck },
    { name: 'Recruiter Workflow', path: '/workflow', icon: Briefcase },
    { name: 'Business Impact', path: '/impact', icon: TrendingUp },
    { name: 'Enterprise Admin', path: '/admin', icon: Settings },
    { name: 'Ecosystem', path: '/ecosystem', icon: Network },
  ];

  return (
    <div className="w-64 bg-navy text-white min-h-screen p-4 flex flex-col fixed left-0 top-0">
      <div className="text-2xl font-bold mb-8 text-teal px-2">ProofPass</div>
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`flex items-center space-x-3 p-2 rounded transition-colors ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal' : 'text-gray-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
