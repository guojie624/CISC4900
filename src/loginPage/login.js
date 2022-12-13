import LoginForm from "./LoginForm";

// import UserStore from '../store/UserStore';
import "./login.css";
import React from "react";
import { observer } from "mobx-react";
import { AuthContextProvider } from "../context/AuthContext";
import { Container } from "@mui/system";

const Login = () => {
  console.log("111111");
  return (
    <div>
      <h1 className="Title">Wellcome to Calendar Tracker</h1>

      <AuthContextProvider>
        <div className="section">
          <div className="box1">
          <LoginForm />
          </div>
          <div className="box2">
            <h1>Introduction
                 
            </h1>
            <p1>
                Calender Tracker can record all your event online, 
                you can login your account to view, 
                add, or modified all your events anytime.
                you can view all your event in the daily Todo List,
                and Manager more in the Calender.
            </p1>
            <p2>Simply signup your account to manager your life here.</p2>
          </div>
        </div>
      </AuthContextProvider>
    </div>
  );
};

export default observer(Login);
