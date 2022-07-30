import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Jumbotron } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "../App.css";
import { logInUser } from "../Redux/action";
import { auth, signInWithEmailAndPassword, checkActionCode, confirmPasswordReset } from "../Auth/firebase";


const Login = ({
  setLoggedIn,
  setUserLoggedIn,
  setAlertText,
  setAlertType,
}) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reset, setResetPassword] = useState(false)
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);



  useEffect(() => {
    if(user.loggedIn == true){
      history.push("/user");
    }
  }, [user])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oob = urlParams.get('oobCode');
    if(oob !== null){
      checkActionCode(auth, oob).then(res => {
        setUsername(res.data.email)
        setResetPassword(true)
      }).catch(e => {
        setAlertType("danger");
        setAlertText("Invalid password reset code!");
        window.setTimeout(() => setAlertText(false), 4000);
      })
    }
  }, [])

  useEffect(() => {
    if(reset === true){
      const urlParams = new URLSearchParams(window.location.search);
      const oob = urlParams.get('oobCode');
      if(oob !== null){
        checkActionCode(auth, oob).catch(e => {
          setResetPassword(false)
        })
      }
      else{
        setResetPassword(false)
      }
    }

  }, [reset])

  useEffect(() => {
    if(reset === true){
      const urlParams = new URLSearchParams(window.location.search);
      const oob = urlParams.get('oobCode');
      if(oob !== null){
        checkActionCode(auth, oob).then(res => {
          if(res.data.email !== username){
            setUsername("")
            setPassword("")
            setResetPassword(false)
            history.push("/login")

          }
        }).catch(e => {
          setAlertType("danger");
          setAlertText("Invalid password reset code!");
          window.setTimeout(() => setAlertText(false), 4000);
        })
      }
      else{
        setResetPassword(false)
      }
    }

  }, [username])

  const onSubmit = async () => {
    // For development on local server
    if(reset === true){
      if(password.length < 6){
        setAlertType("danger");
        setAlertText("Password cannot be below 6 characters");
        window.setTimeout(() => setAlertText(false), 4000);
        return 0
      }

      const urlParams = new URLSearchParams(window.location.search);
      const oob = urlParams.get('oobCode');
      try {
        await checkActionCode(auth, oob)
        await confirmPasswordReset(auth, oob, password)
      } catch (error) {
        setAlertType("danger");
        setAlertText("Password reset failed");
        window.setTimeout(() => setAlertText(false), 4000);
        setUsername("")
        setPassword("")
        setResetPassword(false)
        history.push("/login")
        return 0
      }
    }


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
            {(reset) ? "" : <>
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
            </>}
           
            <label htmlFor="password">{(reset) ? "New Password" : "Password"}</label>
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
          <Link to="/forgotPassword" >Forgot Password?</Link>
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
