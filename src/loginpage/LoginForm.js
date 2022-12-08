import InputField from "./InputField";
import SubmitButton from "./SubmitButton.js";
import React, { useState } from "react";
import UserStore from "../store/UserStore";
import { useNavigate, useParams } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonDisabled, SetButtonDisabled] = useState(false);
  const [isSignUp, SetIsSignUp] = useState(false);
  const navigate = useNavigate();
  const setInputValue = (property, val) => {
    val = val.trim();
    if (property === "username") {
      setUsername(val);
    }
    if (property === "password") {
      setPassword(val);
    }
    if (val.length > 12) {
      return;
    }
  };
  const resetForm = () => {
    setUsername("");
    setPassword("");
    SetButtonDisabled(false);
  };

  const submitForm = async () => {
    console.log(`sign up ${isSignUp} 11111`);
    if (!username || !password) {
      SetButtonDisabled(true);
    }

    console.log(`sign up ${isSignUp}`);

    if (isSignUp) {
      SetIsSignUp(false);
      resetForm();
    } else {
      navigate("/calendarpage");
    }

    // try {
    //   let res = await fetch('/login', {
    //     method: 'post',
    //     header: {
    //       'Accept': 'application/jason',
    //       'Content-Type': 'application/jason'
    //     },
    //     body: JSON.stringify({
    //       username: this.state.username,
    //       password: this.state.password
    //     })
    //   });
    //   let result = await res.jason();
    //   if (result && result.success) {
    //     UserStore.isLoggedIn = true;
    //     UserStore.username = result.username;
    //   }
    //   else if (result && result.success === false) {
    //     this.resetForm();
    //     alert(result.msg);

    //   }
    // }
    // catch (e) {
    //   console.log(e)
    //   this.resetForm();

    // }
  };
  const changeSignUp = () => {
    SetIsSignUp(!isSignUp);
    resetForm();
  };
  return (
    <div className="loginForm">
      {isSignUp ? "Sign Up" : "Log In"}
      <InputField
        type="text"
        placeholder="Username"
        value={username ? username : ""}
        onChange={(val) => setInputValue("username", val)}
      />
      <InputField
        type="password"
        placeholder="Password"
        value={password ? password : ""}
        onChange={(val) => setInputValue("password", val)}
      />

      <SubmitButton
        text={isSignUp ? "Sign Up" : "Log In"}
        disabled={buttonDisabled}
        handleClick={submitForm}
      />

      <p className="bottomText">
        {isSignUp ? "Already have an account?" : "Want to register? "}
        <span className="signup" onClick={() => changeSignUp()}>
          {isSignUp ? "Login in" : "Sign up now "}
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
