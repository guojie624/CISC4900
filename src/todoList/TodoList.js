import React, { useState } from 'react';
import { Grid } from '@mui/material';

import TodoForm from './TodoForm';
import { useEffect } from 'react';
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	getDoc,
	doc,
	deleteDoc,
} from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { UserAuth } from '../context/AuthContext';
import TodoItem from './todoItem';
import CurrentDate from './CurrentDate';
import './TodoList.css';
import { useNavigate } from 'react-router-dom';
function TodoList() {
	const navigate = useNavigate();
	const [todos, setTodos] = useState([]);
	const { user, logout } = UserAuth();

	const getTodos = async () => {
		console.log('this is user from getTodos - ', user);
		if (!user.hasOwnProperty('uid')) {
			return;
		}

		console.log('this is user from getTodos - ', user);
		const currentUseruId = user.uid;
		console.log('this is current user: ', currentUseruId);
		const currentUserRef = doc(database, 'users', currentUseruId);

		try {
			const currentUserSnap = await getDoc(currentUserRef);
			console.log('currentUserSnap: ', currentUserSnap.data());
			const currentUserTodoListRef = await getDocs(
				collection(database, `users/${currentUseruId}/todos`)
			);
			console.log('currentUserTodoListRef - ', currentUserTodoListRef);

			const todoList = [];

			currentUserTodoListRef.forEach((todoItem) => {
				console.log('this is todoItem: ', todoItem.data());
				console.log('this is todoItem id: ', todoItem.id);
				todoList.push({
					...todoItem.data(),
					id: todoItem.id,
				});
			});

			setTodos(todoList);
		} catch (err) {
			console.log('there is an err in todoList page: ', err.message);
		}
	};

	useEffect(() => {
		getTodos();
	}, [user]);

	const addTodo = async (todo) => {
		if (!todo || /^\s*$/.test(todo)) {
			return;
		}
		try {
			const currentUserRef = doc(database, 'users', user.uid);
			const todoListCollectionRef = collection(currentUserRef, 'todos');
			const newTodo = {
				todoItem: todo,
				completed: false,
			};
			const newTodoRef = await addDoc(todoListCollectionRef, newTodo);

			console.log('this is newTodoRef - ', newTodoRef.id);

			newTodo['id'] = newTodoRef.id;

			setTodos((prevState) => [...prevState, newTodo]);
		} catch (err) {
			console.log(
				'there is something wrong when tried to add a new todo: ',
				err.message
			);
		}
	};

	const handleUpdateTodo = async (todoId, newValue) => {
		try {
			const currentTodoRef = doc(database, `users/${user.uid}/todos`, todoId);
			await updateDoc(currentTodoRef, {
				todoItem: newValue,
			});

			const currentTodoSnap = await getDoc(currentTodoRef);
			console.info(
				'this is currentTodoSnap after update: ',
				currentTodoSnap.data()
			);

			setTodos((prevTodoListState) =>
				prevTodoListState.map((todo) =>
					todo.id === todoId ? { ...todoId, todoItem: newValue } : todo
				)
			);
		} catch (err) {
			console.log('there is an err in handleUpdateTodo: ', err.message);
		}
	};

	const handleCompleteTodo = async (todoId, currentCompletedState) => {
		try {
			const currentTodoRef = doc(database, `users/${user.uid}/todos`, todoId);

			await updateDoc(currentTodoRef, {
				completed: currentCompletedState,
			});

			const currentTodoSnap = await getDoc(currentTodoRef);
			console.info(
				'this is currentTodoSnap after update: ',
				currentTodoSnap.data()
			);

			setTodos((prevTodoListState) =>
				prevTodoListState.map((todo) =>
					todo.id === todoId
						? { ...todo, completed: currentCompletedState }
						: todo
				)
			);
		} catch (err) {
			console.log('there is an err in handleCompleteTodo: ', err.message);
		}
	};

	const handleDeleteTodo = async (todoId) => {
		try {
			const currentTodoRef = doc(database, `users/${user.uid}/todos`, todoId);

			await deleteDoc(currentTodoRef);

			setTodos((prevTodoListState) =>
				prevTodoListState.filter((todo) => todo.id !== todoId)
			);
		} catch (err) {
			console.log('there is an err in handleDeleteTodo: ', err.message);
		}
	};
	const logoutForm = async () => {
		logout()
			.then((response) => {
				navigate('/');
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<div className='bodyStyle'>
			<h1>Today's To do List</h1>

			<button onClick={logoutForm}>logout</button>
			<CurrentDate className='CurrentDate' />

			<TodoForm onSubmit={addTodo} />
			<Grid style={{ marginTop: '20px' }} container spacing={1}>
				{/* move the completed items to the front */}
				{todos
					.sort((todo1, todo2) => todo1.completed - todo2.completed)
					.map((notCompletedTodo) => (
						<Grid item maxs={6} sm={6} md={4} key={notCompletedTodo.id}>
							<TodoItem
								todoItemInfo={notCompletedTodo}
								handleUpdateTodo={handleUpdateTodo}
								handleChangeCompletState={handleCompleteTodo}
								handleDeleteTodo={handleDeleteTodo}
							/>
						</Grid>
					))}
			</Grid>
		</div>
	);
}

export default TodoList;
