import io from 'socket.io-client';

const socket = io.connect("http://localhost:3500"); 

export default socket;
