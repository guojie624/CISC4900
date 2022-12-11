import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@mui/material/Button';
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
import { database } from '../firebaseConfig';
import { UserAuth } from '../context/AuthContext';

// const events = [
// 	{
// 		title: 'Big Meeting',
// 		allDay: false,
// 		start: new Date(2022, 10, 13, 8),
// 		end: new Date(2022, 10, 13, 9),
// 	},
// 	{
// 		title: 'fsaf',
// 		allDay: false,
// 		start: new Date(2022, 10, 13, 10),
// 		end: new Date(2022, 10, 13, 11),
// 	},
// ];

function CalendarPage() {
	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek,
		getDay,
		locales,
	});
	const locales = {
		'en-US': require('date-fns/locale/en-US'),
	};
	const { user } = UserAuth();
	const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

	const getCalendars = async () => {
		if (!user.hasOwnProperty('uid')) {
			return;
		}
		const currentUseruId = user.uid;
		const currentUserRef = doc(database, 'users', currentUseruId);
		try {
			const currentUserSnap = await getDoc(currentUserRef);
			console.log('currentUserSnap: ', currentUserSnap.data());
			const currentUserTodoListRef = await getDocs(
				collection(database, `users/${currentUseruId}/newevent`)
			const enents = [];
			
			);
		} catch (err) {
			console.log('there is an err in todoList page: ', err.message);
		}
	};
	useEffect(() => {
		getCalendars();
	}, [user]);

	const [allEvents, setAllEvents] = useState(events);
	const collectionRef = collection(database, 'users');
	useEffect(() => {
		const auth = getAuth();

		const onAuthStateChanged = async (user) => {
			const uid = auth.currentUser.uid;
			console.log('this is current loggin user: ', uid);
			const docRef = doc(database, 'users', 'jatogXrrmufqMCLW94Bj');
			const docSnap = await getDoc(docRef);
			console.log('docSnap - ', docSnap.data());
			// const querySnapshot = await getDocs(collectionRef);
			// querySnapshot.forEach((doc) => {
			// 	console.log(`${doc.id}`, doc.data());
			// });
		};

		onAuthStateChanged(auth);
	}, []);

	function handleAddEvent() {
		for (let i = 0; i < allEvents.length; i++) {
			const d1 = new Date(allEvents[i].start);
			const d2 = new Date(newEvent.start);
			const d3 = new Date(allEvents[i].end);
			const d4 = new Date(newEvent.end);
			/*
          console.log(d1 <= d2);
          console.log(d2 <= d3);
          console.log(d1 <= d4);
          console.log(d4 <= d3);
            */

			if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
				alert('CLASH');
				break;
			}
		}

		setAllEvents([...allEvents, newEvent]);
	}

	return (
		<div className='App'>
			<h1>Calendar</h1>
			<h2>Add New Event</h2>
			<div>
				<input
					type='text'
					placeholder='Add Title'
					style={{ width: '20%', marginRight: '10px' }}
					value={newEvent.title}
					onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
				/>
				<DatePicker
					placeholderText='Start Date'
					style={{ marginRight: '10px' }}
					showTimeSelect
					selected={newEvent.start}
					onChange={(start) => setNewEvent({ ...newEvent, start })}
				/>
				<DatePicker
					placeholderText='End Date'
					showTimeSelect
					selected={newEvent.end}
					onChange={(end) => setNewEvent({ ...newEvent, end })}
				/>
				<Button variant='contained' onClick={handleAddEvent}>
					Add Event
				</Button>
			</div>
			<Calendar
				localizer={localizer}
				events={allEvents}
				startAccessor='start'
				endAccessor='end'
				style={{ height: 500, margin: '50px' }}
			/>
		</div>
	);
}

export default CalendarPage;
