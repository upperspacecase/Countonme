import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDZiTN7ka5pautJRMj3_IVRy-ueSHEFChg',
  authDomain: 'organic-habits-app.firebaseapp.com',
  projectId: 'organic-habits-app',
  storageBucket: 'organic-habits-app.firebasestorage.app',
  messagingSenderId: '610643083883',
  appId: '1:610643083883:web:62374db3d32f3cff19672e',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
