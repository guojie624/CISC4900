import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@mui/material/Button";
import { getAuth } from "firebase/auth";
import { cardContentClasses, Popover, Typography } from "@mui/material";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function CalendarPage() {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [selected, setSelected] = useState({
    title: "",
    start: "",
    end: "",
    id: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [openPopOver, setOpenPopOver] = useState(null);

  const { user, logout } = UserAuth();

  const locales = {
    "en-US": require("date-fns/locale/en-US"),
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const logoutForm = async () => {
    logout()
      .then((response) => {
        navigate("/login");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const getCalendars = async () => {
    if (!user.hasOwnProperty("uid")) {
      return;
    }
    const currentUseruId = user.uid;
    const currentUserRef = doc(database, "users", currentUseruId);
    try {
      const currentUserSnap = await getDoc(currentUserRef);
      console.log("currentUserSnap: ", currentUserSnap.data());
      const currentUserEventRef = await getDocs(
        collection(database, `users/${currentUseruId}/events`)
      );
      console.log("currentUserTodoListRef - ", currentUserEventRef);
      const allEventsexists = [];
      currentUserEventRef.forEach((calendarEvent) => {
        console.log("this is calendarEvent: ", calendarEvent.data());
        console.log("this is calendarEvent id: ", calendarEvent.id);
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
      console.log("all events :", allEventsexists);
    } catch (err) {
      console.log("there is an err in Calendar Page: ", err.message);
    }
  };
  useEffect(() => {
    getCalendars();
  }, [user]);

  const checkEventValid = (checkEvent) => {
    let findMistake = false;
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(checkEvent.start);

      const d2 = new Date(checkEvent.end);
      const today = new Date();

      if (d1 > d2 || d1 < today || d2 < today) {
        findMistake = true;
        alert("CLASH");
        break;
      }
    }

    return findMistake;
  };
  const handleAddEvent = async () => {
    try {
      const currentUserRef = doc(database, "users", user.uid);
      const eventCollectionRef = collection(currentUserRef, "events");
      const newEventInfo = {
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
      };

      const doAction = checkEventValid(newEvent);
      if (!doAction) {
        const newEventRef = await addDoc(eventCollectionRef, newEventInfo);

        console.log("this is newEvnetoRef - ", newEventRef.id);

        newEventInfo["id"] = newEventRef.id;

        setAllEvents((prevState) => [...prevState, newEventInfo]);
      }
    } catch (err) {
      console.log(
        "there is something wrong when tried to add a new event: ",
        err.message
      );
    }
  };
  const handleUpdateEvent = async () => {
    try {
      const doAction = checkEventValid(selected);
      if (doAction) {
        return;
      }
      const currentEventRef = doc(
        database,
        `users/${user.uid}/events`,
        selected.id
      );

      await updateDoc(currentEventRef, {
        start: selected.start,
        end: selected.end,
        title: selected.title,
      });

      const currentEventSnap = await getDoc(currentEventRef);
      console.info(
        "this is currentTodoSnap after update: ",
        currentEventSnap.data()
      );
      setAllEvents((prevEventState) =>
        prevEventState.map((event) =>
          event.id === selected.id ? selected : event
        )
      );
    } catch (err) {
      console.log("there is an err in handleUpdateEvent: ", err.message);
    }
  };
  const handleDeleteEvent = async () => {
    try {
      const currentEventRef = doc(
        database,
        `users/${user.uid}/events`,
        selected.id
      );

      await deleteDoc(currentEventRef);

      setAllEvents((prevallEventsexistsState) =>
        prevallEventsexistsState.filter((event) => event.id !== selected.id)
      );
    } catch (err) {
      console.log("there is an err in handleDeleteEvent: ", err.message);
    }
  };

  const handleSelected = (event) => {
    setSelected(event);
    setAnchorEl(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="App">
      <h1>Calendar</h1>
      <button onClick={logoutForm}>logout</button>
      <Link to="/todo-list">Today's Todo</Link>
      <h2>Add New Event</h2>
      <div>
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: "20%", marginRight: "10px" }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          style={{ marginRight: "10px" }}
          showTimeSelect
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <DatePicker
          placeholderText="End Date"
          showTimeSelect
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />
        <Button variant="contained" onClick={handleAddEvent}>
          Add Event
        </Button>
      </div>
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        selected={selected}
        onSelectEvent={handleSelected}
        style={{ height: 500, margin: "50px" }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={openPopOver}
        onClose={handleClose}
      >
        <Typography>
          <DatePicker
            placeholderText="Start Date"
            showTimeSelect
            selected={selected.start}
            onChange={(start) => setSelected({ ...selected, start })}
          />
          <DatePicker
            placeholderText="End Date"
            showTimeSelect
            selected={selected.end}
            onChange={(end) => setSelected({ ...selected, end })}
          />
          <input
            type="text"
            placeholder="Add Title"
            value={selected.title}
            onChange={(e) =>
              setSelected({ ...selected, title: e.target.value })
            }
          />
          <Button onClick={handleUpdateEvent}>Update</Button>
          <Button onClick={handleDeleteEvent}>Delete</Button>
        </Typography>
      </Popover>
    </div>
  );
}

export default CalendarPage;
