import React, { useEffect, useState } from 'react';
import ChatService from '../Chat/ChatService';
import { auth } from '../firebase';
import { onSnapshot } from 'firebase/firestore';
import config from '../config';

const HomePage = () => {
  const [userData, setUserData] = useState({});
  const [transactions, setTransactions] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverID, setReceiverID] = useState('');
  const [selectedContact, setSelectedContact] = useState(null); // New state to manage selected contact
  const currentUser = auth.currentUser;

  useEffect(() => {
    const loadUserData = async (uid) => {
      try {
        const response = await fetch(`${config.baseURL}/get_users.php?uid=${uid}`);
        const data = await response.json();
        setUserData(data);
        loadTransactions(data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const loadTransactions = async (sellersId) => {
      try {
        const response = await fetch(`${config.baseURL}/latesttransaction.php?sellers_id=${sellersId}`);
        const data = await response.text();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const userUID = localStorage.getItem('userUID');
    if (userUID) {
      console.log("User UID:", userUID);
      loadUserData(userUID);
    } else {
      console.log("No user UID found.");
    }

    const fetchUsersWithLastMessage = async () => {
      const unsubscribe = ChatService.getUserStream(async (snapshot) => {
        const userList = snapshot.docs
          .map((doc) => doc.data())
          .filter((user) => user.uid !== userUID);

        const usersWithLastMessage = await Promise.all(
          userList.map(async (user) => {
            const ids = [userUID, user.uid].sort();
            const chatRoomId = ids.join('-');
            const lastMessage = await ChatService.getLastMessage(chatRoomId);
            return { ...user, lastMessage };
          })
        );

        setUsers(usersWithLastMessage);
      });

      return () => unsubscribe();
    };

    fetchUsersWithLastMessage();

  }, [currentUser]);

  const handleClick = () => {
    window.location.href = '/notification';
  };

  useEffect(() => {
    if (receiverID) {
      const messagesQuery = ChatService.getMessages(currentUser.uid, receiverID);
      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      return () => unsubscribe();
    }
  }, [receiverID]);

  const handleSendMessage = async () => {
    await ChatService.sendMessage(receiverID, message);
    setMessage('');
  };

  const usersWithMessages = users.filter(user => user.lastMessage);

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-logo">
          <div className="logo">
            <span className="logo-icon">
              <img src="https://assets.codepen.io/285131/almeria-logo.svg" alt="Logo" />
            </span>
            <h1 className="logo-title">
              <span>Book-it</span>
              <span>Seller Page</span>
            </h1>
          </div>
        </div>
        <div className="app-header-navigation">
          <div className="tabs">
            <a href="#" className="active">Dashboard</a>
          </div>
        </div>
        <div className="app-header-actions">
          <button className="user-profile">
            <span id="user-name">{userData.nama || 'Loading...'}</span>
            <span>
              <img id="user-avatar" src={userData.sellers_foto || 'https://assets.codepen.io/285131/almeria-avatar.jpeg'} alt="User Avatar" />
            </span>
          </button>
          <div className="app-header-actions-buttons">
            <button className="icon-button large">
              <i className="ph ph-file-magnifying-glass"></i>
            </button>
            <button className="icon-button large" onClick={handleClick}>
      <i className="ph ph-bell"></i>
    </button>
          </div>
        </div>
        <div className="app-header-mobile">
          <button className="icon-button large">
            <i className="ph-list"></i>
          </button>
        </div>
      </header>
      <div className="app-body">
        <div className="app-body-navigation">
          <nav className="navigation">
            <a href="/myproperty">
              <i className="ph-browsers"></i>
              <span>My Property</span>
            </a>
          </nav>
          <footer className="footer">
            <h1>Book-it<small>©</small></h1>
            <div>Book-it ©<br />All Rights Reserved 2024</div>
          </footer>
        </div>
        <div className="app-body-main-content">
          <section className="service-section">
            <h2>Manage your property</h2>
            <div className="mobile-only">
              <button className="flat-button">Toggle search</button>
            </div>
            <div className="tiles">
              <article className="tile">
                <div className="tile-header">
                  <i className="ph ph-building-apartment"></i>
                  <h3>
                    <span>Publish your Apartment</span>
                    <span>Add new Apartment</span>
                  </h3>
                </div>
                <a href="/addproperty">
                  <span>Add now</span>
                  <span className="icon-button">
                    <i className="ph ph-caret-right"></i>
                  </span>
                </a>
              </article>
              <article className="tile">
                <div className="tile-header">
                  <i className="ph ph-building"></i>
                  <h3>
                    <span>Publish your Hotel</span>
                    <span>Add new Hotel</span>
                  </h3>
                </div>
                <a href="/addproperty">
                  <span>Add now</span>
                  <span className="icon-button">
                    <i className="ph ph-caret-right"></i>
                  </span>
                </a>
              </article>
              <article className="tile">
                <div className="tile-header">
                  <i className="ph ph-tree-palm"></i>
                  <h3>
                    <span>Publish your Villa</span>
                    <span>Add new Villa</span>
                  </h3>
                </div>
                <a href="/addproperty">
                  <span>Add now</span>
                  <span className="icon-button">
                    <i className="ph ph-caret-right"></i>
                  </span>
                </a>
              </article>
            </div>
            <div className="service-section-footer">
              <p>Services are paid according to the current state of the currency and tariff.</p>
            </div>
          </section>
          <section className="transfer-section">
            <div className="transfer-section-header">
              <h2>Latest transaction</h2>
            </div>
            <div className="transfers" id="latesttransaction" dangerouslySetInnerHTML={{ __html: transactions }}></div>
          </section>
        </div>
        <div className="app-body-sidebar">
          <section className="payment-section">
            <h2>Chat</h2>
            <div className="payment-section-header">
              <p>Balas chat tepat waktu ya :o</p>
            </div>
            {usersWithMessages.length > 0 && (
              <div className="contacts-container">
                <div className="contacts">
                  {usersWithMessages.map((user, index) => (
                    <div
                      key={index}
                      className="contact"
                      onClick={() => {
                        setReceiverID(user.uid);
                        setSelectedContact(user);
                      }}
                    >
                      <div className={`pic ${user.username ? user.username.toLowerCase() : ''}`}></div>
                      {user.badge && <div className="badge">{user.badge}</div>}
                      <div className="name">{user.email || 'Unknown User'}</div>
                      <div className="message">{user.lastMessage || 'No messages yet'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedContact && (
              <div className="chat">
                <div className="contact bar">
                  <div className={`pic ${selectedContact.username ? selectedContact.username.toLowerCase() : ''}`}></div>
                  <div className="name">{selectedContact.email || 'Unknown User'}</div>
                  <div className="seen">Today at 12:56</div>
                  <button onClick={() => setSelectedContact(null)}>Close</button> {/* Close button */}
                </div>
                <div className="messages" id="chat">
                  <div className="time">Today at 11:41</div>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.senderID === auth.currentUser.uid ? 'parker' : 'stark'}`}
                    >
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
