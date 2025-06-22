import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.style.backgroundColor = isDarkMode ? '#1a1a1a' : '#ffffff';
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      surface: isDarkMode ? '#2d2d2d' : '#f8f9fa',
      text: isDarkMode ? '#ffffff' : '#2c3e50',
      textSecondary: isDarkMode ? '#b3b3b3' : '#6c757d',
      border: isDarkMode ? '#404040' : '#dee2e6',
      primary: '#3498db',
      success: '#2ecc71',
      warning: '#f1c40f',
      danger: '#e74c3c'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};