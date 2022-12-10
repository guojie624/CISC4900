import LoginForm from './LoginForm';
import SubmitButton from './SubmitButton.js';
import UserStore from '../store/UserStore';
import './login.css';
import React from 'react';
import { observer } from 'mobx-react';
import { AuthContextProvider } from '../context/AuthContext';

class Login extends React.Component {
	async componentDidMount() {
		// try {
		//   let res = await fetch('./isLoggedIn', {
		//     method: 'post',
		//     headers: {
		//       'Accept': 'application/json',
		//       'Content-Type': 'application/jason'
		//     }
		//   });
		//   let result = await res.jason();
		//   if (result && result.success) {
		//     UserStore.loading = false;
		//     UserStore.isLoggedIn = true;
		//     UserStore.username = result.username;
		//   }
		//   else {
		//     UserStore.loading = false;
		//     UserStore.isLoggedIn = false;
		//   }
		// }
		// catch (e) {
		//   UserStore.loading = false;
		//   UserStore.isLoggedIn = false;
		// }
	}
	async doLogout() {
		try {
			let res = await fetch('./logout', {
				method: 'post',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/jason',
				},
			});
			let result = await res.jason();
			if (result && result.success) {
				UserStore.isLoggedIn = false;
				UserStore.username = '';
			}
		} catch (e) {
			console.log(e);
		}
	}
	render() {
		if (UserStore.loading) {
			return (
				<div className='app'>
					{/* <div className="container">Loading,please wait....</div> */}
				</div>
			);
		} else {
			if (UserStore.isLoggedIn) {
				return (
					<div className='app'>
						<div className='container'>
							Welcome {UserStore.username}
							<SubmitButton
								text={'log out'}
								disabled={false}
								onClick={() => this.doLogout()}
							/>
						</div>
					</div>
				);
			}
		}
		return (
			<AuthContextProvider>
				<div className='container'>
					<LoginForm />
				</div>
			</AuthContextProvider>
		);
	}
}

export default observer(Login);
