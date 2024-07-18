import React, { useEffect, useState } from 'react';
import ChatService from './ChatService';
import { auth } from '../firebase';
import { onSnapshot } from 'firebase/firestore';

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverID, setReceiverID] = useState('');

  useEffect(() => {
    if (receiverID) {
      const messagesQuery = ChatService.getMessages(auth.currentUser.uid, receiverID);
      const unsubscribe = onSnapshot(messagesQuery, snapshot => {
        setMessages(snapshot.docs.map(doc => doc.data()));
      });

      return () => unsubscribe();
    }
  }, [receiverID]);

  const handleSendMessage = async () => {
    await ChatService.sendMessage(receiverID, message);
    setMessage('');
  };

  return (
    <div className="chat">
      <div className="contact bar">
        <div className="pic stark"></div>
        <div className="name">Tony Stark</div>
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverID}
          onChange={(e) => setReceiverID(e.target.value)}
        />
        <div className="seen">Today at 12:56</div>
      </div>
      <div className="messages" id="chat">
        <div className="time">Today at 11:41</div>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderID === auth.currentUser.uid ? 'parker' : 'stark'}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          placeholder="Type your message here!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
