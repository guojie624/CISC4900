import React, { useState } from 'react';
import TodoForm from './TodoForm';
import Todo from './todo';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {
	collection,
	addDoc,
	getDocs,
	query,
	where,
	getDoc,
	doc,
} from 'firebase/firestore';
import axios from 'axios';
import { database } from '../firebaseConfig';
function TodoList() {
	const [todos, setTodos] = useState([]);

	const getToDos = async () => {
		const auth = getAuth();
		const currentUser = auth.currentUser;
		console.log('this is current user: ', auth);

		const currentUserRef = doc(database, 'users', currentUser.uid);
		const currentUserSnap = await getDoc(currentUserRef);
		console.log('currentUserSnap: ', currentUserSnap.data());

		const currentUserTodoRef = await getDocs(
			collection(database, `users/${currentUser.uid}/todos`)
		);

		// console.log('currentUserTodoRef - ', currentUserTodoRef);
		currentUserTodoRef.forEach((todoItem) => {
			console.log(todoItem.data());
		});
	};

	useEffect(() => {
		getToDos();
	}, []);

	const addTodo = (todo) => {
		if (!todo.text || /^\s*$/.test(todo.text)) {
			return;
		}

		const newTodos = [todo, ...todos];

		setTodos(newTodos);
		console.log(...todos);
	};

	const updateTodo = (todoId, newValue) => {
		if (!newValue.text || /^\s*$/.test(newValue.text)) {
			return;
		}

		setTodos((prev) =>
			prev.map((item) => (item.id === todoId ? newValue : item))
		);
	};

	const removeTodo = (id) => {
		const removedArr = [...todos].filter((todo) => todo.id !== id);

		setTodos(removedArr);
	};

	const completeTodo = (id) => {
		let updatedTodos = todos.map((todo) => {
			if (todo.id === id) {
				todo.isComplete = !todo.isComplete;
			}
			return todo;
		});
		setTodos(updatedTodos);
	};

	return (
		<>
			<h1>What's the Plan for Today?</h1>
			<TodoForm onSubmit={addTodo} />
			<Todo
				todos={todos}
				completeTodo={completeTodo}
				removeTodo={removeTodo}
				updateTodo={updateTodo}
			/>
		</>
	);
}

export default TodoList;
