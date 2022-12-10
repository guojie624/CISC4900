import { Outlet, Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const PrivateRoutes = () => {
	// let auth = { token: true };
	const { user } = UserAuth();
	return user ? <Outlet /> : <Navigate to='/' />;
};
export default PrivateRoutes;
