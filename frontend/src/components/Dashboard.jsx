import React, { useState } from 'react';

export default function Dashboard({ incidents, onResolveIncident, onRefresh }) {
  const [filter, setFilter] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [rootCauseInput, setRootCauseInput] = useState('');
  const [fixInput, setFixInput] = useState('');
  const [prInput, setPrInput] = useState('');

  const totalCount = incidents.length;
  const solvedCount = incidents.filter(i => i.outcome === 'solved').length;
  const reusedCount = incidents.filter(i => i.outcome === 'reused').length;
  const openCount = incidents.filter(i => i.outcome === 'open').length;

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'all') return true;
    return inc.outcome === filter;
  });

  const handleOpenManualResolve = (inc) => {
    setSelectedIncident(inc);
    setRootCauseInput(inc.root_cause || '');
    setFixInput(inc.fix_description || '');
    setPrInput(inc.pr_link || '');
  };

  const handleSaveManualResolve = (e) => {
    e.preventDefault();
    if (!selectedIncident) return;
    onResolveIncident(selectedIncident.id, {
      outcome: 'solved',
      root_cause: rootCauseInput,
      fix_description: fixInput,
      pr_link: prInput
    });
    setSelectedIncident(null);
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalCount}</div>
          <div className="stat-label">Total Recorded</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--accent-emerald)' }}>{solvedCount}</div>
          <div className="stat-label">Originally Solved</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: '#818cf8' }}>{reusedCount}</div>
          <div className="stat-label">Fixes Reused 🚀</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--accent-amber)' }}>{openCount}</div>
          <div className="stat-label">Open / Unresolved</div>
        </div>
      </div>

      {/* Main Knowledge Base Card */}
      <div className="glass-card">
        <div className="section-title">
          <span>Accumulated Knowledge Base</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`preset-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              style={filter === 'all' ? { background: 'var(--primary-indigo)', color: '#fff' } : {}}
            >
              All ({totalCount})
            </button>
            <button
              className={`preset-chip ${filter === 'reused' ? 'active' : ''}`}
              onClick={() => setFilter('reused')}
              style={filter === 'reused' ? { background: 'var(--primary-indigo)', color: '#fff' } : {}}
            >
              Reused ({reusedCount})
            </button>
            <button
              className={`preset-chip ${filter === 'solved' ? 'active' : ''}`}
              onClick={() => setFilter('solved')}
              style={filter === 'solved' ? { background: 'var(--primary-indigo)', color: '#fff' } : {}}
            >
              Solved ({solvedCount})
            </button>
            <button
              className={`preset-chip ${filter === 'open' ? 'active' : ''}`}
              onClick={() => setFilter('open')}
              style={filter === 'open' ? { background: 'var(--primary-indigo)', color: '#fff' } : {}}
            >
              Open ({openCount})
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="incident-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service &amp; Endpoint</th>
                <th>Error &amp; Status</th>
                <th>Outcome</th>
                <th>Root Cause / Fix Summary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    No incidents match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id}>
                    <td>
                      <strong style={{ color: 'var(--text-muted)' }}>#{inc.id}</strong>
                    </td>
                    <td>
                      <div className="table-service">{inc.service}</div>
                      <div className="table-endpoint">{inc.endpoint}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inc.error_type}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>HTTP {inc.http_status}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${inc.outcome}`}>
                        {inc.outcome}
                      </span>
                    </td>
                    <td style={{ maxWidth: '320px' }}>
                      {inc.fix_description ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <strong>Fix:</strong> {inc.fix_description}
                        </div>
                      ) : inc.root_cause ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <strong>Cause:</strong> {inc.root_cause}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', italic: 'true' }}>Pending resolution</span>
                      )}
                    </td>
                    <td>
                      {inc.outcome === 'open' ? (
                        <button
                          className="preset-chip"
                          onClick={() => handleOpenManualResolve(inc)}
                          style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
                        >
                          Resolve Fresh
                        </button>
                      ) : inc.pr_link ? (
                        <a
                          href={inc.pr_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pr-link-badge"
                        >
                          PR Link
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Resolution Modal */}
      {selectedIncident && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '550px' }}>
            <div className="section-title">
              <span>Manual Incident Resolution #{selectedIncident.id}</span>
              <button
                type="button"
                className="preset-chip"
                onClick={() => setSelectedIncident(null)}
              >
                ✕ Close
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Record a fresh fix for {selectedIncident.service} ({selectedIncident.error_type}).
            </p>

            <form onSubmit={handleSaveManualResolve}>
              <div className="form-group">
                <label className="form-label">Root Cause Analysis</label>
                <textarea
                  className="form-textarea"
                  value={rootCauseInput}
                  onChange={(e) => setRootCauseInput(e.target.value)}
                  placeholder="What caused this outage?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fix Description</label>
                <textarea
                  className="form-textarea"
                  value={fixInput}
                  onChange={(e) => setFixInput(e.target.value)}
                  placeholder="How was this issue fixed?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">PR Link (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  value={prInput}
                  onChange={(e) => setPrInput(e.target.value)}
                  placeholder="https://github.com/org/repo/pull/123"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="submit-btn">
                  Save New Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
