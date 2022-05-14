import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
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
export const auth = getAuth(app)