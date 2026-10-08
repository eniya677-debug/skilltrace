import React from 'react';
import ApprovalButtons from './ApprovalButtons';

export default function MatchCard({ match, rank, onReuseFix, onInvestigateNew, isSubmitting }) {
  const { incident_id, score, service, endpoint, error_type, http_status, root_cause, fix_description, pr_link } = match;

  return (
    <div className="match-card">
      <div className="match-card-top">
        <div>
          <div className="match-incident-title">
            Matched Incident #{incident_id} ({service})
          </div>
          <div className="match-meta">
            Endpoint: <code style={{ color: 'var(--primary-cyan)' }}>{endpoint}</code> &bull; Error: <strong>{error_type}</strong> ({http_status})
          </div>
        </div>

        <div className="match-score-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          {score}% Match
        </div>
      </div>

      <div className="match-detail-box">
        <div className="detail-label">Prior Root Cause</div>
        <div className="detail-content">{root_cause || 'No root cause documented'}</div>
      </div>

      <div className="match-detail-box">
        <div className="detail-label">Proven Solution / Fix</div>
        <div className="detail-content" style={{ color: '#f8fafc', fontWeight: 500 }}>
          {fix_description || 'No fix description documented'}
        </div>
      </div>

      {pr_link && (
        <div style={{ marginBottom: '0.75rem' }}>
          <a
            href={pr_link}
            target="_blank"
            rel="noopener noreferrer"
            className="pr-link-badge"
          >
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="18" r="3"></circle>
              <circle cx="6" cy="6" r="3"></circle>
              <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
              <line x1="6" y1="9" x2="6" y2="21"></line>
            </svg>
            Pull Request Reference
          </a>
        </div>
      )}

      <ApprovalButtons
        match={match}
        onReuseFix={onReuseFix}
        onInvestigateNew={onInvestigateNew}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
