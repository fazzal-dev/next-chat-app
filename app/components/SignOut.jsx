import { auth } from "@/firebase/config";

const SignOut = () => {
  return (
    <button className="sign-out" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
};

export default SignOut;
