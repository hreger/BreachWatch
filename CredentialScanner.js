import React, { useState, useRef } from 'react';
import ScanHistory from './ScanHistory';
import AlertToast from './AlertToast';

const CredentialScanner = () => {
  const scanHistoryRef = useRef();
  const alertToastRef = useRef();
  const [results, setResults] = useState([]);
  const [textInput, setTextInput] = useState('');
  
  const credentialPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    password: /(password|pwd|pass)=['"']?([^'"'\s]+)/gi,
    awsKey: /\bAKIA[0-9A-Z]{16}\b/g,
    githubToken: /\bghp_[a-zA-Z0-9]{36}\b/g,
    secretKeyword: /(token|secret|key)=['"']?([^'"'\s]+)/gi
  };

  const getDetectionReason = (type, line) => {
    if (type === 'awsKey') {
      return 'Matched AWS Access Key pattern (AKIA followed by 16 characters)';
    }
    if (type === 'githubToken') {
      return 'Matched GitHub Personal Access Token pattern (ghp_ followed by 36 characters)';
    }
    if (type === 'password') {
      return `Password-like pattern detected with keyword: ${line.match(credentialPatterns.password)[1]}`;
    }
    if (type === 'email') {
      const context = line.toLowerCase();
      if (context.includes('token=')) {
        return 'Email found with associated keyword "token="';
      }
      if (context.includes('secret=')) {
        return 'Email found with associated keyword "secret="';
      }
      if (context.includes('key=')) {
        return 'Email found with associated keyword "key="';
      }
      return 'Standard email pattern detected';
    }
    if (type === 'secretKeyword') {
      return `Sensitive keyword detected: ${line.match(credentialPatterns.secretKeyword)[1]}`;
    }
    return 'Pattern matched';
  };

  const determineThreatLevel = (type, line) => {
    if (type === 'awsKey' || type === 'githubToken' || type === 'password') {
      return 'high';
    }
    if (type === 'email' && (
      line.toLowerCase().includes('token=') || 
      line.toLowerCase().includes('secret=') || 
      line.toLowerCase().includes('key=')
    )) {
      return 'medium';
    }
    return 'low';
  };

  const scanText = (text) => {
    const findings = [];
    
    Object.entries(credentialPatterns).forEach(([type, pattern]) => {
      let match;
      const lines = text.split('\n');
      
      lines.forEach((line, lineNumber) => {
        while ((match = pattern.exec(line)) !== null) {
          const threatLevel = determineThreatLevel(type, line);
          findings.push({
            type,
            value: match[0],
            line: lineNumber + 1,
            threatLevel,
            reason: getDetectionReason(type, line)
          });
        }
      });
    });
    
    setResults(findings);
    
    findings.forEach(finding => {
      if (finding.threatLevel === 'high') {
        alertToastRef.current?.showAlert(finding.type, new Date());
      }
    });

    scanHistoryRef.current?.addScanSession(findings, textInput ? 'Text Input' : 'File Upload');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      scanText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    scanText(textInput);
  };

  const getThreatLevelStyle = (level) => ({
    backgroundColor: {
      high: '#ff4444',
      medium: '#ffbb33',
      low: '#00C851'
    }[level],
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    display: 'inline-block'
  });

  const InfoIcon = ({ text }) => (
    <span 
      style={{ 
        marginLeft: '8px',
        cursor: 'help',
        position: 'relative',
        display: 'inline-block'
      }}
      title={text}
    >
      ℹ️
    </span>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Credential Scanner</h2>
      <AlertToast ref={alertToastRef} />
      <ScanHistory ref={scanHistoryRef} />
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Upload a file:</h3>
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleFileUpload}
          style={{ marginBottom: '10px' }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Or paste text:</h3>
        <textarea 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={10}
          cols={50}
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            padding: '8px',
            marginBottom: '10px' 
          }}
        />
        <br />
        <button 
          onClick={handleTextSubmit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Scan Text
        </button>
      </div>
      
      {results.length > 0 && (
        <div>
          <h3>Scan Results:</h3>
          <table style={{ 
            width: '100%', 
            maxWidth: '800px',
            borderCollapse: 'collapse',
            marginTop: '10px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Value</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Line Number</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Threat Level</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr 
                  key={index}
                  style={{ 
                    borderBottom: '1px solid #dee2e6',
                    backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                  }}
                >
                  <td style={{ padding: '10px' }}>
                    {result.type}
                    <InfoIcon text={result.reason} />
                  </td>
                  <td style={{ padding: '10px' }}>{result.value}</td>
                  <td style={{ padding: '10px' }}>{result.line}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={getThreatLevelStyle(result.threatLevel)}>
                      {result.threatLevel.toUpperCase()}
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

export default CredentialScanner;