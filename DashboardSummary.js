import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const DashboardSummary = forwardRef((props, ref) => {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalCredentials: 0,
    highSeverityPercentage: 0
  });

  useEffect(() => {
    // Load initial stats from sessionStorage
    const storedLogs = sessionStorage.getItem('scanLogs');
    if (storedLogs) {
      updateStats(JSON.parse(storedLogs));
    }
  }, []);

  const updateStats = (logs) => {
    const totalScans = logs.length;
    const totalCredentials = logs.reduce((sum, log) => sum + log.totalFindings, 0);
    const scansWithHighSeverity = logs.filter(log => log.severityCounts.high > 0).length;
    const highSeverityPercentage = totalScans > 0 
      ? Math.round((scansWithHighSeverity / totalScans) * 100)
      : 0;

    setStats({
      totalScans,
      totalCredentials,
      highSeverityPercentage
    });
  };

  useImperativeHandle(ref, () => ({
    updateDashboard: () => {
      const storedLogs = sessionStorage.getItem('scanLogs');
      if (storedLogs) {
        updateStats(JSON.parse(storedLogs));
      }
    }
  }));

  const StatCard = ({ title, value, suffix, color }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flex: 1,
      margin: '0 10px',
      textAlign: 'center'
    }}>
      <h3 style={{ 
        color: '#6c757d',
        marginTop: 0,
        marginBottom: '10px',
        fontSize: '1rem'
      }}>
        {title}
      </h3>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: color || '#2c3e50'
      }}>
        {value}{suffix}
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '30px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px'
    }}>
      <StatCard 
        title="Total Scans"
        value={stats.totalScans}
        color="#3498db"
      />
      <StatCard 
        title="Total Credentials Found"
        value={stats.totalCredentials}
        color="#e67e22"
      />
      <StatCard 
        title="High Severity Rate"
        value={stats.highSeverityPercentage}
        suffix="%"
        color={stats.highSeverityPercentage > 50 ? '#e74c3c' : '#2ecc71'}
      />
    </div>
  );
});

export default DashboardSummary;