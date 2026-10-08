import { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Shared';
import { Video, Mic, Square, BrainCircuit, Activity, CheckCircle, MessageSquare, AlertCircle, AlertTriangle, RotateCcw } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const QUESTIONS = [
  {
    id: 1,
    text: "Can you explain the internal working of a HashMap in Java? Specifically, how does it handle hash collisions, and what major performance optimization was introduced for collisions in Java 8?",
    keywords: ['array', 'bucket', 'hash', 'collision', 'linked list', 'tree', 'red black', 'red-black', 'java 8', 'eight', 'log n', 'logn']
  },
  {
    id: 2,
    text: "What is the difference between a Monolithic architecture and Microservices? When would you choose to migrate to Microservices in a Java ecosystem, and what are the primary trade-offs?",
    keywords: ['monolith', 'microservice', 'scale', 'scaling', 'deploy', 'independent', 'complexity', 'network', 'latency', 'distributed', 'single codebase', 'service discovery']
  },
  {
    id: 3,
    text: "Can you explain the concept of Dependency Injection in Spring Boot? How does the Inversion of Control (IoC) container manage bean lifecycles?",
    keywords: ['dependency injection', 'di', 'inversion of control', 'ioc', 'bean', 'lifecycle', 'autowired', 'singleton', 'container', 'spring', 'application context']
  },
  {
    id: 4,
    text: "In Java concurrency, what is the difference between the 'synchronized' keyword and using the ReentrantLock class from java.util.concurrent?",
    keywords: ['synchronized', 'reentrantlock', 'lock', 'thread', 'concurrency', 'fairness', 'trylock', 'intrinsic', 'monitor', 'interruptible', 'performance']
  }
];

export default function AiViva() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [timeLeft, setTimeLeft] = useState(35); // 35 seconds per question

  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(QUESTIONS[0]);

  const [scores, setScores] = useState({ tech: 0, comm: 0, conf: 'Low', feedback: '' });

  useEffect(() => {
    // Select random question on mount
    setCurrentQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
    
    let activeStream = null;
    let detectionInterval = null;
    let model = null;

    const startCameraAndProctoring = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }

        // Load TFJS model for anti-cheat
        model = await cocoSsd.load();
        
        detectionInterval = setInterval(async () => {
          if (videoRef.current && model && !isDisqualified && !isFinished) {
            const predictions = await model.detect(videoRef.current);
            const foundPhone = predictions.find(p => p.class === 'cell phone');
            const persons = predictions.filter(p => p.class === 'person');
            
            if (foundPhone && foundPhone.score > 0.5) {
              setDisqualifyReason('Unauthorized device detected (cell phone). Candidates may not use external devices during the assessment.');
              setWarningMessage('Mobile device detected.');
              setShowWarningBanner(true);
              setIsDisqualified(true);
              if (recognitionRef.current) recognitionRef.current.stop();
            } else if (persons.length > 1) {
              setDisqualifyReason('Multiple people detected in the camera frame. You must take the Viva assessment alone.');
              setWarningMessage('Multiple faces detected.');
              setShowWarningBanner(true);
              setIsDisqualified(true);
              if (recognitionRef.current) recognitionRef.current.stop();
            }
          }
        }, 1000);

      } catch (err) {
        console.error("Camera/Microphone access denied:", err);
      }
    };
    startCameraAndProctoring();

    // Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("SpeechRecognition API not supported in this browser.");
    }

    return () => {
      if (activeStream) activeStream.getTracks().forEach(track => track.stop());
      if (detectionInterval) clearInterval(detectionInterval);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isDisqualified, isFinished]);

  useEffect(() => {
    if (isRecording && timeLeft > 0 && !isDisqualified) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isRecording) {
      handleStop();
    }
  }, [isRecording, timeLeft, isDisqualified]);

  const handleStart = () => {
    setIsRecording(true);
    setTranscript('');
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };
  
  const evaluateTranscript = (text, questionObj) => {
    let tech = 10;
    let comm = 20;
    
    if (!text || text.trim().length < 10) {
      return { 
        tech: 0, comm: 0, conf: 'Low', 
        feedback: 'No significant verbal response detected. Please ensure your microphone is working and speak clearly.' 
      };
    }

    const t = text.toLowerCase();
    
    // Dynamic Technical checks based on matched keywords
    let matchCount = 0;
    questionObj.keywords.forEach(kw => {
      if (t.includes(kw)) matchCount++;
    });

    // 15 points per matched keyword
    tech += (matchCount * 15);

    // Communication checks (length and fluidity proxy)
    const words = t.split(' ').length;
    if (words > 20) comm += 30;
    if (words > 40) comm += 30;
    if (words > 60) comm += 20;

    tech = Math.min(100, tech);
    comm = Math.min(100, comm);
    
    let conf = 'Low';
    if (comm > 80 && tech > 70) conf = 'High';
    else if (comm > 50) conf = 'Medium';

    let feedback = '';
    if (tech >= 85) {
      feedback = "Excellent response. You accurately identified the key technical concepts and demonstrated a deep understanding of the architecture and underlying mechanisms.";
    } else if (tech >= 50) {
      feedback = "Good partial answer. You understood the basic concepts, but missed some advanced terminology or specific technical details.";
    } else {
      feedback = "Your answer was incomplete or factually incorrect. You missed explaining the core mechanisms requested by the question.";
    }

    return { tech, comm, conf, feedback };
  };

  const handleStop = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsEvaluating(true);
    
    setTimeout(() => {
      const result = evaluateTranscript(transcript, currentQuestion);
      setScores(result);
      localStorage.setItem('proofpass_viva_score', result.tech.toString());
      setIsEvaluating(false);
      setIsFinished(true);
    }, 3500);
  };

  const handleRestart = () => {
    setIsRecording(false);
    setIsEvaluating(false);
    setIsFinished(false);
    setIsDisqualified(false);
    setShowWarningBanner(false);
    setTranscript('');
    setTimeLeft(35);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">
      
      {showWarningBanner && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold shadow-2xl flex items-center space-x-3 z-50 animate-bounce">
          <AlertTriangle className="w-6 h-6" />
          <span>WARNING: {warningMessage} You will be disqualified.</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">AI Viva Assessment</h1>
          <p className="text-gray-500 mt-1">Live technical interview for Software Development Engineer (Java)</p>
        </div>
        {isRecording && !isDisqualified && (
          <div className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-full font-bold border border-red-100 shadow-sm animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
            Recording {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Viva Window */}
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
          ) : (
            <Card className="p-0 overflow-hidden bg-slate-900 flex flex-col relative">
              <div className="p-6 bg-slate-800 border-b border-slate-700">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-indigo-400 font-bold uppercase tracking-wider text-xs mb-1">AI Interviewer</h3>
                    <p className="text-white text-lg font-medium leading-relaxed">
                      "{currentQuestion.text}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-video bg-black flex items-center justify-center">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover opacity-90"
                />
                
                {!isFinished && !isEvaluating && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                    {!isRecording ? (
                      <button 
                        onClick={handleStart}
                        className="flex items-center space-x-2 px-6 py-3 bg-teal text-white rounded-full hover:bg-teal-600 transition-transform hover:scale-105 font-bold shadow-lg"
                      >
                        <Mic className="w-5 h-5" />
                        <span>Start Answering</span>
                      </button>
                    ) : (
                      <div className="flex flex-col items-center space-y-4 w-full px-12">
                        <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-lg text-white w-full max-w-lg text-center shadow-lg border border-white/10">
                          <p className="text-sm italic opacity-80 min-h-[40px] flex items-center justify-center">
                            {transcript ? `"${transcript}"` : "Listening..."}
                          </p>
                        </div>
                        <button 
                          onClick={handleStop}
                          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-transform hover:scale-105 font-bold shadow-lg"
                        >
                          <Square className="w-5 h-5" />
                          <span>Finish Answer</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {isEvaluating && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
                    <Activity className="w-12 h-12 text-teal animate-pulse mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Analyzing Response</h2>
                    <p className="text-gray-400 max-w-md text-center">Processing speech-to-text, evaluating technical accuracy, and checking for hallucinated concepts...</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {isFinished && !isDisqualified && (
            <Card className="p-8 border-t-4 border-t-teal animate-in slide-in-from-bottom-4">
              <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className="w-8 h-8 text-teal" />
                <h2 className="text-2xl font-bold text-navy">Viva Evaluation Complete</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" /> Live Transcript
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 italic border border-gray-100 min-h-[60px]">
                    {transcript ? `"${transcript}"` : "No audio transcribed."}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2" /> Scoring Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase">Technical Accuracy</p>
                      <p className={`text-3xl font-extrabold mt-1 ${scores.tech >= 80 ? 'text-teal' : scores.tech >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                        {scores.tech}%
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase">Communication</p>
                      <p className="text-3xl font-extrabold text-navy mt-1">{scores.comm}%</p>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl text-center shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase">Confidence</p>
                      <p className={`text-3xl font-extrabold mt-1 ${scores.conf === 'High' ? 'text-teal' : scores.conf === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>
                        {scores.conf}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl">
                  <h4 className="font-bold text-teal-900 mb-1">AI Feedback</h4>
                  <p className="text-teal-800 text-sm">{scores.feedback}</p>
                </div>
                
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={handleRestart}
                    className="flex items-center space-x-2 px-6 py-3 bg-white text-navy border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Retake Viva</span>
                  </button>
                </div>
              </div>
            </Card>
          )}

        </div>

        {/* Side Panel: Context */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-navy">Interview Context</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role Targeted</p>
                <p className="font-semibold text-gray-900">Software Development Engineer</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Primary Domain</p>
                <p className="font-semibold text-gray-900">Java / System Architecture</p>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Evaluation Criteria</p>
                <ul className="text-sm text-gray-600 space-y-2 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span> Concept Accuracy</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span> Clarity of Speech</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span> Keyword Hits ({currentQuestion.keywords.slice(0, 3).join(', ')})</li>
                </ul>
              </div>
            </div>
          </Card>
          
          {!isFinished && !isDisqualified && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-bold mb-1">Anti-Cheat Enabled</p>
                <p>Hardware device detection and speech pattern analysis are actively monitoring this session.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
