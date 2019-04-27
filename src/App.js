import React, {useState, useEffect} from 'react';
import './App.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const io = require('socket.io-client');
const socket = io('http://localhost:3011');

function App() {

  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [inRoom, setInRoom] = useState(false);
  const [room, setRoomName] = useState(null);
  const [rooms, setRoomArray] = useState([]);
  const chatMessagesWindow = document.getElementsByClassName('chat_window--wrapper');

  const roomArray = [
    'BTC',
    'ETH',
    'DASH',
    'XMR',
  ];

  useEffect(() => {
    setRoomArray(roomArray);
    socket.on('RESPONSE_ROOM_MSGS', (data) => {
      setMessages(data)
      chatMessagesWindow[0].scrollTop = chatMessagesWindow[0].scrollHeight;
    });
  }, []);

  useEffect(() => {
    chatMessagesWindow.scrollTop = 155;
    chatMessagesWindow[0].scrollTo(0, chatMessagesWindow.scrollHeight);

    if (room) {
      socket.emit('room', {room});
    }
  }, [room]);

  useEffect(() => {
    document.title = `Room: ${room ? room : ''}`;
  });



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
    socket.emit('QUERY_ROOM_MSGS', room)
  };

  const chatHandler = (e) => {

    var textArea = document.getElementsByClassName('chat_window__input')[0];
    const message = textArea.value;

    if (e) {
      e.preventDefault();
      e.persist();
      if (e.target.innerText === 'Clear') {
        return textArea = '';
      }
      // message = e.target.form[0].value;
    }
    if (message !== '') {
      socket.emit('new message', {message, room});
      // setMessage({message, room});
    }
    textArea.value = '';
  };

  const roomSpawner = (rooms) => {
    return rooms.map((value, index) => (
      <button className='btn btn-outline-light m-5 room-button' onClick={joinRoom} key={index}>{value}</button>
    ));
  };

  const getRoom = () => {
    return room;
  };

  const themeHandler = () => {
    let newTheme;
    (theme === 'light')
      ? newTheme = 'dark'
      : newTheme = 'light';
    console.log('new theme: ' + newTheme);
    setTheme(newTheme);
  }

  const detectEnter = (e) => {
    e.persist();
    if (e.keyCode === 13) {
      chatHandler()
    }
  };

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
        <div className='rooms--wrapper'>
          {(rooms.length > 0 || rooms.length < 6) ? roomSpawner(rooms) : false}
        </div>

        <div className='chat_window--wrapper'>
          {messages.length === 0 ? <h1>ChatWindow.js</h1> : false}
          {messages.map(
            (value, index) => {
              return <div key={index} aria-rowcount={index+1} id={index+1} className='chat_window__message'>{value.user.id}: {value.data.message}</div>;
            })
          }
        </div>
        <form>
          <div className="input-group mb-3 chat">
            <textarea onKeyDown={detectEnter} placeholder="Write Something clever.."
                      className="form-control custom-control chat_window__input" rows="3"/>
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
