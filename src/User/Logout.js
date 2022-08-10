import React, { useEffect } from "react";
import { Container, Jumbotron } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { logoutUserThunk } from  "../Redux/thunk";
import "../App.css";

const Logout = ({ setLoggedIn, setUserLoggedIn }) => {
  const history = useHistory();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(user.loggedIn == true){
      dispatch(logoutUserThunk);
      setLoggedIn(false);
      setUserLoggedIn(null);
    }
    else{
      history.push("/login");
    };
  }, []);

  return (
    <Container>
      <Jumbotron>
        <h2>You have successfully logged out.</h2>
        <hr />
        <p className="lead">
          Thanks for using the SCA Conservation Prioritization Tool!
        </p>
      </Jumbotron>
    </Container>
  );
};

export default Logout;
