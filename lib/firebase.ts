// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database"; // <-- for Realtime Database
// import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
	apiKey: 'AIzaSyBYKrK5fbROlUMB18PYXaBvAbceabfeM7M',
	authDomain: 'unknown-50.firebaseapp.com',
	databaseURL:
		'https://unknown-50-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'unknown-50',
	storageBucket: 'unknown-50.firebasestorage.app',
	messagingSenderId: '478176458430',
	appId: '1:478176458430:web:cd3b032bbc18f5cc2790ef',
	measurementId: 'G-D49XV4D4YT',
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
