import React from 'react';

const App = () => {
  const text = 'Sorrys';
  const stuff = {red: 'green', color: 'blue'};
  const {red} = stuff;
  return <div style={{color: red}}>{text}</div>;
};

export default App;
