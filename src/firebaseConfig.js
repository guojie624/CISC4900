// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCAJHX9LociUNQhDI78ZYE5MjAW1Hn2W3s',
	authDomain: 'task-management-3bb3f.firebaseapp.com',
	projectId: 'task-management-3bb3f',
	storageBucket: 'task-management-3bb3f.appspot.com',
	messagingSenderId: '746179989893',
	appId: '1:746179989893:web:c9fd3732edc47e41c7f4ec',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
