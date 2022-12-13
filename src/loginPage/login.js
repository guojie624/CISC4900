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
        <div className="container">
          <LoginForm />
        </div>
      </AuthContextProvider>
    </div>
  );
};

export default observer(Login);
