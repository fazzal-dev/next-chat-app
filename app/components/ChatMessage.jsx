import { auth } from "@/firebase/config";

const ChatMessage = (props) => {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
      <img src={photoURL} alt="User Avatar" />
    </div>
  );
};

export default ChatMessage;
