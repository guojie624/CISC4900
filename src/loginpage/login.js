import LoginForm from './LoginForm';

// import UserStore from '../store/UserStore';
import './login.css';
import React from 'react';
import { observer } from 'mobx-react';
import { AuthContextProvider } from '../context/AuthContext';

const Login = () => {
	console.log("111111");
	return (

		<AuthContextProvider>
			<div className='container'>
				<LoginForm />
			</div>
		</AuthContextProvider>
	);
};

export default observer(Login);
