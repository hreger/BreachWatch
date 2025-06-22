import React, { useState, useEffect } from 'react';

const LogHistory = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    // Load logs from sessionStorage
    const storedLogs = sessionStorage.getItem('scanLogs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  const addScanLog = (findings, source) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      source,
      totalFindings: findings.length,
      severityCounts: {
        high: findings.filter(f => f.threatLevel === 'high').length,
        medium: findings.filter(f => f.threatLevel === 'medium').length,
        low: findings.filter(f => f.threatLevel === 'low').length
      },
      findings
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    sessionStorage.setItem('scanLogs', JSON.stringify(updatedLogs));
  };

  const deleteLog = (logId) => {
    const updatedLogs = logs.filter(log => log.id !== logId);
    setLogs(updatedLogs);
    sessionStorage.setItem('scanLogs', JSON.stringify(updatedLogs));
    if (selectedLog?.id === logId) {
      setSelectedLog(null);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const SeverityBadge = ({ count, type }) => (
    <span style={{
      backgroundColor: {
        high: '#ff4444',
        medium: '#ffbb33',
        low: '#00C851'
      }[type],
      color: 'white',
      padding: '2px 6px',
      borderRadius: '4px',
      marginRight: '8px',
      fontSize: '0.9em'
    }}>
      {type.toUpperCase()}: {count}
    </span>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Scan History</h2>
      
      <table style={{ 
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Date/Time</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Source</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Total Findings</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Severity Breakdown</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr 
              key={log.id}
              style={{ 
                borderBottom: '1px solid #dee2e6',
                backgroundColor: selectedLog?.id === log.id ? '#e9ecef' : 'white'
              }}
            >
              <td style={{ padding: '12px' }}>{formatDate(log.timestamp)}</td>
              <td style={{ padding: '12px' }}>{log.source}</td>
              <td style={{ padding: '12px' }}>{log.totalFindings}</td>
              <td style={{ padding: '12px' }}>
                <SeverityBadge count={log.severityCounts.high} type="high" />
                <SeverityBadge count={log.severityCounts.medium} type="medium" />
                <SeverityBadge count={log.severityCounts.low} type="low" />
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  style={{
                    marginRight: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {selectedLog?.id === log.id ? 'Hide Details' : 'View Details'}
                </button>
                <button
                  onClick={() => deleteLog(log.id)}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLog && (
        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h3>Scan Details</h3>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '10px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#e9ecef' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Line Number</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Threat Level</th>
              </tr>
            </thead>
            <tbody>
              {selectedLog.findings.map((finding, index) => (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}
                >
                  <td style={{ padding: '10px' }}>{finding.type}</td>
                  <td style={{ padding: '10px' }}>{finding.value}</td>
                  <td style={{ padding: '10px' }}>{finding.line}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      backgroundColor: {
                        high: '#ff4444',
                        medium: '#ffbb33',
                        low: '#00C851'
                      }[finding.threatLevel],
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {finding.threatLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LogHistory;