import React, { useState } from 'react';
import Room from './features/room/room'

function App() {
  const [ entered, setEntered ] = useState( false )
  return (
    <div className="App">
      { entered ? (
        <Room />
      ):(
        <button onClick={ e => setEntered(true) }>enter room</button>
      )}
    </div>
  );
}

export default App;
