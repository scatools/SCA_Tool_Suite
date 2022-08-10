import { initializeApp } from 'firebase/app';
import { 
  applyActionCode,
  checkActionCode,
  confirmPasswordReset,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "sca-project-3899b.firebaseapp.com",
  projectId: "sca-project-3899b",
  storageBucket: "sca-project-3899b.appspot.com",
  messagingSenderId: "2469244391",
  appId: "1:2469244391:web:454e2753fe8c271fea6142",
  measurementId: "G-DEZJHVMNXS"
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
};