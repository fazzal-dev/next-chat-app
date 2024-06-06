"use client";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyD7vWiLriXozaw9q9pk9VOIh6ZmmgH_DIw",
  authDomain: "next-chat-app-60023.firebaseapp.com",
  projectId: "next-chat-app-60023",
  storageBucket: "next-chat-app-60023.appspot.com",
  messagingSenderId: "847534493252",
  appId: "1:847534493252:web:22d07f2cc8b69736ad3611",
  measurementId: "G-S2QPEE3WDB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export default function Home() {
  const [user] = useAuthState(auth);
  return <div>{user ? <ChatRoom /> : <SignIn />}</div>;
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return (
    <div className="sign-in">
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

function SignOut() {
  return (
    <button className="sign-out" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
}

function ChatRoom() {
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"), limit(20));
  const [messages] = useCollectionData(q, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
  };
  return (
    <>
      <div className="sign-out-container">
        <SignOut />
      </div>
      <div className="chat-room">
        <div className="messages">
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </div>
        <form onSubmit={sendMessage} className="send-message-form">
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
      <img src={photoURL} alt="User Avatar" />
    </div>
  );
}
