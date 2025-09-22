import React from "react";

const App = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'white', color: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#111' }}>Diagnostic Test Page</h1>
      <p style={{ fontSize: '1.2rem', color: '#444' }}>If you are seeing this message, the core of the application is working.</p>
      <p style={{ marginTop: '1rem', color: '#666' }}>This confirms the error is within the application's components. I will fix it in the next step.</p>
    </div>
  );
};

export default App;