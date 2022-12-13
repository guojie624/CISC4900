import LoginForm from './LoginForm';

import './login.css';
import React from 'react';
import { observer } from 'mobx-react';
import { AuthContextProvider } from '../context/AuthContext';
import { Container } from '@mui/system';

const Login = () => {
	return (
		<div>
			<h1 className='Title'>Wellcome to Calender Tracker</h1>

			<AuthContextProvider>
				<div className='container'>
					<LoginForm />
				</div>
			</AuthContextProvider>
		</div>
	);
};

export default observer(Login);
