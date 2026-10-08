import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { 
  Overview, UploadResume, CandidateProfile, Assessment, AiViva, PromptAssessment, EvidenceTrail, 
  TalentPassport, RecruiterWorkflow, BusinessImpact, 
  EnterpriseAdmin, Ecosystem 
} from './pages/Pages';

function App() {
  return (
    <Router>
      <div className="flex bg-[#f9fafb] min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<UploadResume />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/candidate" element={<CandidateProfile />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/viva" element={<AiViva />} />
            <Route path="/prompt" element={<PromptAssessment />} />
            <Route path="/evidence" element={<EvidenceTrail />} />
            <Route path="/passport" element={<TalentPassport />} />
            <Route path="/workflow" element={<RecruiterWorkflow />} />
            <Route path="/impact" element={<BusinessImpact />} />
            <Route path="/admin" element={<EnterpriseAdmin />} />
            <Route path="/ecosystem" element={<Ecosystem />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
