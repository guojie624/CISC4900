import InputField from './InputField';
import SubmitButton from './SubmitButton.js';
import React, { useState } from 'react';

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
		if (isSignUp) {
			try {
				const responseUser = await createUser(email, password);
				console.log('this is responseUser - ', responseUser);

				const newtUserUid = responseUser.user.uid;

				await setDoc(doc(database, 'users', newtUserUid), {
					email: email,
				});
			} catch (err) {
				alert(err.message);
			}
			SetIsSignUp(false);
			resetForm();
		} else {
			login(email, password)
				.then((response) => {
					console.log(response.user);

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
