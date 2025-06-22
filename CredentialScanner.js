import React, { useState } from 'react';

const CredentialScanner = () => {
  const [results, setResults] = useState([]);
  const [textInput, setTextInput] = useState('');
  
  const credentialPatterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    password: /(password|pwd|pass)=['"]?([^'"\s]+)/gi,
    awsKey: /\bAKIA[0-9A-Z]{16}\b/g,
    githubToken: /\bghp_[a-zA-Z0-9]{36}\b/g
  };

  const scanText = (text) => {
    const findings = [];
    
    Object.entries(credentialPatterns).forEach(([type, pattern]) => {
      let match;
      const lines = text.split('\n');
      
      lines.forEach((line, lineNumber) => {
        while ((match = pattern.exec(line)) !== null) {
          findings.push({
            type,
            value: match[0],
            line: lineNumber + 1
          });
        }
      });
    });
    
    setResults(findings);
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

  return (
    <div>
      <h2>Credential Scanner</h2>
      
      <div>
        <h3>Upload a file:</h3>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>
      
      <div>
        <h3>Or paste text:</h3>
        <textarea 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={10}
          cols={50}
        />
        <button onClick={handleTextSubmit}>Scan Text</button>
      </div>
      
      {results.length > 0 && (
        <div>
          <h3>Scan Results:</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Line Number</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.type}</td>
                  <td>{result.value}</td>
                  <td>{result.line}</td>
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