import React from 'react';

export default function ApprovalButtons({ match, onReuseFix, onInvestigateNew, isSubmitting }) {
  return (
    <div className="action-buttons-group">
      <button
        className="btn-reuse"
        disabled={isSubmitting}
        onClick={() => onReuseFix(match)}
        title="Apply this exact historical fix and record outcome as 'reused'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Use Previous Fix
      </button>

      <button
        className="btn-investigate"
        disabled={isSubmitting}
        onClick={onInvestigateNew}
        title="Ignore match and start a fresh investigation for this failure"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Investigate New
      </button>
    </div>
  );
}
