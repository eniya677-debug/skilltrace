import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Card } from '../components/Shared';
import { UploadCloud, File, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Define a broad dictionary of technical and soft skills to look for
const SKILL_DB = [
  "React", "Python", "SQL", "Machine Learning", "Data Analysis", "Java", "C++", 
  "Node.js", "AWS", "Docker", "Kubernetes", "TypeScript", "JavaScript", "HTML", 
  "CSS", "System Design", "Problem Solving", "Communication", "Leadership",
  "GraphQL", "MongoDB", "PostgreSQL", "Redis", "Ruby", "Go", "Rust", "Angular",
  "Vue", "Figma", "Agile", "Scrum", "Git", "CI/CD", "Azure", "GCP", "TensorFlow",
  "PyTorch", "NLP", "Computer Vision", "Data Science", "Project Management"
];

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const [targetCompany, setTargetCompany] = useState('TCS');
  const [targetRole, setTargetRole] = useState('Cybersecurity');

  useEffect(() => {
    // Set up the worker for pdfjs
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const extractSkillsFromText = (text) => {
    const textLower = text.toLowerCase();
    const foundSkills = SKILL_DB.filter(skill => textLower.includes(skill.toLowerCase()));
    return foundSkills.length > 0 ? foundSkills : ["Problem Solving", "Communication"];
  };

  const extractProjectFromText = (text) => {
    const sentences = text.split(/(?:\. |\n)+/).map(s => s.trim()).filter(s => s.length > 10);
    for (let s of sentences) {
      const lower = s.toLowerCase();
      if ((lower.includes('project') || lower.includes('app') || lower.includes('dashboard') || lower.includes('platform') || lower.includes('system')) && s.length < 80) {
        return s;
      }
    }
    for (let s of sentences) {
      const lower = s.toLowerCase();
      if (lower.includes('developed') || lower.includes('built') || lower.includes('created')) {
        return s.substring(0, 60) + "...";
      }
    }
    return "Enterprise Software System";
  };

  const extractCertsFromText = (text) => {
    const sentences = text.split(/(?:\. |\n)+/).map(s => s.trim()).filter(s => s.length > 10);
    const certs = [];
    for (let s of sentences) {
      const lower = s.toLowerCase();
      if ((lower.includes('certif') || lower.includes('course') || lower.includes('credential')) && s.length < 80) {
        certs.push(s);
      }
    }
    return certs.length > 0 ? certs.slice(0, 4) : ["AWS Certified Solutions Architect", "Google Data Analytics Professional"];
  };

  const parsePDF = async (fileBlob) => {
    const arrayBuffer = await fileBlob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + " ";
    }
    return fullText;
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setProgress(10);
    
    try {
      let extractedText = "";
      setProgress(30);

      if (file.type === 'application/pdf') {
        extractedText = await parsePDF(file);
      } else if (file.type === 'text/plain') {
        extractedText = await file.text();
      }
      
      setProgress(70);
      const extractedSkills = extractSkillsFromText(extractedText);
      const extractedProject = extractProjectFromText(extractedText);
      const extractedCerts = extractCertsFromText(extractedText);
      
      const extractNameFromText = (text, filename) => {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length > 0 && lines[0].split(' ').length <= 4) {
          // Capitalize first letters
          return lines[0].replace(/\b\w/g, c => c.toUpperCase());
        }
        return filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ').replace(/\bresume\b/gi, '').trim() || 'Alex Morgan';
      };
      
      const extractedName = extractNameFromText(extractedText, file.name);
      
      // Calculate a semi-random match score based on skills found
      const matchScore = Math.min(99, Math.max(75, 70 + extractedSkills.length * 4 + Math.floor(Math.random() * 10)));
      
      // Save to localStorage for sidebar navigation persistence
      localStorage.setItem('proofpass_skills', JSON.stringify(extractedSkills));
      localStorage.setItem('proofpass_project', extractedProject);
      localStorage.setItem('proofpass_certs', JSON.stringify(extractedCerts));
      localStorage.setItem('proofpass_score', matchScore.toString());
      localStorage.setItem('proofpass_name', extractedName);
      localStorage.setItem('proofpass_company', targetCompany);
      localStorage.setItem('proofpass_role', targetRole);

      setProgress(100);

      setTimeout(() => {
        navigate('/candidate', { 
          state: { 
            uploadedFile: file.name,
            extractedSkills,
            extractedProject,
            extractedCerts,
            matchScore,
            targetCompany,
            targetRole
          } 
        });
      }, 800);

    } catch (error) {
      console.error("Error parsing file:", error);
      setProgress(100);
      setTimeout(() => navigate('/candidate', { state: { uploadedFile: file.name, extractedSkills: ["Analysis Error"], extractedProject: "Analysis Error", extractedCerts: ["Analysis Error"], matchScore: 82, targetCompany, targetRole } }), 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 pt-8">
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy mb-3">Upload Candidate Resume</h1>
        <p className="text-gray-500">
          Upload a resume and set the target position to instantly generate a verified digital identity.
        </p>
      </div>

      <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-teal transition-colors">
        {!file && !analyzing && (
          <div className="flex flex-col items-center justify-center">
            
            <div className="w-full max-w-md mb-8 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Company</label>
                <input 
                  type="text" 
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal focus:border-teal outline-none"
                  placeholder="e.g. TCS, Amazon, Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role / Domain</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-teal focus:border-teal outline-none"
                  placeholder="e.g. Cybersecurity, Backend Engineer"
                />
              </div>
            </div>

            <div {...getRootProps()} className="flex flex-col items-center justify-center py-8 cursor-pointer w-full focus:outline-none border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-teal/5 transition-colors">
              <input {...getInputProps()} />
            <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-teal-50 text-teal' : 'bg-gray-50 text-gray-400'}`}>
              <UploadCloud className="w-10 h-10" />
            </div>
            <p className="text-lg font-semibold text-gray-700 mb-1">
              {isDragActive ? 'Drop the resume here...' : 'Drag & drop a resume here'}
            </p>
            <p className="text-sm text-gray-500 mb-6">Supports PDF, DOCX, DOC, TXT (Max 5MB)</p>
            <button className="px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors font-medium">
              Browse Files
            </button>
          </div>
          </div>
        )}

        {file && !analyzing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-blue-100">
              <File className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">{file.name}</p>
            <p className="text-sm text-gray-500 mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setFile(null)}
                className="px-6 py-2.5 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAnalyze}
                className="px-6 py-2.5 bg-teal text-white rounded-lg hover:bg-teal/90 font-medium transition-colors flex items-center shadow-sm"
              >
                <BrainCircuit className="w-4 h-4 mr-2" />
                Analyze & Verify
              </button>
            </div>
          </div>
        )}

        {analyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal animate-spin mb-6" />
            <h3 className="text-xl font-bold text-navy mb-2">Analyzing Resume...</h3>
            
            <div className="w-full max-w-md mt-6">
              <div className="flex justify-between text-sm mb-2 font-medium text-gray-500">
                <span>
                  {progress < 30 ? 'Extracting text...' : 
                   progress < 60 ? 'Mapping skills...' : 
                   progress < 90 ? 'Cross-referencing databases...' : 'Generating profile...'}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-teal h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {!file && !analyzing && (
         <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Note for Demo:</span> Since this is a front-end only prototype without a backend AI parser, uploading a file will simulate the verification process and generate the verified Candidate Profile.
            </p>
         </div>
      )}
    </div>
  );
}
