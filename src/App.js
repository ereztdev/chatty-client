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
import React, {useState, useEffect} from 'react';
// import logo from './logo.svg';
import './App.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const io = require('socket.io-client');
const socket = io('http://localhost:3011');

function App() {
  // const [message, setMessage] = useState({msg: '', room: ''});

  const [messageCount, setMessageCount] = useState({count: 0, room: ''});
  const [theme, setTheme] = useState('dark');
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoomName] = useState(null);
  const [rooms, setRoomArray] = useState([]);
  const [user, setUser] = useState({user: ''});


  useEffect(() => {
    setRoomArray(roomArray);
    socket.on('receive message', (msg) => console.log(msg))

  }, []);

  useEffect(() => {
    if (room) {
      socket.emit('room', {room});
    }
    socket.on('test', (payload) => {
      console.log('on receive message');
      console.log({payload});
      // setMessageCount(messageCount.count + 1);
    });
  });

  useEffect(() => {
    document.title = `Room: ${room ? room : ''}, Messages: ${messageCount} new messages have been emitted`;
  }, [messageCount]); //only re-run the effect if new message comes in


  const roomArray = [
    'BTC',
    'ETH',
    'DASH',
    'XMR',
  ];

  const handleNewMessage = (room) => {
    console.log('emitting new message');
    let count = messageCount.count + 1;
    setMessageCount({count, room});
    socket.emit('new message', {messageCount});
  };

  const joinRoom = (e) => {
    if (e.target.textContent === room) {
      console.log('same room');
      return false;
    }

    socket.emit('leave room', {room})
    const roomButtons = document.querySelectorAll('.room-button');
    [].forEach.call(roomButtons, function (button) {
      button.style.background = "transparent";
    });
    e.target.style.background = 'red';
    setInRoom(true);
    setRoomName(e.target.textContent);
  };
  const chatHandler = (e) => {
    e.preventDefault();
    e.persist();
    if (e.innerText === 'Clear') {
      return e.target.form[0].value = '';
    }

    let message = e.target.form[0].value;

    if (e.target.form[0].value !== '') {
      socket.emit('new message', {message, room});
      // setMessage({message, room});
    }
    e.target.form[0].value = '';
  };

  const roomSpawner = (rooms) => {
    return rooms.map((value, index) => (
      <button className='btn btn-outline-light m-5 room-button' onClick={joinRoom} key={index}>{value}</button>
    ));
  };

  const getRoom = () => {
    return room;
  }

  const themeHandler = () => {
    let newTheme;
    (theme === 'light')
      ? newTheme = 'dark'
      : newTheme = 'light';
    console.log('new theme: ' + newTheme);
    setTheme(newTheme);
  }

  return (
    <div className={`App Theme-${theme}`}>
      <button onClick={themeHandler} type="button" className="btn btn-default theme-controller" aria-label="Left Align">
        <FontAwesomeIcon icon={theme === 'light' ? 'moon' : 'sun'} size='3x'/>
      </button>
      <header className="App-header">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <h2 className='text-capitalize'>
          {inRoom && `you've entered the ${getRoom()} room`}
          {!inRoom && `Pick a Room to discuss your current trade`}
        </h2>

        <p>{messageCount.count} messages have been emitted</p>
        <div className='rooms--wrapper'>
          {(rooms.length > 0 || rooms.length < 6) ? roomSpawner(rooms) : false}
        </div>

        <form>
          <div className="input-group mb-3 chat">
            <textarea placeholder="Write Something clever.." className="form-control custom-control" rows="3"/>
            <div className="input-group-append">
              <button onClick={chatHandler} className="btn btn-primary" type="submit">Send</button>
              <button onClick={chatHandler} className="btn btn-danger" type="button">Clear</button>
            </div>
          </div>
        </form>
      </header>
    </div>
  );
}

export default App;
