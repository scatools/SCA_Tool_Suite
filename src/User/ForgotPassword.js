import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Jumbotron } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../App.css";
import { auth, sendPasswordResetEmail} from "../Auth/firebase";


const ForgotPassword = ({
  setAlertText,
  setAlertType,
}) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const user = useSelector((state) => state.user);



  useEffect(() => {
    if(user.loggedIn == true){
      history.push("/user");
    }
  }, [user])


  const onSubmit = async () => {
    // For development on local server
    sendPasswordResetEmail(auth, email)
    .then(() => {
         setAlertType("success");
      setAlertText("Reset sent to " + email);
      window.setTimeout(() => setAlertText(false), 4000);
    })
    .catch((error) => {
      setAlertType("danger");
      setAlertText(error.message);
      window.setTimeout(() => setAlertText(false), 4000);
    });
    
  };

  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Forgot password</h2>
          <hr />
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              name="username"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="form-btn-container">
            <button
              className="btn btn-success"
              type="button"
              onClick={onSubmit}
            >
              Send Reset Link
            </button>
            <button href="/login" className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </Jumbotron>
    </Container>
  );
};

export default ForgotPassword;
