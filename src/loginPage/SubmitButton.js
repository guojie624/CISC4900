import React from "react";

const SubmitButton = (props) => {
  return (
    <div className="submitButton">
      <button
        className="btn"
        disabled={props.disabled}
        onClick={() => props.handleClick()}
      >
        {props.text}
      </button>
    </div>
  );
};

export default SubmitButton;
