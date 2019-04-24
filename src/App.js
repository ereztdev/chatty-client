// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import Example from "./WebSocket";
//
// function App() {
//   return (
//     <div className="App">
//       <Example/>
//
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';

const io = require('socket.io-client');
const socket = io('http://localhost:3011');

function App() {
  const [message, setMessage] = useState([]);

  const [messageCount, setMessageCount] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoomName] = useState('no-room');
  const [rooms, setRoomArray] = useState([]);


  useEffect(() => {
    // todo: commit and remove. this check onload to see if already in room <= not used right.
  //   if(inRoom) {
  //     console.log('joining room',inRoom);
  //     socket.emit('room', {room: 'test-room'});
  //   }
  //
  //   return () => {
  //     if(inRoom) {
  //       console.log('leaving room');
  //       socket.emit('leave room', {
  //         room: 'test-room'
  //       })
  //     }
  //   }
    setRoomArray(roomArray);
  });

  useEffect(() => {
    socket.on('receive message', (payload) => {
      console.log(payload);
      setMessageCount(messageCount + 1);
    });

    document.title = `${messageCount} new messages have been emitted`;
  }, [messageCount]); //only re-run the effect if new message comes in

  /*const handleSetTheme = () => {
    let newTheme;
    (theme === 'light')
      ? newTheme = 'dark'
      : newTheme = 'light';
    console.log('new theme: ' + newTheme);
    setTheme(newTheme);
  }*/

  const handleInRoom = () => {
    inRoom
      ? setInRoom(false)
      : setInRoom(true);
  }
  const roomArray = [
    'BTC',
    'ETH',
    'DASH',
    'XMR',
  ];

  const handleNewMessage = (room) => {
    console.log('emitting new message');
    socket.emit('new message', {room});
    setMessageCount(messageCount + 1);
  };
  const test = (e) =>{
    e.persist();
    console.log(e.target);
    setRoomName(e.target.textContent);
    setInRoom(true);
    console.log("e.target.textContent",e.target.textContent);
  }

  const roomSpawner = (rooms) =>{
   return rooms.map((value,index) => (
      <button onClick={test} key={index}>{value}</button>
    ));
  };

  const getRoom = () =>{
    return room;
  }

  return (
    <div className={`App Theme-${theme}`}>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>
          {inRoom && `You Have Entered ${getRoom()}`  }
          {!inRoom && `Outside Room` }
        </h1>

        <p>{messageCount} messages have been emitted</p>
        <div className='rooms--wrapper'>
          {(rooms.length > 0 || rooms.length < 6)? roomSpawner(rooms) : false}
        </div>

        {/*{inRoom &&*/}
        <button onClick={() => handleNewMessage(room)}>
          Emit new message
        </button>
        {/*}

        <button onClick={() => handleSetTheme()}>
          Toggle Theme
        </button>

        <button onClick={() => handleInRoom()}>
          {inRoom && `Leave Room` }
          {!inRoom && `Enter Room` }
        </button>*/}

      </header>
    </div>
  );
}

export default App;
