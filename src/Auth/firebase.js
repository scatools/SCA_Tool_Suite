import { initializeApp } from 'firebase/app';
import { 
getAuth, 
onAuthStateChanged, 
signInWithEmailAndPassword, 
signOut,
signInWithCustomToken,
sendPasswordResetEmail,
checkActionCode,
applyActionCode,
confirmPasswordReset
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBCsoz9qMeXWhq5SlJo3UWm7F6osGDplXk",
  authDomain: "scatest-f5733.firebaseapp.com",
  projectId: "scatest-f5733",
  storageBucket: "scatest-f5733.appspot.com",
  messagingSenderId: "560869271098",
  appId: "1:560869271098:web:f65c9f5cfeaab691d67703"
};

// Initialize Firebase
initializeApp(firebaseConfig);


const auth = getAuth();

export {
auth,
signInWithCustomToken,
onAuthStateChanged,
signInWithEmailAndPassword,
signOut,
sendPasswordResetEmail,
checkActionCode,
applyActionCode,
confirmPasswordReset
}