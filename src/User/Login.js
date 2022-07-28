import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Jumbotron } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../App.css";
import { logInUser } from "../Redux/action";
import { auth, signInWithEmailAndPassword } from "../Auth/firebase";


const Login = ({
  setLoggedIn,
  setUserLoggedIn,
  setAlertText,
  setAlertType,
}) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if(user.loggedIn == true){
      history.push("/user");
    }
  }, [user])

  const onSubmit = async () => {
    // For development on local server
    const result = await axios.post(
      'http://localhost:5000/login',
      { username: username, password: password }
    );
    if(result.data.status !== "success"){
      setAlertType("danger");
      setAlertText("Invalid username or password! Please enter again.");
      window.setTimeout(() => setAlertText(false), 4000);
    }
    else{
      try {
        await signInWithEmailAndPassword(auth, result.data.info, password)
          setAlertType("success");
          setAlertText("You have successfully logged in.");
          window.setTimeout(() => setAlertText(false), 4000);
      } catch (error) {
        if(error.code == 'auth/invalid-email'){
            setAlertType("danger");
            setAlertText("Invalid username or password! Please enter again.");
            window.setTimeout(() => setAlertText(false), 4000);
        }
        else if(error.code == 'auth/wrong-password'){
            setAlertType("danger");
            setAlertText("Invalid username or password! Please enter again.");
            window.setTimeout(() => setAlertText(false), 4000);
        }
        else{
            setAlertType("danger");
            setAlertText("Account error - may be disabled.");
            window.setTimeout(() => setAlertText(false), 4000);
        }
      }
    }
    
      
     
    // For production on Heroku
    // const result = await axios.post(
    //   "https://sca-cpt-backend.herokuapp.com/login",
    //   { username: username, password: password }
    // );

    // dispatch(logInUser(true, username));
    // if (result.data.credentials.length === 0) {
    //   setAlertType("danger");
    //   setAlertText("Username doesn't exist! Please register.");
    //   window.setTimeout(() => setAlertText(false), 4000);
    // } else if (!result.data.validLogin) {
    //   setAlertType("danger");
    //   setAlertText("Incorrect password! Please enter again.");
    //   window.setTimeout(() => setAlertText(false), 4000);
    // } else {
    //   setUserLoggedIn(username);
    //   history.push("/user");
    //   setAlertType("success");
    //   setAlertText("You have successfully logged in.");
    //   window.setTimeout(() => setAlertText(false), 4000);
    // }
  };

  return (
    <Container>
      <Jumbotron>
        <div className="form-container">
          <h2>Welcome back, please login</h2>
          <hr />
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className="form-btn-container">
            <button
              className="btn btn-success"
              type="button"
              onClick={onSubmit}
            >
              Log In
            </button>
            <button href="/" className="btn btn-secondary">
              Go Back
            </button>
          </div>
        </div>
      </Jumbotron>
    </Container>
  );
};

export default Login;
