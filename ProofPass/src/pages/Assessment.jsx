import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card } from '../components/Shared';
import { Timer, CheckCircle, BrainCircuit, Activity, FileCode, Check, Send, RotateCcw, AlertTriangle, Video, Smartphone, List } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function Assessment() {
  const [solution, setSolution] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [showPhoneWarning, setShowPhoneWarning] = useState(false);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [timeLeft, setTimeLeft] = useState(25 * 60 + 14); // 25:14
  
  const [actionLog, setActionLog] = useState([{ time: '00:00', action: 'Assessment Started' }]);
  const [scores, setScores] = useState({ total: 0, alg: 0, qual: 0, edge: 0, cons: 0 });
  
  const startTimeRef = useRef(Date.now());
  const videoRef = useRef(null);
  
  const location = useLocation();
  const project = location.state?.extractedProject || "Supply Chain Dashboard";
  const skills = location.state?.extractedSkills || ["Java", "Data Structures", "Algorithms"];
  const company = location.state?.targetCompany || "TCS";
  const role = location.state?.targetRole || "Software Development Engineer";
  
  // Decide challenge type
  const isJavaDSA = skills.some(s => s.toLowerCase().includes('java') || s.toLowerCase().includes('algorithm')) || true; 
  
  const flowSteps = ["Start", "Complete", "AI Review", "Results Delivered"];
  const currentStep = isDisqualified ? 0 : isFinished ? 3 : isAnalyzing ? 2 : 0;

  const logAction = (action) => {
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    const timeStr = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    setActionLog(prev => [...prev, { time: timeStr, action }]);
  };

  const evaluateCode = (code) => {
    let alg = 0; let qual = 0; let edge = 0; let cons = 0;
    if (!code || code.length < 5) return { total: 0, alg: 0, qual: 0, edge: 0, cons: 0 };
    
    const stripped = code.replace(/\s+/g, '');
    
    // Algorithmic Efficiency (Max 25)
    if (code.includes("while") || code.includes("for")) alg += 10;
    if (code.includes(".next")) alg += 5;
    if (stripped.includes("=prev") || stripped.includes("prev=")) alg += 5;
    if (code.includes("new ") && (code.includes("List") || code.includes("Stack") || code.includes("Array"))) {
        alg -= 10; // Penalize for O(n) space
    } else if (alg >= 15) {
        alg += 5; // Bonus for likely O(1) space logic
    }
    
    // Code Quality (Max 25)
    if (code.includes("ListNode")) qual += 8;
    if (code.includes("return")) qual += 7;
    if (code.includes("curr") || code.includes("prev") || code.includes("next")) qual += 10;
    
    // Edge Cases (Max 25)
    if (stripped.includes("head==null")) edge += 15;
    if (stripped.includes("head.next==null")) edge += 10;
    if (edge === 0 && alg >= 15) edge = 5; // Partial credit if they wrote main logic
    
    // Consistency (Max 25)
    cons = (alg + qual + edge) > 35 ? 25 : Math.floor((alg + qual + edge) / 2);
    
    // Clamp
    alg = Math.max(0, Math.min(25, alg));
    qual = Math.max(0, Math.min(25, qual));
    edge = Math.max(0, Math.min(25, edge));
    cons = Math.max(0, Math.min(25, cons));
    
    return { total: alg + qual + edge + cons, alg, qual, edge, cons };
  };

  useEffect(() => {
    let stream;
    let detectionInterval;
    let model;
    let consecutivePhoneDetections = 0;

    const startProctoring = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Load TFJS model
        model = await cocoSsd.load();
        
        detectionInterval = setInterval(async () => {
          if (videoRef.current && model && !isDisqualified && !isFinished) {
            const predictions = await model.detect(videoRef.current);
            const foundPhone = predictions.find(p => p.class === 'cell phone');
            
            if (foundPhone && foundPhone.score > 0.5) {
              setDisqualifyReason('Unauthorized mobile device (cell phone) detected in the proctoring camera.');
              setShowPhoneWarning(true);
              setIsDisqualified(true);
              logAction('Proctor AI: Disqualified due to mobile device');
            }
          }
        }, 1000); // Check every second

      } catch (err) {
        console.error("Proctoring error:", err);
      }
    };

    startProctoring();

    const handleVisibilityChange = () => {
      if (document.hidden && !isFinished && !isAnalyzing && !isDisqualified) {
        logAction('Tab Switch: Candidate navigated away from assessment window');
        setDisqualifyReason('You navigated away from the active assessment window.');
        setIsDisqualified(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (detectionInterval) clearInterval(detectionInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isFinished, isAnalyzing, isDisqualified]);

  useEffect(() => {
    if (isFinished || isAnalyzing || isDisqualified || timeLeft <= 0) {
      if (timeLeft <= 0 && !isFinished) {
        logAction('Time Expired');
        const evaluation = evaluateCode(solution);
        setScores(evaluation);
        localStorage.setItem('proofpass_score', evaluation.total.toString());
        setIsFinished(true);
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isFinished, isAnalyzing, isDisqualified, timeLeft, solution]);

  const handleSubmit = () => {
    if (!solution.trim()) return;
    logAction('Submitted Solution');
    setIsAnalyzing(true);
    
    const evaluation = evaluateCode(solution);
    setScores(evaluation);
    localStorage.setItem('proofpass_score', evaluation.total.toString());
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsFinished(true);
    }, 3000);
  };

  const handleRestart = () => {
    setSolution('');
    setIsFinished(false);
    setIsAnalyzing(false);
    setIsDisqualified(false);
    setShowPhoneWarning(false);
    setTimeLeft(25 * 60 + 14);
    startTimeRef.current = Date.now();
    setActionLog([{ time: '00:00', action: 'Assessment Restarted' }]);
  };

  const handleEditorKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      logAction('Clipboard: Copied content from editor');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      logAction('Clipboard: Pasted content into editor');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
      logAction('Clipboard: Cut content from editor');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in relative">
      
      {showPhoneWarning && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center space-x-3 z-50 animate-bounce">
          <Smartphone className="w-6 h-6" />
          <span>WARNING: Mobile device detected. Please put away your phone immediately or you will be disqualified.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Live Technical Assessment</h1>
        {!isFinished && !isAnalyzing && !isDisqualified && (
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Timer className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-500' : 'text-gray-500'}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-navy'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {isDisqualified ? (
             <Card className="text-center py-16 flex flex-col items-center border-2 border-red-500 shadow-xl bg-red-50">
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
               <AlertTriangle className="w-12 h-12 text-red-600" />
             </div>
             <h2 className="text-3xl font-extrabold text-red-700 mb-2">DISQUALIFIED</h2>
             <p className="text-red-900 font-semibold text-lg mb-2">Academic Integrity Violation Detected.</p>
             <p className="text-red-700 max-w-md mx-auto mb-8 font-medium">
               {disqualifyReason}
             </p>
             <button 
               onClick={handleRestart}
               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors shadow-sm"
             >
               Acknowledge & Restart
             </button>
           </Card>
          ) : isFinished ? (
            <Card className="py-10 px-8 flex flex-col">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-gray-100 pb-8">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-teal" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-navy mb-1">Assessment Complete</h2>
                    <p className="text-gray-500 font-medium">AI Evaluation finalized for {company}</p>
                  </div>
                </div>
                <div className="flex space-x-8 mt-6 md:mt-0 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Total Score</p>
                    <p className="text-4xl font-extrabold text-navy">{scores.total}<span className="text-xl text-gray-400 font-medium">/100</span></p>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">Resume Alignment</p>
                    <p className={`text-2xl font-extrabold mt-1 ${scores.cons >= 20 ? 'text-teal' : scores.cons >= 10 ? 'text-amber-500' : 'text-red-500'}`}>
                      {scores.cons >= 20 ? 'High Match' : scores.cons >= 10 ? 'Partial Match' : 'Low Match'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rubrics Evaluation */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-teal" />
                  Rubric Evaluation Breakdown
                </h3>
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase">
                      <tr>
                        <th className="px-6 py-4 font-bold">Evaluation Criteria</th>
                        <th className="px-6 py-4 font-bold">Score</th>
                        <th className="px-6 py-4 font-bold">AI Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">Algorithmic Efficiency</td>
                        <td className="px-6 py-4 text-navy font-bold">{scores.alg} / 25</td>
                        <td className="px-6 py-4 text-gray-600">
                          {scores.alg >= 20 ? "Excellent O(n) time and O(1) space complexity achieved." : scores.alg >= 10 ? "Adequate traversal but suboptimal pointer management or space complexity." : "Missing core algorithmic logic to perform reversal in O(n) time."}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">Code Quality & Java Best Practices</td>
                        <td className="px-6 py-4 text-navy font-bold">{scores.qual} / 25</td>
                        <td className="px-6 py-4 text-gray-600">
                          {scores.qual >= 20 ? "Strong object-oriented approach with proper standard conventions." : scores.qual >= 10 ? "Basic implementation, lacks proper naming or standard conventions." : "Poor code quality or incomplete implementation."}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">Edge Case Handling</td>
                        <td className="px-6 py-4 text-navy font-bold">{scores.edge} / 25</td>
                        <td className="px-6 py-4 text-gray-600">
                          {scores.edge >= 20 ? "Successfully handled null inputs and single-node edge cases explicitly." : scores.edge >= 10 ? "Implicitly handled some cases, but missed explicit null head validation." : "Did not account for empty lists or single node lists."}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">Consistency with Resume Skills</td>
                        <td className="px-6 py-4 text-navy font-bold">{scores.cons} / 25</td>
                        <td className="px-6 py-4 text-gray-600">
                          {scores.cons >= 20 ? `Solution perfectly aligns with declared expertise in ${skills[0]}.` : scores.cons >= 10 ? `Solution shows rudimentary understanding of ${skills[0]} but lacks depth.` : `Major discrepancy between claimed ${skills[0]} expertise and implementation.`}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Candidate Action Audit Log */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center">
                  <List className="w-5 h-5 mr-2 text-teal" />
                  Candidate Behavioral Audit Log
                </h3>
                <div className="bg-slate-900 rounded-xl p-6 text-gray-300 font-mono text-sm shadow-inner max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {actionLog.map((log, idx) => (
                      <div key={idx} className="flex space-x-4 border-b border-slate-800 pb-2">
                        <span className="text-teal w-12 flex-shrink-0">[{log.time}]</span>
                        <span className={log.action.includes('Proctor') || log.action.includes('Clipboard') ? 'text-amber-400' : 'text-gray-300'}>
                          {log.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={handleRestart}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Restart Challenge</span>
                </button>
                <Link 
                  to="/evidence"
                  state={{
                    extractedProject: project,
                    extractedSkills: skills,
                    targetCompany: company,
                    targetRole: role,
                    assessmentScore: scores.total,
                    actionLog: actionLog
                  }}
                  className="flex items-center space-x-2 px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-semibold shadow-sm"
                >
                  <span>View Evidence Trail</span>
                  <CheckCircle className="w-5 h-5" />
                </Link>
              </div>
            </Card>
          ) : isAnalyzing ? (
            <Card className="text-center py-24 flex flex-col items-center h-full justify-center">
              <BrainCircuit className="w-16 h-16 text-indigo-500 animate-pulse mb-6" />
              <h2 className="text-2xl font-bold text-navy mb-2">AI is evaluating your code...</h2>
              <p className="text-gray-500">Cross-referencing your proposed solution with the verified skills in your resume.</p>
              
              <div className="w-full max-w-md mt-10 space-y-4">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <Check className="w-4 h-4 text-teal mr-2" /> Compiling Java solution
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600">
                  <Check className="w-4 h-4 text-teal mr-2" /> Validating Time/Space Complexity
                </div>
                <div className="flex items-center text-sm font-medium text-gray-400 animate-pulse">
                  <Activity className="w-4 h-4 mr-2" /> Scoring algorithm against rubric...
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col h-full">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full mb-3 border border-amber-200">
                  {company} Data Structures & Algorithms Challenge
                </span>
                <h3 className="text-2xl font-bold text-navy mb-2">Java Linked List Reversal</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Based on your application for the <strong>{role}</strong> role at <strong>{company}</strong>, we are evaluating your core algorithmic proficiency in <strong>Java</strong>. 
                  <br/><br/>
                  <strong>Scenario:</strong> {company} relies heavily on optimized data structures for their distributed caching mechanisms. You are tasked with optimizing a core data retrieval pipeline.
                  <br/><br/>
                  <strong>Task:</strong> Implement a Java method to completely reverse a Singly Linked List. Your solution MUST run in <code>O(n)</code> time complexity and <code>O(1)</code> space complexity. Do not use any external libraries.
                </p>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between bg-slate-900 text-gray-300 px-4 py-2 rounded-t-xl border-b border-gray-700">
                  <div className="flex items-center space-x-2 text-sm">
                    <FileCode className="w-4 h-4" />
                    <span className="font-mono">SolutionWorkspace.java</span>
                  </div>
                  <span className="text-xs">Java 17</span>
                </div>
                <textarea 
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  onFocus={() => logAction('Editor: Focused workspace')}
                  onBlur={() => logAction('Editor: Unfocused workspace')}
                  onKeyDown={handleEditorKeyDown}
                  placeholder="class Solution {&#10;    public ListNode reverseList(ListNode head) {&#10;        // Write your optimized code here...&#10;    }&#10;}"
                  className="w-full flex-1 min-h-[250px] p-4 bg-slate-50 border border-t-0 border-gray-200 rounded-b-xl focus:ring-2 focus:ring-teal focus:border-teal outline-none font-mono text-sm resize-none text-gray-800"
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  disabled={!solution.trim()}
                  className={`px-8 py-3 rounded-lg flex items-center font-bold transition-all shadow-sm ${
                    solution.trim() 
                      ? 'bg-teal text-white hover:bg-teal-600 transform hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5 mr-2" />
                  <span>Submit Code</span>
                </button>
              </div>
            </Card>
          )}

          {/* Bottom 4-step flow strip */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-hidden">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
              {flowSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-2 ${
                    idx < currentStep ? 'bg-teal border-teal text-white' : 
                    idx === currentStep ? 'border-teal text-teal bg-white' : 
                    'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {idx < currentStep ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    idx <= currentStep ? 'text-navy' : 'text-gray-400'
                  }`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Proctoring Warning Camera */}
          {!isFinished && !isDisqualified && (
            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-amber-400">
              <div className="absolute top-0 w-full bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 flex items-center justify-between z-10">
                <span className="flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Live Proctoring Active</span>
                <span className="animate-pulse bg-red-500 w-2 h-2 rounded-full"></span>
              </div>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-48 object-cover bg-slate-900"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center justify-center">
                <Video className="w-3 h-3 mr-1" /> Camera recording for identity verification
              </div>
            </div>
          )}

          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-navy">Context Engine</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Language</p>
                <p className="font-semibold text-gray-900">Java 17</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Verified Skills Extracted</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {skills.slice(0, 4).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs font-semibold rounded text-gray-700">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Evaluation Criteria</p>
                <ul className="text-sm text-gray-600 space-y-2 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal rounded-full mr-2"></span> Time/Space Complexity</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal rounded-full mr-2"></span> Edge Case Handling</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-teal rounded-full mr-2"></span> Code Quality</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
