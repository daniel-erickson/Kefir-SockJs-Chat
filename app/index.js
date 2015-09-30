import K from 'kefir'
import sockjs from 'sockjs-client'

const sock = new sockjs('http://localhost:9090/echo')

const sendMessage = message => {
  sock.send(JSON.stringify(message)) 
}

const updateChat = message => {
  document.querySelector('#chat-content').value += ('User ' + message.username + ': ' + message.message + '\n')
}

// Trace out open and close of socket.
sock.onopen = () => console.log('open')
sock.onclose = () => console.log('close')


sock.onmessage = message => updateChat(JSON.parse(message.data))



// Event listeners from 
const sendClick$ = K.fromEvents(document.querySelector('#send'), 'click')

const usernameValue$ = K.fromEvents(document.querySelector('#username'), 'keyup')
  .map(event => event.target.value);

const messageValue$ = K.fromEvents(document.querySelector('#message'), 'keyup')
  .map(event => event.target.value);


// On click merge the username and message values
const result$ = K.combine([sendClick$],[usernameValue$,messageValue$],(click,username,message) => {
  return {username:username,message:message}
})


// For fun only send a message if the username and message field have values
result$.filter(message =>  message.username!=='' && message.message !=='')
  .onValue(message => sendMessage(message))
