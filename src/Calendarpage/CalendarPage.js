import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@mui/material/Button';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	getDoc,
	doc,
	deleteDoc,
	Timestamp,
} from 'firebase/firestore';
import { database } from '../firebaseConfig';
import { UserAuth } from '../context/AuthContext';

function CalendarPage() {
	const [allEvents, setAllEvents] = useState([]);
	const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });
	const { user } = UserAuth();
	const locales = {
		'en-US': require('date-fns/locale/en-US'),
	};
	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek,
		getDay,
		locales,
	});

	const clickRef = useRef(null);

	const getCalendars = async () => {
		if (!user.hasOwnProperty('uid')) {
			return;
		}
		const currentUseruId = user.uid;
		const currentUserRef = doc(database, 'users', currentUseruId);
		try {
			const currentUserSnap = await getDoc(currentUserRef);
			console.log('currentUserSnap: ', currentUserSnap.data());
			const currentUserEventRef = await getDocs(
				collection(database, `users/${currentUseruId}/events`)
			);
			console.log('currentUserTodoListRef - ', currentUserEventRef);
			const allEventsexists = [];
			currentUserEventRef.forEach((calendarEvent) => {
				console.log('this is calendarEvent: ', calendarEvent.data());
				console.log('this is calendarEvent id: ', calendarEvent.id);
				const eventInfo = calendarEvent.data();
				allEventsexists.push({
					start: new Timestamp(
						eventInfo.start.seconds,
						eventInfo.start.nanoseconds
					).toDate(),
					end: new Timestamp(
						eventInfo.end.seconds,
						eventInfo.end.nanoseconds
					).toDate(),
					title: eventInfo.title,
					id: calendarEvent.id,
				});
			});
			setAllEvents(allEventsexists);
			console.log('all events :', allEventsexists);
		} catch (err) {
			console.log('there is an err in Calendar Page: ', err.message);
		}
	};
	useEffect(() => {
		getCalendars();
	}, [user]);

	const handleAddEvent = async () => {
		try {
			const currentUserRef = doc(database, 'users', user.uid);
			const eventCollectionRef = collection(currentUserRef, 'events');
			const newEventInfo = {
				title: newEvent.title,
				start: newEvent.start,
				end: newEvent.end,
			};
			let isEventExist = false;
			for (let i = 0; i < allEvents.length; i++) {
				const d1 = new Date(allEvents[i].start);
				const d2 = new Date(newEvent.start);
				const d3 = new Date(allEvents[i].end);
				const d4 = new Date(newEvent.end);
				console.log(d1 <= d2);
				console.log(d2 <= d3);
				console.log(d1 <= d4);
				console.log(d4 <= d3);

				if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
					isEventExist = true;
					alert('CLASH');
					break;
				}
			}
			if (!isEventExist) {
				const newEventRef = await addDoc(eventCollectionRef, newEventInfo);

				console.log('this is newEvnetoRef - ', newEventRef.id);

				newEventInfo['id'] = newEventRef.id;

				setAllEvents((prevState) => [...prevState, newEventInfo]);
			}
		} catch (err) {
			console.log(
				'there is something wrong when tried to add a new event: ',
				err.message
			);
		}
	};
	const onDoubleClickEvent = useCallback((calEvent) => {
		clickRef.current = window.setTimeout(() => {
			window.alert(calEvent, 'onDoubleClickEvent');
		}, 250);
	}, []);

	return (
		<div className='App'>
			<h1>
				Calendar
				<nav style={{ textAlign: 'left' }}>
					<Link to='/todo-list'>My TodoList</Link>
					<></>
				</nav>
			</h1>
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
				onDoubleClickEvent={onDoubleClickEvent}
				style={{ height: 500, margin: '50px' }}
			/>
		</div>
	);
}

export default CalendarPage;
