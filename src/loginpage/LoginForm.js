import InputField from "./InputField";
import SubmitButton from "./SubmitButton.js";
import React from "react";
import UserStore from "../store/UserStore";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      buttonDisabled: false,
      isSignUp: false,
    };
  }
  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 12) {
      return;
    }
    this.setState({
      [property]: val,
    });
  }
  resetForm() {
    this.setState({
      username: "",
      password: "",
      buttonDisabled: false,
    });
  }
  async submitForm() {
    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }

    this.setState({
      buttonDisabled: true,
    });
    if (this.state.isSignUp) {
      this.setState({
        ...this.state,
        isSignUp: false,
      });
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
  }
  changeSignUp() {
    this.setState({
      ...this.state,
      isSignUp: !this.state.isSignUp,
    });
  }

  render() {
    return (
      <div className="loginForm">
        {this.state.isSignUp ? "Sign Up" : "Log In"}
        <InputField
          type="text"
          placeholder="Username"
          value={this.state.username ? this.state.username : ""}
          onChange={(val) => this.setInputValue("username", val)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={this.state.password ? this.state.password : ""}
          onChange={(val) => this.setInputValue("password", val)}
        />
        <SubmitButton
          text={this.state.isSignUp ? "Sign Up" : "Log In"}
          disabled={this.state.buttonDisabled}
          onClick={() => this.submitForm()}
        />

        <p>
          {this.state.isSignUp
            ? "Already have an account?"
            : "Want to register? "}
          <span className="signup" onClick={() => this.changeSignUp()}>
            {this.state.isSignUp ? "Login in" : "Sign up now"}
          </span>
        </p>
      </div>
    );
  }
}

export default LoginForm;
