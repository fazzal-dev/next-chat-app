const { useState, useRef, useEffect } = require("react");
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "@/firebase/config";
import ChatMessage from "./ChatMessage";
import SignOut from "./SignOut";

function ChatRoom() {
  const messagesRef = collection(firestore, "messages");
  const q = query(messagesRef, orderBy("createdAt"));
  const [messages] = useCollectionData(q, { idField: "id" });
  console.log("messages:", messages);
  const [formValue, setFormValue] = useState("");
  const scroll = useRef();

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
    scroll.current.scrollIntoView({ behavior: "smooth" });
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
          <div ref={scroll}></div>
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

export default ChatRoom;
