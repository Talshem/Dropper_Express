import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);
  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    }
  };

  const sendResetEmail = async (e) => {
    e.preventDefault();
    await axios.post('/passwordReset', {email})
      .then(() => {
        setEmailHasBeenSent(true);
        setError(false)
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <div className="sign">
      <center>
        <h1>Reset</h1>
        <p style={{ whiteSpace: "normal" }}>
          Link to password reset will be send to your email
        </p>
      </center>
      <div>
        <form action="">
          {emailHasBeenSent && <div>An email has been sent to you!</div>}
          {error !== null && <div style={{color:'red'}}>{error}<br/><br/></div>}
          <label htmlFor="userEmail">Email:</label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            placeholder="Input your email"
            onChange={onChangeHandler}
          />
          <br />
          <br />
          <br />
          <br />
          <button onClick={(e) => sendResetEmail(e)} className="signNormal">
            Send me a reset link
          </button>
        </form>
        <br />
        <center>
          <Link
            to="/"
            style={{ textDecoration: "none", color: "rgb(90, 90, 211)" }}
          >
            &larr; back to sign in page
          </Link>
        </center>
      </div>
    </div>
  );
};
export default PasswordReset;
