import React, { useState } from 'react';
import Room from './features/room/room'

function App() {
  const [ entered, setEntered ] = useState( false )
  return (
    <div className="App">
      { entered ? (
        <Room />
      ):(
        <div>
          <a href="https://sascacci.com/" target="_blank" rel="noopener noreferrer">sascacci.com</a>
          <br />
          <button onClick={ e => setEntered(true) }>enter room</button>
        </div>
      )}
    </div>
  );
}

export default App;
