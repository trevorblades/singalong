import React from 'react';

const App = () => {
  const text = 'Sorrys';
  const stuff = {red: 'green', color: 'blue'};
  const otherstuff = {
    ...stuff,
    green: 'red'
  };
  return <div style={{color: otherstuff.green}}>{text}</div>;
};

export default App;
