import React, { useState, useEffect } from 'react';
import { fetchIncidents, ingestIncident, resolveIncident, fetchHealth } from './api';
import IncidentForm from './components/IncidentForm';
import MatchCard from './components/MatchCard';
import Dashboard from './components/Dashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'dashboard'
  const [incidents, setIncidents] = useState([]);
  const [activeMatches, setActiveMatches] = useState(null);
  const [currentIngestedId, setCurrentIngestedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerNotice, setBannerNotice] = useState(null);
  const [apiConnected, setApiConnected] = useState(true);

  const loadIncidents = async () => {
    try {
      const data = await fetchIncidents();
      setIncidents(data);
      setApiConnected(true);
    } catch (err) {
      console.error('Error fetching incidents:', err);
      setApiConnected(false);
    }
  };

  useEffect(() => {
    loadIncidents();
    // Check API health
    fetchHealth().then(() => setApiConnected(true)).catch(() => setApiConnected(false));
  }, []);

  const handleIngest = async (payload) => {
    setIsSubmitting(true);
    setBannerNotice(null);
    try {
      const res = await ingestIncident(payload);
      setCurrentIngestedId(res.incident_id);
      setActiveMatches(res.matches || []);
      await loadIncidents();
    } catch (err) {
      alert('Error ingesting incident: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReuseFix = async (match) => {
    if (!currentIngestedId) return;
    setIsSubmitting(true);
    try {
      await resolveIncident(currentIngestedId, {
        outcome: 'reused',
        root_cause: match.root_cause,
        fix_description: match.fix_description,
        pr_link: match.pr_link
      });
      
      setBannerNotice({
        type: 'success',
        text: `🎉 Fix successfully reused! Incident #${currentIngestedId} resolution marked as REUSED.`
      });
      
      setActiveMatches(null);
      setCurrentIngestedId(null);
      await loadIncidents();
    } catch (err) {
      alert('Error marking fix as reused: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvestigateNew = () => {
    setBannerNotice({
      type: 'info',
      text: `Incident #${currentIngestedId} recorded as an open fresh investigation.`
    });
    setActiveMatches(null);
    setCurrentIngestedId(null);
  };

  const handleManualResolve = async (id, payload) => {
    try {
      await resolveIncident(id, payload);
      setBannerNotice({
        type: 'success',
        text: `Incident #${id} successfully marked as SOLVED.`
      });
      await loadIncidents();
    } catch (err) {
      alert('Failed to resolve incident: ' + err.message);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo">IL</div>
          <div>
            <div className="brand-title">IncidentLoop</div>
            <div className="brand-subtitle">Historical Incident Fingerprint &amp; Fix Memory</div>
          </div>
        </div>

        <div className="header-status" style={apiConnected ? {} : { color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)' }}>
          <div className="pulse-dot" style={apiConnected ? {} : { backgroundColor: 'var(--accent-rose)', boxShadow: '0 0 8px var(--accent-rose)' }}></div>
          {apiConnected ? 'API Connected (localhost:8000)' : 'API Disconnected'}
        </div>
      </header>

      {/* Golden Rule Security Banner */}
      <div className="golden-rule-banner">
        <div className="golden-rule-icon">🛡️</div>
        <div className="golden-rule-content">
          <h4>Golden Rule — Human-in-the-Loop Protocol</h4>
          <p>
            The system never auto-applies an old fix. Prior solution evidence (similarity score, root cause, fix description, PR link) is surfaced for developer review and requires explicit approval via a button click before anything is recorded as reused.
          </p>
        </div>
      </div>

      {/* Flash Notice */}
      {bannerNotice && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          background: bannerNotice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
          border: `1px solid ${bannerNotice.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{bannerNotice.text}</span>
          <button
            onClick={() => setBannerNotice(null)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Ingest &amp; Match Failure
        </button>

        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Knowledge Base ({incidents.length})
        </button>
      </nav>

      {/* Main Body View */}
      {activeTab === 'new' ? (
        <div className="layout-grid">
          {/* Left Column: Form */}
          <IncidentForm onSubmit={handleIngest} isSubmitting={isSubmitting} />

          {/* Right Column: Match Results */}
          <div>
            {activeMatches === null ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.5 }}>⚡</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Match Review</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Submit an incident on the left or select a Quick Demo Preset to run deterministic fingerprint comparison against {incidents.filter(i => i.outcome !== 'open').length} historical fixes.
                </p>
              </div>
            ) : activeMatches.length > 0 ? (
              <div className="glass-card">
                <div className="match-results-header">
                  <div className="section-title">
                    <span>Similarity Match Results for Incident #{currentIngestedId}</span>
                    <span className="badge badge-open">Outcome: Open</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Found {activeMatches.length} historical fix match{activeMatches.length > 1 ? 'es' : ''} with score &ge; 50.0%. Review the evidence below and approve if applicable.
                  </p>
                </div>

                {activeMatches.map((match, idx) => (
                  <MatchCard
                    key={match.incident_id}
                    match={match}
                    rank={idx + 1}
                    onReuseFix={handleReuseFix}
                    onInvestigateNew={handleInvestigateNew}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card">
                <div className="section-title">
                  <span>Match Results for Incident #{currentIngestedId}</span>
                  <span className="badge badge-open">Outcome: Open</span>
                </div>
                <div className="no-match-box">
                  <div className="no-match-icon">🔍</div>
                  <div className="no-match-title">No Prior Solutions Matched (&ge; 50.0%)</div>
                  <div className="no-match-text">
                    This failure signature is distinct from all previously resolved production incidents in the knowledge base.
                  </div>
                  <button
                    className="btn-investigate"
                    onClick={handleInvestigateNew}
                    style={{ width: 'auto', display: 'inline-flex' }}
                  >
                    Proceed with Fresh Investigation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Dashboard
          incidents={incidents}
          onResolveIncident={handleManualResolve}
          onRefresh={loadIncidents}
        />
      )}
    </div>
  );
}
