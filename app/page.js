"use client";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "./components/SignIn";
import ChatRoom from "./components/ChatRoom";

export default function Home() {
  const [user] = useAuthState(auth);
  return <div>{user ? <ChatRoom /> : <SignIn />}</div>;
}
