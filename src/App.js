import Login from "./loginpage/login";
import CalendarPage from "./Calendarpage/CalendarPage";
import { Route, Routes } from "react-router-dom";
import TodoList from "./todolist/TodoList";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/calendarpage" element={<CalendarPage />}></Route>
        <Route path="/todolist" element={<TodoList />}></Route>
      </Routes>
    </div>
  );
}

export default App;
