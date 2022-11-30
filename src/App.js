import "./App.css";
import Login from "./loginpage/login";
import CalendarPage from "./Calendarpage/CalendarPage";
import { Route, Routes } from "react-router-dom";
import login from "./loginpage/login";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/calendarpage" element={<CalendarPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
