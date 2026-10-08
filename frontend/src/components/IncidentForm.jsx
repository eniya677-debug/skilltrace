import React, { useState } from 'react';

const PRESETS = [
  {
    name: '⚡ Payment DB Timeout (Match)',
    service: 'payment-service',
    endpoint: '/api/v1/charge',
    http_status: 504,
    error_type: 'DatabaseTimeoutError',
    stack_trace: 'Connection pool exhausted after 30000ms at db/pool.py:150 in acquire_connection()'
  },
  {
    name: '🔑 Auth JWT Expired (Match)',
    service: 'auth-service',
    endpoint: '/oauth/token',
    http_status: 401,
    error_type: 'JWTVerificationError',
    stack_trace: 'TokenExpiredError: jwt expired at node_modules/jsonwebtoken/verify.js:120 at auth/jwt.py:48'
  },
  {
    name: '🚫 Billing S3 Denied (Unrelated)',
    service: 'billing-service',
    endpoint: '/api/v2/invoice/export',
    http_status: 403,
    error_type: 'S3AccessDeniedException',
    stack_trace: 'AccessDenied: User arn:aws:iam::1234:user/billing is not authorized to perform s3:GetObject'
  }
];

export default function IncidentForm({ onSubmit, isSubmitting }) {
  const [service, setService] = useState('payment-service');
  const [endpoint, setEndpoint] = useState('/api/v1/charge');
  const [httpStatus, setHttpStatus] = useState(500);
  const [errorType, setErrorType] = useState('DatabaseTimeoutError');
  const [stackTrace, setStackTrace] = useState('Connection pool exhausted after 30000ms at db/pool.py:142 in acquire_connection()');

  const handleApplyPreset = (preset) => {
    setService(preset.service);
    setEndpoint(preset.endpoint);
    setHttpStatus(preset.http_status);
    setErrorType(preset.error_type);
    setStackTrace(preset.stack_trace);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!service || !endpoint || !errorType || !stackTrace) return;
    onSubmit({
      service,
      endpoint,
      http_status: Number(httpStatus),
      error_type: errorType,
      stack_trace: stackTrace
    });
  };

  return (
    <div className="glass-card">
      <div className="section-title">
        <span>Report Production Incident</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>Fingerprinting Active</span>
      </div>

      <div className="presets-container">
        <div className="preset-label">Quick Demo Presets</div>
        <div className="preset-buttons">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-chip"
              onClick={() => handleApplyPreset(p)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. payment-service"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">API Endpoint</label>
            <input
              type="text"
              className="form-input"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="e.g. /api/v1/charge"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">HTTP Status Code</label>
            <input
              type="number"
              className="form-input"
              value={httpStatus}
              onChange={(e) => setHttpStatus(e.target.value)}
              placeholder="500"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Error Exception / Type</label>
            <input
              type="text"
              className="form-input"
              value={errorType}
              onChange={(e) => setErrorType(e.target.value)}
              placeholder="e.g. DatabaseTimeoutError"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Stack Trace Snippet</label>
          <textarea
            className="form-textarea"
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            placeholder="Paste stack trace or error log line here..."
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            'Analyzing Fingerprint...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Run Fingerprint Match &amp; Ingest
            </>
          )}
        </button>
      </form>
    </div>
  );
}
