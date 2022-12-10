import InputField from './InputField';
import SubmitButton from './SubmitButton.js';
import React, { useState } from 'react';
import UserStore from '../store/UserStore';
import { useNavigate, useParams } from 'react-router-dom';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { UserAuth } from '../context/AuthContext';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, SetIsSignUp] = useState(false);
	const navigate = useNavigate();
	const usersCollectionRef = collection(database, 'users');
	const { createUser, login } = UserAuth();

	const setInputValue = (property, val) => {
		val = val.trim();
		if (property === 'email') {
			setEmail(val);
		}
		if (property === 'password') {
			setPassword(val);
		}
		if (val.length > 12) {
			return;
		}
	};
	const resetForm = () => {
		setEmail('');
		setPassword('');
	};

	const submitForm = async () => {
		// const auth = getAuth();
		// console.log(auth);
		// const currentUser = auth.currentUser;
		// const currentUserUid = currentUser.uid;
		if (isSignUp) {
			try {
				const responseUser = await createUser(email, password);
				console.log('this is responseUser - ', responseUser);

				const newtUserUid = responseUser.user.uid;

				await setDoc(doc(database, 'users', newtUserUid), {
					email: email,
				});

				// console.log(
				// 	'this is the newly created user: ',
				// 	// newUserRef.id,
				// 	' and this userRef: ',
				// 	newUserRef
				// );

				// const newUserCollectionRef = doc(database, 'users', newtUserUid);

				// const todoListCollectionRef = collection(newUserCollectionRef, 'todos');
				// await addDoc(todoListCollectionRef, {
				// 	todoTitle: 'hello',
				// });
			} catch (err) {
				alert(err.message);
			}
			SetIsSignUp(false);
			resetForm();
		} else {
			login(email, password)
				.then((response) => {
					console.log(response.user);
					// navigate('/calendar-page');
					navigate('/todo-list');
				})
				.catch((err) => {
					alert(err.message);
				});
		}
	};
	const changeSignUp = () => {
		SetIsSignUp(!isSignUp);
		resetForm();
	};
	return (
		<div className='loginForm'>
			{isSignUp ? 'Sign Up' : 'Log In'}
			<InputField
				type='text'
				placeholder='Username'
				value={email ? email : ''}
				onChange={(val) => setInputValue('email', val)}
			/>
			<InputField
				type='password'
				placeholder='Password'
				value={password ? password : ''}
				onChange={(val) => setInputValue('password', val)}
			/>

			<SubmitButton
				text={isSignUp ? 'Sign Up' : 'Log In'}
				disabled={!email && !password}
				handleClick={submitForm}
			/>

			<p className='bottomText'>
				{isSignUp ? 'Already have an account?' : 'Want to register? '}
				<span className='signup' onClick={() => changeSignUp()}>
					{isSignUp ? 'Login in' : 'Sign up now '}
				</span>
			</p>
		</div>
	);
};

export default LoginForm;
