import Login from './loginPage/login';
import CalendarPage from './Calendarpage/CalendarPage';
import { Route, Routes } from 'react-router-dom';
import TodoList from './todoList/TodoList';
import './App.css';
import PrivateRoutes from './utils/PrivateRoute';
// import { app, database } from './firebaseConfig';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

function App() {
	return (
		<div>
			<Routes>
				<Route element={<PrivateRoutes />}>
					<Route path='/calendar-page' element={<CalendarPage />}></Route>
					<Route path='/todo-list' element={<TodoList />}></Route>
				</Route>
				<Route path='/' element={<Login />}></Route>
			</Routes>
		</div>
	);
}

export default App;
