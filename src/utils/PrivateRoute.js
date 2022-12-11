import { Outlet, Navigate } from 'react-router-dom';
import { AuthContextProvider, UserAuth } from '../context/AuthContext';

const PrivateRoutes = () => {
	// let auth = { token: true };
	const { user } = UserAuth();
	console.log('this is user in the PrivateRoutes ----------- ', user);
	return user ? (
		<AuthContextProvider>
			<Outlet />
		</AuthContextProvider>
	) : (
		<Navigate to='/' />
	);
};
export default PrivateRoutes;
