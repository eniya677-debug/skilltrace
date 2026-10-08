import { useState, useEffect } from 'react';
import { Card } from '../components/Shared';
import { Terminal, Bot, Code, CheckCircle, Activity, Play, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PromptAssessment() {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scores, setScores] = useState({ total: 0, clarity: 0, technicalDepth: 0, constraints: 0 });
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && !isAnalyzing) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleSubmit();
    }
  }, [timeLeft, isFinished, isAnalyzing]);

  const evaluatePrompt = (text) => {
    let clarity = 20;
    let technicalDepth = 20;
    let constraints = 10;

    const t = text.toLowerCase();
    
    // Check if they just copy-pasted the requirements
    const isCopyPaste = t.includes('build a secure user authentication') && t.includes('clean and modular');
    
    if (t.length > 50 && !isCopyPaste) clarity += 20;
    if (t.includes('act as') || t.includes('you are a') || t.includes('context')) clarity += 20;
    
    if (t.includes('express') || t.includes('node')) technicalDepth += 20;
    if (t.includes('bcrypt') || t.includes('argon')) technicalDepth += 20;
    if (t.includes('jwt') || t.includes('jsonwebtoken')) technicalDepth += 10;
    if (t.includes('zod') || t.includes('joi') || t.includes('express-validator')) technicalDepth += 10;
    if (t.includes('jest') || t.includes('mocha') || t.includes('supertest')) technicalDepth += 10;
    
    if (t.includes('error') && (t.includes('status') || t.includes('middleware'))) constraints += 15;
    if (t.includes('architecture') || t.includes('mvc') || t.includes('controller') || t.includes('route')) constraints += 15;

    clarity = Math.min(100, clarity);
    technicalDepth = Math.min(100, technicalDepth);
    constraints = Math.min(100, constraints);

    // Apply penalty if it's just a copy-paste
    if (isCopyPaste && t.length < 200) {
      clarity = Math.floor(clarity * 0.5);
      technicalDepth = Math.floor(technicalDepth * 0.5);
    }

    const total = Math.floor((clarity + technicalDepth + constraints) / 3);
    return { total, clarity, technicalDepth, constraints };
  };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = evaluatePrompt(prompt);
      setScores(result);
      localStorage.setItem('proofpass_prompt_score', result.total.toString());
      setIsAnalyzing(false);
      setIsFinished(true);
    }, 2500);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Prompt Engineering Assessment</h1>
          <p className="text-gray-500 mt-1">Evaluate candidate's ability to efficiently instruct LLMs</p>
        </div>
        {!isFinished && (
          <div className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold border border-indigo-100 shadow-sm">
            Time Remaining: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: The IDE / Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden flex flex-col h-[600px] border border-gray-200 shadow-xl">
            {/* Header */}
            <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <span className="text-gray-200 font-mono text-sm font-semibold">AI_Prompt_Workspace</span>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 bg-gray-50 relative p-4">
              {!isFinished ? (
                <>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isAnalyzing}
                    className="w-full h-full bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                    placeholder="Type your efficient AI prompt here... e.g. 'Act as a Senior Node.js Developer...'"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                      <Activity className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                      <h3 className="text-xl font-bold text-navy">Evaluating Prompt Efficiency...</h3>
                      <p className="text-gray-500 mt-2 text-sm">Analyzing context setup, framework specifications, and constraint enforcement.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-navy mb-2">Prompt Evaluated</h2>
                  <p className="text-gray-500 font-medium mb-8">Score successfully logged to candidate profile.</p>
                  
                  <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase">Clarity</p>
                      <p className="text-2xl font-bold text-indigo-600 mt-1">{scores.clarity}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                      <p className="text-xs font-bold text-gray-400 uppercase">Tech Depth</p>
                      <p className="text-2xl font-bold text-teal-600 mt-1">{scores.technicalDepth}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center border-b-4 border-b-navy">
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Score</p>
                      <p className="text-3xl font-extrabold text-navy mt-1">{scores.total}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Controls */}
            {!isFinished && (
              <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-mono">Tokens: {Math.floor(prompt.length / 4)}</p>
                <button 
                  onClick={handleSubmit}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Execute AI Simulation</span>
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Task Brief */}
        <div className="space-y-6">
          <Card className="bg-indigo-900 text-white border-none shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-6 h-6 text-indigo-300" />
              <h2 className="text-lg font-bold">Client Requirements</h2>
            </div>
            <p className="text-indigo-200 text-sm mb-4 leading-relaxed">
              <strong>Task:</strong> Build a User Authentication API
            </p>
            <div className="space-y-2 text-sm text-indigo-100 font-medium">
              <p>Provide the candidate with only the following requirements:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-indigo-300">
                <li>Build a secure User Authentication REST API using Node.js and Express.</li>
                <li>User registration & login</li>
                <li>Password hashing</li>
                <li>JWT-based authentication</li>
                <li>Input validation</li>
                <li>Protected /profile endpoint</li>
                <li>Proper error responses</li>
                <li>Clean and modular code</li>
                <li>Include basic API tests</li>
              </ul>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <h3 className="font-bold text-navy mb-2 flex items-center">
              <Code className="w-4 h-4 mr-2" /> Evaluation Rubric
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Candidates are evaluated on how efficiently they instruct the AI. A poor prompt simply copies the requirements. An excellent prompt establishes persona context, enforces architectural constraints (e.g. MVC), requests specific libraries (e.g. bcrypt, Joi, Jest), and dictates output formats.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Persona & Context Setting</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Specific Dependency Choices</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Architectural Constraints</span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
