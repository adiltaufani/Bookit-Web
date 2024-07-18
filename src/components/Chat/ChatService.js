// src/ChatService.js
import { firestore, auth } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

class ChatService {
  // Get a stream of user data
  getUserStream(callback) {
    const usersCollection = collection(firestore, 'Users');
    return onSnapshot(usersCollection, callback);
  }

  // Get a stream of chat rooms
  getChatRoomsStream() {
    const chatRoomsCollection = collection(firestore, 'chat_rooms');
    return onSnapshot(chatRoomsCollection, snapshot => {
      return snapshot.docs.map(doc => doc.data());
    });
  }

  // Send a message
  async sendMessage(receiverID, message) {
    const currentUserId = auth.currentUser.uid;
    const currentUserEmail = auth.currentUser.email;
    const timestamp = serverTimestamp();

    const newMessage = {
      senderID: currentUserId,
      senderEmail: currentUserEmail,
      receiverID: receiverID,
      message: message,
      timestamp: timestamp,
    };

    // Construct chat room ID for the two users
    const ids = [currentUserId, receiverID].sort();
    const chatRoomId = ids.join('-');

    // Add new message to database
    const chatRoomDoc = doc(firestore, 'chat_rooms', chatRoomId);
    const messagesCollection = collection(chatRoomDoc, 'messages');
    await addDoc(messagesCollection, newMessage);

    // Update last message in the chat room
    await setDoc(chatRoomDoc, {
      lastMessage: {
        senderID: currentUserId,
        senderEmail: currentUserEmail,
        message: message,
        timestamp: timestamp,
      },
    }, { merge: true });
  }

  // Get messages for a chat room
  getMessages(userID, otherUserID) {
    const ids = [userID, otherUserID].sort();
    const chatRoomId = ids.join('-');
    const messagesCollection = collection(firestore, 'chat_rooms', chatRoomId, 'messages');
    return query(messagesCollection, orderBy('timestamp', 'asc'));
  }

  // Get the last message for a chat room
  async getLastMessage(chatRoomId) {
    try {
      const messagesCollection = collection(firestore, 'chat_rooms', chatRoomId, 'messages');
      const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().message;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting last message:', error);
      return null;
    }
  }

  // Get the last message time for a chat room
  async getLastMessageTime(chatRoomId) {
    try {
      const messagesCollection = collection(firestore, 'chat_rooms', chatRoomId, 'messages');
      const q = query(messagesCollection, orderBy('timestamp', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().timestamp.toDate();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting last message time:', error);
      return null;
    }
  }
}

export default new ChatService();
