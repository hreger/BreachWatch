import React from 'react';
import CredentialScanner from './CredentialScanner';
import { ThemeProvider } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const App = () => {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <CredentialScanner />
    </ThemeProvider>
  );
};

export default App;