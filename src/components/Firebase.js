import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBPu88uSopTwaiGP-PUshWE-ygvKg5_JU",
  authDomain: "kproject-349718.firebaseapp.com",
  projectId: "kproject-349718",
  storageBucket: "kproject-349718.appspot.com",
  messagingSenderId: "724046535439",
  appId: "1:724046535439:web:2957e694f328fd016abc7a"
};

const app = initializeApp(firebaseConfig);
export const firebaseExport = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};