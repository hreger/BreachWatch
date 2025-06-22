import React, { useState, forwardRef, useImperativeHandle } from 'react';

const ScanHistory = forwardRef((props, ref) => {
  const [scanSessions, setScanSessions] = useState([]);
  const [showHighSeverityOnly, setShowHighSeverityOnly] = useState(false);

  useImperativeHandle(ref, () => ({
    addScanSession: (results, source) => {
      const highestThreat = results.reduce((highest, current) => {
        const threatLevels = { high: 3, medium: 2, low: 1 };
        return threatLevels[current.threatLevel] > threatLevels[highest] ? current.threatLevel : highest;
      }, 'low');

      const newSession = {
        timestamp: new Date().toISOString(),
        source: source,
        detectionCount: results.length,
        highestThreat,
        id: Date.now()
      };

      setScanSessions(prev => [newSession, ...prev]);
    }
  }));

  const filteredSessions = showHighSeverityOnly
    ? scanSessions.filter(session => session.highestThreat === 'high')
    : scanSessions;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getThreatBadgeStyle = (threat) => ({
    backgroundColor: {
      high: '#ff4444',
      medium: '#ffbb33',
      low: '#00C851'
    }[threat],
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-block'
  });

  return (
    <div style={{ padding: '20px', marginTop: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Scan History</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={showHighSeverityOnly}
            onChange={(e) => setShowHighSeverityOnly(e.target.checked)}
          />
          Show only high severity scans
        </label>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Timestamp</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Source</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Detections</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Highest Threat</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map(session => (
              <tr
                key={session.id}
                style={{
                  borderBottom: '1px solid #dee2e6',
                  backgroundColor: session.highestThreat === 'high' ? '#fff8f8' : 'white'
                }}
              >
                <td style={{ padding: '12px' }}>{formatDate(session.timestamp)}</td>
                <td style={{ padding: '12px' }}>{session.source}</td>
                <td style={{ padding: '12px' }}>{session.detectionCount}</td>
                <td style={{ padding: '12px' }}>
                  <span style={getThreatBadgeStyle(session.highestThreat)}>
                    {session.highestThreat.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSessions.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>
                  No scan sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ScanHistory;