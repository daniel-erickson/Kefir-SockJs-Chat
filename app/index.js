import K from 'kefir'
import sockjs from 'sockjs-client'

// Init connection to the node server
const sock = new sockjs('http://localhost:9090/echo')

// Dispatch a message
const sendMessage = message => sock.send(JSON.stringify(message)) 

const updateChat = message => 
  document.querySelector('#chat-content').value += ('User ' + message.username + ': ' + message.message + '\n')

// Event listeners 
const sendClick$ = K.fromEvents(document.querySelector('#send'), 'click')

const usernameValue$ = K.fromEvents(document.querySelector('#username'), 'keyup')
  .map(event => event.target.value);

const messageValue$ = K.fromEvents(document.querySelector('#message'), 'keyup')
  .map(event => event.target.value);

// On click merge the username and message values
K.combine([sendClick$],[usernameValue$,messageValue$],(click,username,message) => ({
    username:username,
    message:message
  }))
  .filter(message =>  message.username!=='' && message.message !=='')
  .onValue(message => sendMessage(message))

// On Message update the chat
K.stream(stream => sock.onmessage = message => stream.emit(message))
  .map(message => message.data)
  .onValue(message => updateChat(JSON.parse(message)))
