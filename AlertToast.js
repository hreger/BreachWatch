import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const AlertToast = forwardRef((props, ref) => {
  const [alerts, setAlerts] = useState([]);

  useImperativeHandle(ref, () => ({
    showAlert: (credentialType, timestamp) => {
      const newAlert = {
        id: Date.now(),
        message: `🔴 Alert sent for High severity leak: ${credentialType} at ${new Date(timestamp).toLocaleTimeString()}`,
        type: 'high'
      };

      setAlerts(prev => [...prev, newAlert]);

      // Simulate sending alert to external service
      console.log('Simulating alert dispatch:', {
        channel: 'telegram',
        severity: 'high',
        credentialType,
        timestamp
      });

      // Remove alert after 5 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
      }, 5000);
    }
  }));

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {alerts.map(alert => (
        <div
          key={alert.id}
          style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '4px',
            marginBottom: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {alert.message}
        </div>
      ))}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
});

export default AlertToast;